const express = require("express");
const cors = require("cors");
const { clerkMiddleware } = require("@clerk/express");
const env = require("./config/env");
const apiRoutes = require("./routes/api.routes");
const { notFound, errorHandler } = require("./middleware/error-handler");

const app = express();

if (!env.clerkSecretKey || !env.clerkPublishableKey) {
	throw new Error(
		"Missing required environment variable(s): CLERK_SECRET_KEY, CLERK_PUBLISHABLE_KEY",
	);
}

app.use(
	cors({
		origin(origin, callback) {
			if (!origin || env.frontendOrigins.includes(origin))
				return callback(null, true);
			return callback(new Error("Origin is not allowed by CORS."));
		},
		methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	}),
);
app.use(express.json({ limit: "1mb" }));
app.use(
	clerkMiddleware({
		secretKey: env.clerkSecretKey,
		publishableKey: env.clerkPublishableKey,
	}),
);

app.get("/", (req, res) =>
	res.json({ success: true, data: { name: "Tickify API" } }),
);
app.use("/api", apiRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
