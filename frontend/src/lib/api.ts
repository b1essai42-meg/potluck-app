// src/lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(path: string, options: RequestInit = {}) {
  // Cookie または localStorage からトークンを取得
  const token =
    typeof document !== 'undefined'
      ? document.cookie
          .split('; ')
          .find((row) => row.startsWith('token='))
          ?.split('=')[1]
      : undefined;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail ?? `HTTP ${res.status}`);
  }

  return res.json();
}

// GET ヘルパー
export function apiGet(path: string) {
  return apiFetch(path, { method: 'GET' });
}

// POST ヘルパー
export function apiPost(path: string, body: unknown) {
  return apiFetch(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// PATCH ヘルパー
export function apiPatch(path: string, body: unknown) {
  return apiFetch(path, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

// DELETE ヘルパー
export function apiDelete(path: string) {
  return apiFetch(path, { method: 'DELETE' });
}
