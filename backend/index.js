const app = require("./src/app");

const PORT = Number(process.env.PORT || 3000);

if (require.main === module) {
	app.listen(PORT, () => {
		console.log(`Tickify API is running on port ${PORT}`);
	});
}

module.exports = app;
