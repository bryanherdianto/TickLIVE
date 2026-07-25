import { useAuth } from "@clerk/vue";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api").replace(/\/$/, "");

type ApiOptions = Omit<RequestInit, "body" | "headers"> & {
	body?: unknown;
	headers?: HeadersInit;
};

type ApiEnvelope<T> = {
	success: boolean;
	data: T;
	meta?: Record<string, unknown>;
};

export class ApiError extends Error {
	constructor(
		message: string,
		public readonly status: number,
		public readonly code?: string,
	) {
		super(message);
		this.name = "ApiError";
	}
}

export async function apiRequest<T>(path: string, options: ApiOptions = {}, token?: string | null): Promise<T> {
	const headers = new Headers(options.headers);
	const hasBody = options.body !== undefined && options.body !== null;
	if (hasBody && !headers.has("Content-Type") && !(options.body instanceof FormData)) {
		headers.set("Content-Type", "application/json");
	}
	if (token) headers.set("Authorization", `Bearer ${token}`);

	const response = await fetch(`${API_BASE_URL}${path}`, {
		...options,
		headers,
		body: hasBody && !(options.body instanceof FormData) ? JSON.stringify(options.body) : (options.body as BodyInit | null | undefined),
	});
	const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | { error?: { message?: string; code?: string } } | null;

	if (!response.ok || !payload || !("success" in payload) || !payload.success) {
		const error = payload && "error" in payload ? payload.error : undefined;
		throw new ApiError(error?.message || "Unable to complete that request.", response.status, error?.code);
	}

	return payload.data;
}

export function useApi() {
	const { getToken } = useAuth();

	return async function authenticatedApiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
		const token = await getToken.value();
		return apiRequest<T>(path, options, token);
	};
}
