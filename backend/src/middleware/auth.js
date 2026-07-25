const { getAuth, requireAuth } = require("@clerk/express");
const db = require("../database/db");

async function requireCurrentUser(req, res, next) {
	try {
		const auth = getAuth(req);
		if (!auth.userId) {
			return res.status(401).json({
				success: false,
				error: { code: "UNAUTHORIZED", message: "Sign in to continue." },
			});
		}

		await db.query(
			`INSERT INTO app_users (clerk_id)
			 VALUES ($1)
			 ON CONFLICT (clerk_id) DO UPDATE SET updated_at = NOW()`,
			[auth.userId],
		);
		req.authUserId = auth.userId;
		return next();
	} catch (error) {
		return next(error);
	}
}

module.exports = { requireAuth, requireCurrentUser };
