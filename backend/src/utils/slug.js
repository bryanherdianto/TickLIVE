function createSlug(value) {
	const base = String(value || "item")
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "")
		.slice(0, 72);
	return `${base || "item"}-${Date.now().toString(36)}`;
}

module.exports = { createSlug };
