require("dotenv").config();

const required = ["PG_CONNECTION_STRING"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
	throw new Error(
		`Missing required environment variable(s): ${missing.join(", ")}`,
	);
}

const midtransIsProduction =
	String(process.env.MIDTRANS_IS_PRODUCTION || "").toLowerCase() === "true";
const midtransServerKey = process.env.MIDTRANS_SERVER_KEY;

// Guardrail against charging real cards by accident: a live key only loads when the
// operator has explicitly opted into production.
if (
	midtransServerKey &&
	!midtransIsProduction &&
	!midtransServerKey.startsWith("SB-")
) {
	throw new Error(
		"MIDTRANS_SERVER_KEY looks like a production key while MIDTRANS_IS_PRODUCTION is false. Use a sandbox key (SB-Mid-server-…) or set MIDTRANS_IS_PRODUCTION=true deliberately.",
	);
}

module.exports = {
	port: Number(process.env.PORT || 3000),
	databaseUrl: process.env.PG_CONNECTION_STRING,
	clerkSecretKey: process.env.CLERK_SECRET_KEY,
	clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
	frontendOrigins: (process.env.FRONTEND_ORIGIN || "http://localhost:5173")
		.split(",")
		.map((origin) => origin.trim())
		.filter(Boolean),
	cloudinary: {
		cloudName: process.env.CLOUDINARY_CLOUD_NAME,
		apiKey: process.env.CLOUDINARY_API_KEY,
		apiSecret: process.env.CLOUDINARY_API_SECRET,
	},
	midtrans: {
		serverKey: midtransServerKey,
		clientKey: process.env.MIDTRANS_CLIENT_KEY,
		isProduction: midtransIsProduction,
	},
};
