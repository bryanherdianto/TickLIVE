const fs = require("fs");
const path = require("path");
const db = require("../src/database/db");

async function resetDatabase() {
	const filePath = path.join(__dirname, "..", "db", "reset.sql");
	const sql = fs.readFileSync(filePath, "utf8");
	await db.query(sql);
	console.log("Database reset complete. The modern Tickify schema is ready.");
	await db.pool.end();
}

resetDatabase().catch(async (error) => {
	console.error(`Database reset failed: ${error.message}`);
	await db.pool.end().catch(() => {});
	process.exit(1);
});
