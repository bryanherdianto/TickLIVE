require("dotenv").config();

const required = ["PG_CONNECTION_STRING"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
	throw new Error(`Missing required environment variable(s): ${missing.join(", ")}`);
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
};
