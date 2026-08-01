function notFound(req, res) {
	return res.status(404).json({
		success: false,
		error: { code: "NOT_FOUND", message: "Route not found." },
	});
}

function errorHandler(error, req, res, next) {
	console.error(error);

	if (error.code === "23505") {
		return res.status(409).json({
			success: false,
			error: {
				code: "CONFLICT",
				message: "A record with that value already exists.",
			},
		});
	}

	if (error.code === "22P02" || error.code === "23514") {
		return res.status(400).json({
			success: false,
			error: {
				code: "INVALID_INPUT",
				message: "One or more values are invalid.",
			},
		});
	}

	if (error.name === "MulterError") {
		return res.status(400).json({
			success: false,
			error: { code: "UPLOAD_ERROR", message: error.message },
		});
	}

	return res.status(error.status || 500).json({
		success: false,
		error: {
			code: error.code || "INTERNAL_ERROR",
			message: error.expose
				? error.message
				: "Something went wrong on the server.",
		},
	});
}

module.exports = { notFound, errorHandler };
