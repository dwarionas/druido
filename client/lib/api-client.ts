const API_URL = '/api';

async function request<T>(
	method: string,
	path: string,
	body?: unknown,
): Promise<T> {
	const url = `${API_URL}${path}`;

	const init: RequestInit = {
		method,
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
	};

	if (body && (method === 'POST' || method === 'PATCH')) {
		init.body = JSON.stringify(body);
	}

	const res = await fetch(url, init);

	if (!res.ok) {
		const data = await res.json().catch(() => null);
		const message = data?.message || res.statusText;
		throw new Error(Array.isArray(message) ? message.join(', ') : message);
	}

	if (res.status === 204) {
		return undefined as T;
	}

	return res.json();
}

export const api = {
	get: <T>(path: string) => request<T>('GET', path),
	post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
	patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
	del: <T>(path: string) => request<T>('DELETE', path),
};
