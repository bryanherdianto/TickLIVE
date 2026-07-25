function httpError(status, code, message) {
	const error = new Error(message);
	error.status = status;
	error.code = code;
	error.expose = true;
	return error;
}

module.exports = { httpError };
