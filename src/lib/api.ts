const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

export function apiUrl(path: string): string {
  if (!apiBaseUrl) return path;
  return `${apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

export function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  if (typeof input === 'string' && input.startsWith('/api/')) {
    return fetch(apiUrl(input), init);
  }

  if (input instanceof URL && input.pathname.startsWith('/api/')) {
    return fetch(apiUrl(`${input.pathname}${input.search}${input.hash}`), init);
  }

  return fetch(input, init);
}
