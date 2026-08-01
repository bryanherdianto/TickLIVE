const express = require("express");
const { requireAuth } = require("@clerk/express");
const db = require("../database/db");
const { requireCurrentUser } = require("../middleware/auth");
const { upload } = require("../middleware/upload");
const { uploadImage } = require("../utils/cloudinary");
const { httpError } = require("../utils/http-error");
const env = require("../config/env");
const {
	createSnapTransaction,
	getTransactionStatus,
	verifyNotificationSignature,
	resolveOutcome,
	INSTANT_PAYMENTS,
	SUPPORTED_CURRENCY,
} = require("../utils/midtrans");
const { createSlug } = require("../utils/slug");

const router = express.Router();
const authenticated = [requireAuth(), requireCurrentUser];

function ok(res, data, status = 200, meta) {
	return res
		.status(status)
		.json({ success: true, data, ...(meta ? { meta } : {}) });
}

function required(value, name) {
	if (value === undefined || value === null || String(value).trim() === "") {
		throw httpError(400, "VALIDATION_ERROR", `${name} is required.`);
	}
	return value;
}

function positiveNumber(value, name) {
	const number = Number(value);
	if (!Number.isFinite(number) || number < 0) {
		throw httpError(
			400,
			"VALIDATION_ERROR",
			`${name} must be a valid positive number.`,
		);
	}
	return number;
}

// Rupiah has no minor unit and Midtrans rejects fractional amounts, so prices are whole numbers.
function wholeNumber(value, name) {
	const number = positiveNumber(value, name);
	if (!Number.isInteger(number)) {
		throw httpError(
			400,
			"VALIDATION_ERROR",
			`${name} must be a whole number of ${SUPPORTED_CURRENCY}.`,
		);
	}
	return number;
}

function supportedCurrency(value) {
	const currency = String(value || SUPPORTED_CURRENCY).toUpperCase();
	if (currency !== SUPPORTED_CURRENCY) {
		throw httpError(
			400,
			"UNSUPPORTED_CURRENCY",
			`Payments settle through Midtrans, which only supports ${SUPPORTED_CURRENCY}.`,
		);
	}
	return currency;
}

function parseArray(value, fallback = []) {
	if (Array.isArray(value)) return value;
	if (typeof value === "string") {
		try {
			const parsed = JSON.parse(value);
			return Array.isArray(parsed) ? parsed : fallback;
		} catch {
			return fallback;
		}
	}
	return fallback;
}

// upload.any() is used on create routes so gallery/lineup files can be addressed by field
// name (galleryImage_0, lineupImage_2, …) instead of by position, which breaks when only
// some rows carry a file.
function filesByField(req) {
	const files = new Map();
	for (const file of req.files || []) {
		if (!files.has(file.fieldname)) files.set(file.fieldname, file);
	}
	return files;
}

async function ownedVenue(venueId, ownerId, client = db) {
	const result = await client.query(
		"SELECT id, name FROM venues WHERE id = $1 AND owner_clerk_id = $2",
		[venueId, ownerId],
	);
	if (result.rowCount === 0)
		throw httpError(404, "VENUE_NOT_FOUND", "Venue not found.");
	return result.rows[0];
}

async function ownedEvent(eventId, ownerId, client = db) {
	const result = await client.query(
		"SELECT id, title FROM events WHERE id = $1 AND owner_clerk_id = $2",
		[eventId, ownerId],
	);
	if (result.rowCount === 0)
		throw httpError(404, "EVENT_NOT_FOUND", "Event not found.");
	return result.rows[0];
}

async function eventDetail(idOrSlug, publicOnly = true) {
	const event = await db.query(
		`SELECT e.id, e.title, e.slug, e.category, e.badge_text AS "badgeText", e.summary, e.description,
		e.hero_image_url AS "heroImageUrl", e.doors_at AS "doorsAt", e.starts_at AS "startsAt",
		e.ends_at AS "endsAt", e.currency, e.status, e.created_at AS "createdAt", e.updated_at AS "updatedAt", jsonb_build_object(
			'id', v.id, 'name', v.name, 'slug', v.slug, 'address', v.address,
			'city', v.city, 'countryCode', v.country_code, 'capacity', v.capacity,
			'imageUrl', v.image_url, 'latitude', v.latitude, 'longitude', v.longitude
		) AS venue
		FROM events e JOIN venues v ON v.id = e.venue_id
		WHERE (e.id::text = $1 OR e.slug = $1) ${publicOnly ? "AND e.status = 'published'" : ""}`,
		[idOrSlug],
	);
	if (event.rowCount === 0)
		throw httpError(404, "EVENT_NOT_FOUND", "Event not found.");
	const value = event.rows[0];
	const [images, lineup, pricing] = await Promise.all([
		db.query(
			'SELECT id, image_url AS "imageUrl", alt_text AS "altText", position FROM event_images WHERE event_id = $1 ORDER BY position',
			[value.id],
		),
		db.query(
			'SELECT id, name, role, image_url AS "imageUrl", position FROM event_lineup WHERE event_id = $1 ORDER BY position',
			[value.id],
		),
		db.query(
			`SELECT MIN(price) AS \"minPrice\", MAX(price) AS \"maxPrice\", COUNT(*) FILTER (WHERE status = 'available')::int AS \"availableSeats\" FROM seats WHERE event_id = $1`,
			[value.id],
		),
	]);
	return {
		...value,
		images: images.rows,
		lineup: lineup.rows,
		pricing: pricing.rows[0],
	};
}

async function venueDetail(idOrSlug, publicOnly = true) {
	const venue = await db.query(
		`SELECT id, name, slug, address, city, country_code AS "countryCode", latitude, longitude,
		description, image_url AS "imageUrl", capacity, rating, audio_system AS "audioSystem",
		lighting_system AS "lightingSystem", stage_area_sqm AS "stageAreaSqm", status,
		created_at AS "createdAt", updated_at AS "updatedAt"
		FROM venues WHERE (id::text = $1 OR slug = $1) ${publicOnly ? "AND status = 'active'" : ""}`,
		[idOrSlug],
	);
	if (venue.rowCount === 0)
		throw httpError(404, "VENUE_NOT_FOUND", "Venue not found.");
	const value = venue.rows[0];
	const [images, events] = await Promise.all([
		db.query(
			'SELECT id, image_url AS "imageUrl", alt_text AS "altText", position FROM venue_images WHERE venue_id = $1 ORDER BY position',
			[value.id],
		),
		db.query(
			`SELECT id, title, slug, category, hero_image_url AS \"heroImageUrl\", doors_at AS \"doorsAt\", starts_at AS \"startsAt\", ends_at AS \"endsAt\", status FROM events WHERE venue_id = $1 ${publicOnly ? "AND status = 'published'" : ""} ORDER BY starts_at ASC`,
			[value.id],
		),
	]);
	return { ...value, images: images.rows, events: events.rows };
}

router.get("/health", async (req, res, next) => {
	try {
		await db.query("SELECT 1");
		return ok(res, { status: "ok", database: "connected" });
	} catch (error) {
		return next(error);
	}
});

router.get("/events", async (req, res, next) => {
	try {
		const { search, category, city, from, to, minPrice, maxPrice } = req.query;
		const page = Math.max(1, Number(req.query.page) || 1);
		const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 12));
		const params = [];
		const where = ["e.status = 'published'"];
		const add = (clause, value) => {
			params.push(value);
			where.push(clause.replace("?", `$${params.length}`));
		};
		if (search)
			add(
				"(e.title ILIKE ? OR e.summary ILIKE ? OR v.name ILIKE ?)",
				`%${search}%`,
			);
		if (search) {
			const i = params.length;
			where[where.length - 1] =
				`(e.title ILIKE $${i} OR e.summary ILIKE $${i} OR v.name ILIKE $${i})`;
		}
		if (category) add("e.category ILIKE ?", category);
		if (city) add("v.city ILIKE ?", city);
		if (from) add("e.starts_at >= ?::timestamptz", from);
		if (to) add("e.starts_at <= ?::timestamptz", to);
		if (minPrice !== undefined)
			add(
				"EXISTS (SELECT 1 FROM seats s WHERE s.event_id = e.id AND s.price >= ?)",
				Number(minPrice),
			);
		if (maxPrice !== undefined)
			add(
				"EXISTS (SELECT 1 FROM seats s WHERE s.event_id = e.id AND s.price <= ?)",
				Number(maxPrice),
			);
		params.push(limit, (page - 1) * limit);
		const result = await db.query(
			`SELECT e.id, e.title, e.slug, e.category, e.badge_text AS "badgeText", e.summary,
			e.hero_image_url AS "heroImageUrl", e.starts_at AS "startsAt", e.ends_at AS "endsAt", e.currency,
			jsonb_build_object('id', v.id, 'name', v.name, 'city', v.city, 'address', v.address) AS venue,
			MIN(s.price) AS "minPrice", MAX(s.price) AS "maxPrice",
			COUNT(s.id) FILTER (WHERE s.status = 'available')::int AS "availableSeats"
			FROM events e JOIN venues v ON v.id = e.venue_id LEFT JOIN seats s ON s.event_id = e.id
			WHERE ${where.join(" AND ")}
			GROUP BY e.id, v.id ORDER BY e.starts_at ASC LIMIT $${params.length - 1} OFFSET $${params.length}`,
			params,
		);
		return ok(res, result.rows, 200, { page, limit });
	} catch (error) {
		return next(error);
	}
});

router.get("/events/:idOrSlug/seats", async (req, res, next) => {
	try {
		const event = await eventDetail(req.params.idOrSlug);
		await db.query(
			"UPDATE seats SET status = 'available', hold_expires_at = NULL WHERE event_id = $1 AND status = 'held' AND hold_expires_at < NOW()",
			[event.id],
		);
		const seats = await db.query(
			`SELECT id, zone_code AS "zoneCode", label, price, status FROM seats WHERE event_id = $1 ORDER BY zone_code, label`,
			[event.id],
		);
		return ok(res, {
			event: { id: event.id, title: event.title, currency: event.currency },
			seats: seats.rows,
		});
	} catch (error) {
		return next(error);
	}
});

router.get("/events/:idOrSlug", async (req, res, next) => {
	try {
		return ok(res, await eventDetail(req.params.idOrSlug));
	} catch (error) {
		return next(error);
	}
});

router.get("/venues", async (req, res, next) => {
	try {
		const { search, city } = req.query;
		const params = [];
		const where = ["v.status = 'active'"];
		if (search) {
			params.push(`%${search}%`);
			where.push(
				`(v.name ILIKE $${params.length} OR v.city ILIKE $${params.length})`,
			);
		}
		if (city) {
			params.push(city);
			where.push(`v.city ILIKE $${params.length}`);
		}
		const result = await db.query(
			`SELECT v.id, v.name, v.slug, v.city, v.address, v.capacity, v.rating, v.image_url AS "imageUrl",
			(SELECT e.title FROM events e WHERE e.venue_id = v.id AND e.status = 'published' AND e.starts_at <= NOW() AND (e.ends_at IS NULL OR e.ends_at >= NOW()) ORDER BY e.starts_at DESC LIMIT 1) AS "currentEvent"
			FROM venues v WHERE ${where.join(" AND ")} ORDER BY v.name`,
			params,
		);
		return ok(res, result.rows);
	} catch (error) {
		return next(error);
	}
});

router.get("/venues/:idOrSlug", async (req, res, next) => {
	try {
		return ok(res, await venueDetail(req.params.idOrSlug));
	} catch (error) {
		return next(error);
	}
});

router.put("/me", ...authenticated, async (req, res, next) => {
	try {
		const { email, firstName, lastName } = req.body;
		const user = await db.query(
			`UPDATE app_users SET email = COALESCE($2, email), first_name = COALESCE($3, first_name), last_name = COALESCE($4, last_name)
			 WHERE clerk_id = $1 RETURNING clerk_id AS "clerkId", email, first_name AS "firstName", last_name AS "lastName"`,
			[req.authUserId, email || null, firstName || null, lastName || null],
		);
		return ok(res, user.rows[0]);
	} catch (error) {
		return next(error);
	}
});

// Releasing a hold must also drop its ticket_seats rows. That table has UNIQUE (seat_id), so a
// leftover row from an abandoned checkout would permanently block every future ticket from
// including that seat, even once the seat itself is back to 'available'.
async function releaseHeldSeats(ticketIds, client = db) {
	if (ticketIds.length === 0) return;
	await client.query(
		`UPDATE seats SET status = 'available', hold_expires_at = NULL
		 WHERE id IN (SELECT seat_id FROM ticket_seats WHERE ticket_id = ANY($1::uuid[])) AND status = 'held'`,
		[ticketIds],
	);
	await client.query(
		"DELETE FROM ticket_seats WHERE ticket_id = ANY($1::uuid[])",
		[ticketIds],
	);
}

// Expires every hold that has run out and frees the seats behind it.
async function sweepExpiredHolds(client = db) {
	const expired = await client.query(
		"UPDATE tickets SET status = 'expired' WHERE status = 'pending' AND expires_at < NOW() RETURNING id",
	);
	await releaseHeldSeats(
		expired.rows.map((row) => row.id),
		client,
	);
	// Catches seats whose hold lapsed without a ticket behind them.
	await client.query(
		"UPDATE seats SET status = 'available', hold_expires_at = NULL WHERE status = 'held' AND hold_expires_at < NOW()",
	);
}

router.get("/me/tickets", ...authenticated, async (req, res, next) => {
	try {
		await sweepExpiredHolds();
		const tickets = await db.query(
			`SELECT t.id, t.status, t.currency, t.subtotal, t.fees, t.total, t.expires_at AS "expiresAt", t.created_at AS "createdAt",
			e.id AS "eventId", e.title AS "eventTitle", e.slug AS "eventSlug", e.starts_at AS "startsAt", e.hero_image_url AS "heroImageUrl",
			v.name AS "venueName", v.city AS "venueCity",
			COALESCE(jsonb_agg(jsonb_build_object('id', s.id, 'label', s.label, 'zoneCode', s.zone_code, 'price', ts.unit_price)) FILTER (WHERE s.id IS NOT NULL), '[]') AS seats
			FROM tickets t JOIN events e ON e.id = t.event_id JOIN venues v ON v.id = e.venue_id
			LEFT JOIN ticket_seats ts ON ts.ticket_id = t.id LEFT JOIN seats s ON s.id = ts.seat_id
			WHERE t.customer_clerk_id = $1 GROUP BY t.id, e.id, v.id ORDER BY t.created_at DESC`,
			[req.authUserId],
		);
		return ok(res, tickets.rows);
	} catch (error) {
		return next(error);
	}
});

// Holds seats for 15 minutes. Only a confirmed Midtrans payment issues the ticket; this route
// never marks one paid.
router.post("/tickets", ...authenticated, async (req, res, next) => {
	try {
		const seatIds = parseArray(req.body.seatIds);
		if (
			seatIds.length === 0 ||
			!seatIds.every((id) => typeof id === "string")
		) {
			throw httpError(
				400,
				"VALIDATION_ERROR",
				"At least one seatId is required.",
			);
		}
		const ticket = await db.transaction(async (client) => {
			// Clears lapsed holds first, including their ticket_seats rows, so seats abandoned
			// mid-checkout can be selected again rather than staying locked by UNIQUE (seat_id).
			await sweepExpiredHolds(client);
			const seats = await client.query(
				`SELECT s.id, s.event_id, s.price, s.status, e.currency, e.status AS event_status
				 FROM seats s JOIN events e ON e.id = s.event_id WHERE s.id = ANY($1::uuid[]) FOR UPDATE`,
				[seatIds],
			);
			if (
				seats.rowCount !== seatIds.length ||
				new Set(seats.rows.map((seat) => seat.event_id)).size !== 1
			) {
				throw httpError(
					400,
					"INVALID_SEATS",
					"Seats must exist and belong to the same event.",
				);
			}
			if (
				seats.rows.some(
					(seat) =>
						seat.status !== "available" || seat.event_status !== "published",
				)
			) {
				throw httpError(
					409,
					"SEATS_UNAVAILABLE",
					"One or more selected seats are no longer available.",
				);
			}
			const subtotal = seats.rows.reduce(
				(sum, seat) => sum + Number(seat.price),
				0,
			);
			const created = await client.query(
				`INSERT INTO tickets (event_id, customer_clerk_id, status, currency, subtotal, fees, total, expires_at)
				 VALUES ($1, $2, 'pending', $3, $4, 0, $4, NOW() + INTERVAL '15 minutes') RETURNING *`,
				[
					seats.rows[0].event_id,
					req.authUserId,
					seats.rows[0].currency,
					subtotal,
				],
			);
			for (const seat of seats.rows) {
				await client.query(
					"INSERT INTO ticket_seats (ticket_id, seat_id, unit_price) VALUES ($1, $2, $3)",
					[created.rows[0].id, seat.id, seat.price],
				);
			}
			await client.query(
				"UPDATE seats SET status = 'held', hold_expires_at = NOW() + INTERVAL '15 minutes' WHERE id = ANY($1::uuid[])",
				[seatIds],
			);
			return created.rows[0];
		});
		return ok(res, ticket, 201);
	} catch (error) {
		return next(error);
	}
});

// Single place where a Midtrans result becomes a ticket outcome, shared by the webhook and
// the browser-driven status check. Both paths must stay convergent, and this must be safe to
// run repeatedly: Midtrans retries notifications, and serverless can process retries
// concurrently, so every write is guarded on the row still being in the state it expects.
async function applyPaymentOutcome(orderId, notification) {
	return db.transaction(async (client) => {
		const payment = await client.query(
			"SELECT * FROM payments WHERE order_id = $1 FOR UPDATE",
			[orderId],
		);
		if (payment.rowCount === 0) {
			throw httpError(404, "PAYMENT_NOT_FOUND", "Unknown payment order.");
		}
		const record = payment.rows[0];
		const outcome = resolveOutcome(notification);

		// The callback body is attacker-controllable until proven otherwise, so a settlement
		// only counts when the amount matches what we recorded when the order was created.
		if (
			outcome === "settled" &&
			Number(notification.gross_amount) !== Number(record.gross_amount)
		) {
			throw httpError(
				400,
				"PAYMENT_AMOUNT_MISMATCH",
				"Reported amount does not match this order.",
			);
		}

		await client.query(
			`UPDATE payments SET status = $2::payment_status, payment_type = COALESCE($3, payment_type),
			 transaction_status = $4, fraud_status = $5, raw_notification = $6 WHERE id = $1`,
			[
				record.id,
				outcome,
				notification.payment_type || null,
				notification.transaction_status || null,
				notification.fraud_status || null,
				notification,
			],
		);

		if (outcome === "settled") {
			const claimed = await client.query(
				"UPDATE tickets SET status = 'paid', expires_at = NULL WHERE id = $1 AND status = 'pending' RETURNING id",
				[record.ticket_id],
			);
			// Zero rows means a concurrent retry already issued this ticket; the seat update
			// would be a no-op repeat, so skip it rather than re-running the write.
			if (claimed.rowCount === 1) {
				await client.query(
					`UPDATE seats SET status = 'booked', hold_expires_at = NULL
					 WHERE id IN (SELECT seat_id FROM ticket_seats WHERE ticket_id = $1)`,
					[record.ticket_id],
				);
			}
		} else if (outcome === "failed" || outcome === "expired") {
			const released = await client.query(
				"UPDATE tickets SET status = 'expired' WHERE id = $1 AND status = 'pending' RETURNING id",
				[record.ticket_id],
			);
			if (released.rowCount === 1) {
				await releaseHeldSeats([record.ticket_id], client);
			}
		}
		return { orderId, outcome, ticketId: record.ticket_id };
	});
}

async function payableTicket(ticketId, ownerId) {
	const result = await db.query(
		`SELECT t.*, e.title AS "eventTitle" FROM tickets t JOIN events e ON e.id = t.event_id
		 WHERE t.id = $1 AND t.customer_clerk_id = $2`,
		[ticketId, ownerId],
	);
	if (result.rowCount === 0) {
		throw httpError(404, "TICKET_NOT_FOUND", "Ticket not found.");
	}
	return result.rows[0];
}

// Creates (or re-serves) a Snap token for a held ticket.
router.post("/tickets/:id/pay", ...authenticated, async (req, res, next) => {
	try {
		const ticket = await payableTicket(req.params.id, req.authUserId);
		if (ticket.status !== "pending") {
			throw httpError(
				409,
				"TICKET_NOT_PAYABLE",
				`This ticket is already ${ticket.status}.`,
			);
		}
		const expiresAt = new Date(ticket.expires_at);
		const millisecondsLeft = expiresAt.getTime() - Date.now();
		if (millisecondsLeft <= 0) {
			throw httpError(
				409,
				"TICKET_EXPIRED",
				"This seat hold has expired. Please select seats again.",
			);
		}
		supportedCurrency(ticket.currency);
		const grossAmount = Number(ticket.total);
		if (!Number.isInteger(grossAmount) || grossAmount < 1) {
			throw httpError(
				400,
				"INVALID_AMOUNT",
				`This ticket total cannot be charged: ${SUPPORTED_CURRENCY} amounts must be whole numbers of at least 1.`,
			);
		}

		// Reuse a live token so reopening checkout does not strand a half-finished order.
		const existing = await db.query(
			`SELECT order_id AS "orderId", snap_token AS "snapToken" FROM payments
			 WHERE ticket_id = $1 AND status = 'pending' AND snap_token IS NOT NULL
			 ORDER BY created_at DESC LIMIT 1`,
			[ticket.id],
		);
		if (existing.rowCount === 1) {
			return ok(res, {
				...existing.rows[0],
				clientKey: env.midtrans.clientKey,
			});
		}

		const attempts = await db.query(
			"SELECT COUNT(*)::int AS count FROM payments WHERE ticket_id = $1",
			[ticket.id],
		);
		// Midtrans rejects a reused order_id, so each attempt gets its own suffix.
		const orderId = `TKF-${ticket.id}-${attempts.rows[0].count + 1}`;
		const seats = await db.query(
			`SELECT s.id, s.label, s.zone_code AS "zoneCode", ts.unit_price AS "unitPrice"
			 FROM ticket_seats ts JOIN seats s ON s.id = ts.seat_id WHERE ts.ticket_id = $1 ORDER BY s.label`,
			[ticket.id],
		);
		const customer = await db.query(
			"SELECT email, first_name AS \"firstName\", last_name AS \"lastName\" FROM app_users WHERE clerk_id = $1",
			[req.authUserId],
		);

		const itemDetails = seats.rows.map((seat) => ({
			id: seat.id,
			price: Number(seat.unitPrice),
			quantity: 1,
			name: `${ticket.eventTitle} ${seat.zoneCode}-${seat.label}`.slice(0, 50),
		}));
		// Midtrans requires the line items to sum exactly to gross_amount, and each price to be
		// a whole number. Older events may hold fractional seat prices, so fall back to one line.
		const itemsAreValid =
			itemDetails.length > 0 &&
			itemDetails.every((item) => Number.isInteger(item.price)) &&
			itemDetails.reduce((sum, item) => sum + item.price, 0) === grossAmount;

		const snap = await createSnapTransaction({
			transaction_details: { order_id: orderId, gross_amount: grossAmount },
			item_details: itemsAreValid
				? itemDetails
				: [
						{
							id: ticket.id,
							price: grossAmount,
							quantity: 1,
							name: String(ticket.eventTitle).slice(0, 50),
						},
					],
			customer_details: {
				first_name: (customer.rows[0] && customer.rows[0].firstName) || "Tickify",
				last_name: (customer.rows[0] && customer.rows[0].lastName) || "Guest",
				email: (customer.rows[0] && customer.rows[0].email) || undefined,
			},
			// Instant channels only: anything asynchronous could settle after the seat hold is
			// swept, leaving a paid ticket whose seats have already been released.
			enabled_payments: INSTANT_PAYMENTS,
			// Expire the Snap session with the hold for the same reason.
			expiry: {
				unit: "minute",
				duration: Math.max(1, Math.floor(millisecondsLeft / 60000)),
			},
			callbacks: {
				finish: `${env.frontendOrigins[0]}/checkout?ticketId=${ticket.id}`,
			},
		});

		await db.query(
			`INSERT INTO payments (ticket_id, order_id, gross_amount, currency, snap_token)
			 VALUES ($1, $2, $3, $4, $5)`,
			[ticket.id, orderId, grossAmount, ticket.currency, snap.token],
		);
		return ok(res, {
			orderId,
			snapToken: snap.token,
			clientKey: env.midtrans.clientKey,
		});
	} catch (error) {
		return next(error);
	}
});

// Browser-driven fallback for when the webhook has not landed yet — or cannot, because the
// API is running on localhost. Asks Midtrans directly rather than trusting the client.
router.post(
	"/tickets/:id/payment/sync",
	...authenticated,
	async (req, res, next) => {
		try {
			const ticket = await payableTicket(req.params.id, req.authUserId);
			const payment = await db.query(
				"SELECT order_id FROM payments WHERE ticket_id = $1 ORDER BY created_at DESC LIMIT 1",
				[ticket.id],
			);
			if (payment.rowCount === 0) {
				throw httpError(
					404,
					"PAYMENT_NOT_FOUND",
					"No payment has been started for this ticket.",
				);
			}
			const orderId = payment.rows[0].order_id;
			const status = await getTransactionStatus(orderId);
			const result = await applyPaymentOutcome(orderId, status);
			return ok(res, result);
		} catch (error) {
			return next(error);
		}
	},
);

// Public endpoint: anyone can POST here, so the signature check is what makes it trustworthy.
router.post("/webhooks/midtrans", async (req, res, next) => {
	try {
		const notification = req.body || {};
		if (!verifyNotificationSignature(notification)) {
			throw httpError(
				401,
				"INVALID_SIGNATURE",
				"Signature verification failed.",
			);
		}
		const result = await applyPaymentOutcome(notification.order_id, notification);
		return ok(res, result);
	} catch (error) {
		return next(error);
	}
});

router.get(
	"/me/organizer/summary",
	...authenticated,
	async (req, res, next) => {
		try {
			const summary = await db.query(
				`SELECT
			(SELECT COUNT(*)::int FROM venues WHERE owner_clerk_id = $1) AS "totalVenues",
			(SELECT COUNT(*)::int FROM events WHERE owner_clerk_id = $1) AS "totalEvents",
			(SELECT COUNT(*)::int FROM events WHERE owner_clerk_id = $1 AND status = 'published' AND starts_at >= NOW()) AS "activeEvents",
			(SELECT COUNT(ts.seat_id)::int FROM events e JOIN tickets t ON t.event_id = e.id AND t.status = 'paid' JOIN ticket_seats ts ON ts.ticket_id = t.id WHERE e.owner_clerk_id = $1) AS "ticketsSold",
			(SELECT COALESCE(SUM(t.total), 0) FROM events e JOIN tickets t ON t.event_id = e.id WHERE e.owner_clerk_id = $1 AND t.status = 'paid') AS revenue`,
				[req.authUserId],
			);
			return ok(res, summary.rows[0]);
		} catch (error) {
			return next(error);
		}
	},
);

router.get("/me/venues", ...authenticated, async (req, res, next) => {
	try {
		const venues = await db.query(
			`SELECT v.*, (SELECT COUNT(*)::int FROM events e WHERE e.venue_id = v.id AND e.status = 'published' AND e.starts_at >= NOW()) AS "activeEvents",
			(SELECT COALESCE(SUM(t.total), 0) FROM events e JOIN tickets t ON t.event_id = e.id WHERE e.venue_id = v.id AND t.status = 'paid') AS revenue
			FROM venues v WHERE v.owner_clerk_id = $1 ORDER BY v.created_at DESC`,
			[req.authUserId],
		);
		return ok(res, venues.rows);
	} catch (error) {
		return next(error);
	}
});

router.post(
	"/me/venues",
	...authenticated,
	upload.any(),
	async (req, res, next) => {
		try {
			const body = req.body;
			const files = filesByField(req);
			const images = parseArray(body.images);
			// Upload to Cloudinary before opening the transaction so no DB connection is held during network I/O.
			const imageUrl =
				(await uploadImage(files.get("image"), "tickify/venues")) ||
				body.imageUrl ||
				null;
			const galleryUrls = await Promise.all(
				images.map((image, index) =>
					uploadImage(files.get(`galleryImage_${index}`), "tickify/venues"),
				),
			);
			const venue = await db.transaction(async (client) => {
				const created = await client.query(
					`INSERT INTO venues (owner_clerk_id, name, slug, address, city, country_code, latitude, longitude, description, image_url, capacity, rating, audio_system, lighting_system, stage_area_sqm, status)
				 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,COALESCE($16::venue_status, 'active')) RETURNING *`,
					[
						req.authUserId,
						required(body.name, "name"),
						createSlug(body.name),
						required(body.address, "address"),
						required(body.city, "city"),
						body.countryCode || null,
						body.latitude === undefined ? null : Number(body.latitude),
						body.longitude === undefined ? null : Number(body.longitude),
						body.description || null,
						imageUrl,
						positiveNumber(required(body.capacity, "capacity"), "capacity"),
						body.rating === undefined
							? 0
							: positiveNumber(body.rating, "rating"),
						body.audioSystem || null,
						body.lightingSystem || null,
						body.stageAreaSqm === undefined
							? null
							: positiveNumber(body.stageAreaSqm, "stageAreaSqm"),
						body.status || null,
					],
				);
				for (const [index, image] of images.entries()) {
					const url = galleryUrls[index] || (image && image.imageUrl) || null;
					if (!url)
						throw httpError(
							400,
							"VALIDATION_ERROR",
							"Each gallery image needs an uploaded file or an imageUrl.",
						);
					await client.query(
						"INSERT INTO venue_images (venue_id, image_url, alt_text, position) VALUES ($1, $2, $3, $4)",
						[created.rows[0].id, url, (image && image.altText) || null, index],
					);
				}
				return created.rows[0];
			});
			return ok(res, venue, 201);
		} catch (error) {
			return next(error);
		}
	},
);

router.patch(
	"/me/venues/:id",
	...authenticated,
	upload.single("image"),
	async (req, res, next) => {
		try {
			await ownedVenue(req.params.id, req.authUserId);
			const body = req.body;
			const imageUrl =
				(await uploadImage(req.file, "tickify/venues")) ||
				body.imageUrl ||
				null;
			const venue = await db.query(
				`UPDATE venues SET name = COALESCE($3, name), address = COALESCE($4, address), city = COALESCE($5, city), country_code = COALESCE($6, country_code), description = COALESCE($7, description), image_url = COALESCE($8, image_url), capacity = COALESCE($9, capacity), rating = COALESCE($10, rating), audio_system = COALESCE($11, audio_system), lighting_system = COALESCE($12, lighting_system), stage_area_sqm = COALESCE($13, stage_area_sqm), status = COALESCE($14::venue_status, status), latitude = COALESCE($15, latitude), longitude = COALESCE($16, longitude) WHERE id = $1 AND owner_clerk_id = $2 RETURNING *`,
				[
					req.params.id,
					req.authUserId,
					body.name || null,
					body.address || null,
					body.city || null,
					body.countryCode || null,
					body.description || null,
					imageUrl,
					body.capacity === undefined
						? null
						: positiveNumber(body.capacity, "capacity"),
					body.rating === undefined
						? null
						: positiveNumber(body.rating, "rating"),
					body.audioSystem || null,
					body.lightingSystem || null,
					body.stageAreaSqm === undefined
						? null
						: positiveNumber(body.stageAreaSqm, "stageAreaSqm"),
					body.status || null,
					body.latitude === undefined ? null : Number(body.latitude),
					body.longitude === undefined ? null : Number(body.longitude),
				],
			);
			return ok(res, venue.rows[0]);
		} catch (error) {
			return next(error);
		}
	},
);

router.delete("/me/venues/:id", ...authenticated, async (req, res, next) => {
	try {
		await ownedVenue(req.params.id, req.authUserId);
		await db.query("DELETE FROM venues WHERE id = $1 AND owner_clerk_id = $2", [
			req.params.id,
			req.authUserId,
		]);
		return res.status(204).end();
	} catch (error) {
		return next(error);
	}
});

router.get("/me/events", ...authenticated, async (req, res, next) => {
	try {
		const events = await db.query(
			`SELECT e.*, v.name AS "venueName", COUNT(ts.seat_id)::int AS "ticketsSold", COALESCE(SUM(t.total) FILTER (WHERE t.status = 'paid'), 0) AS revenue
			FROM events e JOIN venues v ON v.id = e.venue_id LEFT JOIN tickets t ON t.event_id = e.id AND t.status = 'paid' LEFT JOIN ticket_seats ts ON ts.ticket_id = t.id
			WHERE e.owner_clerk_id = $1 GROUP BY e.id, v.id ORDER BY e.starts_at DESC`,
			[req.authUserId],
		);
		return ok(res, events.rows);
	} catch (error) {
		return next(error);
	}
});

router.post(
	"/me/events",
	...authenticated,
	upload.any(),
	async (req, res, next) => {
		try {
			const body = req.body;
			await ownedVenue(required(body.venueId, "venueId"), req.authUserId);
			const currency = supportedCurrency(body.currency);
			const files = filesByField(req);
			const images = parseArray(body.images);
			const lineup = parseArray(body.lineup);
			// Upload to Cloudinary before opening the transaction so no DB connection is held during network I/O.
			const imageUrl =
				(await uploadImage(files.get("image"), "tickify/events")) ||
				body.heroImageUrl ||
				null;
			const galleryUrls = await Promise.all(
				images.map((image, index) =>
					uploadImage(files.get(`galleryImage_${index}`), "tickify/events"),
				),
			);
			const lineupUrls = await Promise.all(
				lineup.map((artist, index) =>
					uploadImage(files.get(`lineupImage_${index}`), "tickify/lineup"),
				),
			);
			const event = await db.transaction(async (client) => {
				const created = await client.query(
					`INSERT INTO events (owner_clerk_id, venue_id, title, slug, category, badge_text, summary, description, hero_image_url, doors_at, starts_at, ends_at, currency, status)
				 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14::event_status) RETURNING *`,
					[
						req.authUserId,
						body.venueId,
						required(body.title, "title"),
						createSlug(body.title),
						required(body.category, "category"),
						body.badgeText || null,
						body.summary || null,
						body.description || null,
						imageUrl,
						body.doorsAt || null,
						required(body.startsAt, "startsAt"),
						body.endsAt || null,
						currency,
						body.status || "draft",
					],
				);
				const seats = parseArray(body.seats);
				for (const seat of seats) {
					if (!seat || !seat.zoneCode || !seat.label)
						throw httpError(
							400,
							"VALIDATION_ERROR",
							"Each seat needs zoneCode and label.",
						);
					await client.query(
						"INSERT INTO seats (event_id, zone_code, label, price) VALUES ($1, $2, $3, $4)",
						[
							created.rows[0].id,
							seat.zoneCode,
							seat.label,
							wholeNumber(seat.price, "seat price"),
						],
					);
				}
				for (const [index, image] of images.entries()) {
					const url = galleryUrls[index] || (image && image.imageUrl) || null;
					if (!url)
						throw httpError(
							400,
							"VALIDATION_ERROR",
							"Each gallery image needs an uploaded file or an imageUrl.",
						);
					await client.query(
						"INSERT INTO event_images (event_id, image_url, alt_text, position) VALUES ($1, $2, $3, $4)",
						[created.rows[0].id, url, (image && image.altText) || null, index],
					);
				}
				for (const [index, artist] of lineup.entries()) {
					if (!artist || !artist.name)
						throw httpError(
							400,
							"VALIDATION_ERROR",
							"Each lineup entry needs a name.",
						);
					await client.query(
						"INSERT INTO event_lineup (event_id, name, role, image_url, position) VALUES ($1, $2, $3, $4, $5)",
						[
							created.rows[0].id,
							artist.name,
							artist.role || null,
							lineupUrls[index] || artist.imageUrl || null,
							index,
						],
					);
				}
				return created.rows[0];
			});
			return ok(res, event, 201);
		} catch (error) {
			return next(error);
		}
	},
);

router.patch(
	"/me/events/:id",
	...authenticated,
	upload.single("image"),
	async (req, res, next) => {
		try {
			await ownedEvent(req.params.id, req.authUserId);
			const body = req.body;
			if (body.venueId) await ownedVenue(body.venueId, req.authUserId);
			if (body.currency) supportedCurrency(body.currency);
			const imageUrl =
				(await uploadImage(req.file, "tickify/events")) ||
				body.heroImageUrl ||
				null;
			const event = await db.query(
				`UPDATE events SET venue_id = COALESCE($3, venue_id), title = COALESCE($4, title), category = COALESCE($5, category), badge_text = COALESCE($6, badge_text), summary = COALESCE($7, summary), description = COALESCE($8, description), hero_image_url = COALESCE($9, hero_image_url), doors_at = COALESCE($10, doors_at), starts_at = COALESCE($11, starts_at), ends_at = COALESCE($12, ends_at), currency = UPPER(COALESCE($13, currency)), status = COALESCE($14::event_status, status) WHERE id = $1 AND owner_clerk_id = $2 RETURNING *`,
				[
					req.params.id,
					req.authUserId,
					body.venueId || null,
					body.title || null,
					body.category || null,
					body.badgeText || null,
					body.summary || null,
					body.description || null,
					imageUrl,
					body.doorsAt || null,
					body.startsAt || null,
					body.endsAt || null,
					body.currency || null,
					body.status || null,
				],
			);
			return ok(res, event.rows[0]);
		} catch (error) {
			return next(error);
		}
	},
);

router.delete("/me/events/:id", ...authenticated, async (req, res, next) => {
	try {
		await ownedEvent(req.params.id, req.authUserId);
		await db.query("DELETE FROM events WHERE id = $1 AND owner_clerk_id = $2", [
			req.params.id,
			req.authUserId,
		]);
		return res.status(204).end();
	} catch (error) {
		return next(error);
	}
});

module.exports = router;
