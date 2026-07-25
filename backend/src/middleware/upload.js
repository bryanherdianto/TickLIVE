const multer = require("multer");
const { httpError } = require("../utils/http-error");

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter(req, file, callback) {
		if (file.mimetype && file.mimetype.startsWith("image/")) return callback(null, true);
		return callback(httpError(400, "INVALID_IMAGE", "Only image files are allowed."));
	},
});

module.exports = { upload };
