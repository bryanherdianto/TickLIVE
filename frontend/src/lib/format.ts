export function formatCurrency(value: number | string | null | undefined, currency = "USD") {
	const amount = Number(value || 0);
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).format(amount);
}

export function formatEventDate(value: string | null | undefined, options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }) {
	if (!value) return "Date TBA";
	const date = new Date(value);
	return Number.isNaN(date.valueOf()) ? "Date TBA" : new Intl.DateTimeFormat("en-US", options).format(date);
}

export function formatTime(value: string | null | undefined) {
	if (!value) return "Time TBA";
	const date = new Date(value);
	return Number.isNaN(date.valueOf()) ? "Time TBA" : new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit" }).format(date);
}
