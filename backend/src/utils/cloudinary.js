const { v2: cloudinary } = require("cloudinary");
const env = require("../config/env");
const { httpError } = require("./http-error");

const configured = Boolean(
	env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret,
);

if (configured) {
	cloudinary.config({
		cloud_name: env.cloudinary.cloudName,
		api_key: env.cloudinary.apiKey,
		api_secret: env.cloudinary.apiSecret,
	});
}

function uploadImage(file, folder) {
	if (!file) return Promise.resolve(null);
	if (!configured) {
		return Promise.reject(
			httpError(503, "IMAGE_UPLOAD_UNAVAILABLE", "Cloudinary is not configured."),
		);
	}

	return new Promise((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream(
			{ folder, resource_type: "image" },
			(error, result) => (error ? reject(error) : resolve(result.secure_url)),
		);
		stream.end(file.buffer);
	});
}

module.exports = { uploadImage };
