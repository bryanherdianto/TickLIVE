const fs = require("fs");
const path = require("path");
const db = require("../src/database/db");

// Applies every db/migrations/*.sql in filename order. Each migration is written to be
// re-runnable, so this stays safe to invoke repeatedly.
async function migrate() {
	const directory = path.join(__dirname, "..", "db", "migrations");
	if (!fs.existsSync(directory)) {
		console.log("No migrations directory. Nothing to apply.");
		return;
	}
	const files = fs
		.readdirSync(directory)
		.filter((file) => file.endsWith(".sql"))
		.sort();
	for (const file of files) {
		await db.query(fs.readFileSync(path.join(directory, file), "utf8"));
		console.log(`Applied ${file}`);
	}
	console.log(`Migrations complete (${files.length} file(s)).`);
}

migrate()
	.then(async () => {
		await db.pool.end();
	})
	.catch(async (error) => {
		console.error(`Migration failed: ${error.message}`);
		await db.pool.end().catch(() => {});
		process.exit(1);
	});
