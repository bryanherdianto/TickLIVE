const crypto = require("crypto");
const env = require("../config/env");
const { httpError } = require("./http-error");

const configured = Boolean(env.midtrans.serverKey && env.midtrans.clientKey);

const SNAP_BASE_URL = env.midtrans.isProduction
	? "https://app.midtrans.com/snap/v1"
	: "https://app.sandbox.midtrans.com/snap/v1";
const API_BASE_URL = env.midtrans.isProduction
	? "https://api.midtrans.com/v2"
	: "https://api.sandbox.midtrans.com/v2";

// Only channels that settle while the buyer is still on the page. Anything asynchronous
// (bank transfer / virtual account, convenience store) can be paid hours later, long after
// the 15 minute seat hold has been swept and the seats released.
const INSTANT_PAYMENTS = ["credit_card", "gopay", "shopeepay", "qris"];

// Midtrans pays out in rupiah only, and gross_amount must be a whole number of it.
const SUPPORTED_CURRENCY = "IDR";

function authorizationHeader() {
	return `Basic ${Buffer.from(`${env.midtrans.serverKey}:`).toString("base64")}`;
}

function ensureConfigured() {
	if (!configured) {
		throw httpError(
			503,
			"PAYMENTS_UNAVAILABLE",
			"Midtrans is not configured on this server.",
		);
	}
}

async function midtransRequest(url, options = {}) {
	ensureConfigured();
	let response;
	try {
		response = await fetch(url, {
			...options,
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: authorizationHeader(),
				...options.headers,
			},
		});
	} catch {
		// Sandbox has no uptime guarantee, so a network failure is an expected outcome.
		throw httpError(
			502,
			"PAYMENT_PROVIDER_UNREACHABLE",
			"Could not reach Midtrans. Please try again in a moment.",
		);
	}
	const payload = await response.json().catch(() => null);
	if (!response.ok) {
		const detail =
			(payload &&
				(payload.status_message ||
					(payload.error_messages || []).join(" "))) ||
			"Midtrans rejected the request.";
		throw httpError(502, "PAYMENT_PROVIDER_ERROR", detail);
	}
	return payload;
}

function createSnapTransaction(payload) {
	return midtransRequest(`${SNAP_BASE_URL}/transactions`, {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

function getTransactionStatus(orderId) {
	return midtransRequest(`${API_BASE_URL}/${encodeURIComponent(orderId)}/status`);
}

// Midtrans signs notifications by hashing fields rather than the raw body, so the standard
// express.json() parser is all this needs.
function verifyNotificationSignature(notification) {
	if (!configured || !notification || !notification.signature_key) return false;
	const expected = crypto
		.createHash("sha512")
		.update(
			`${notification.order_id}${notification.status_code}${notification.gross_amount}${env.midtrans.serverKey}`,
		)
		.digest("hex");
	const received = String(notification.signature_key);
	if (received.length !== expected.length) return false;
	return crypto.timingSafeEqual(Buffer.from(received), Buffer.from(expected));
}

// Collapses Midtrans' transaction_status/fraud_status pair into what the ticket should become.
// `capture` with a `challenge` fraud status is deliberately left pending: the money is held
// but flagged for review, so the ticket must not be issued yet.
function resolveOutcome(notification) {
	const status = notification.transaction_status;
	const fraud = notification.fraud_status;
	if (status === "capture") {
		if (fraud === "challenge") return "pending";
		return fraud === "deny" ? "failed" : "settled";
	}
	if (status === "settlement") return "settled";
	if (status === "pending") return "pending";
	if (status === "deny" || status === "cancel" || status === "failure") {
		return "failed";
	}
	if (status === "expire") return "expired";
	if (status === "refund" || status === "partial_refund") return "refunded";
	return "pending";
}

module.exports = {
	configured,
	createSnapTransaction,
	getTransactionStatus,
	verifyNotificationSignature,
	resolveOutcome,
	INSTANT_PAYMENTS,
	SUPPORTED_CURRENCY,
};
