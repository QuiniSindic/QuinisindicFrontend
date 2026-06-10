import { BACKEND_URL } from '../../../core/config';

type QueryPrimitive = string | number | boolean | null | undefined;
type QueryValue = QueryPrimitive | QueryPrimitive[];

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  query?: Record<string, QueryValue>;
  body?: unknown;
  headers?: HeadersInit;
  accessToken?: string | null;
  cache?: RequestCache;
};

const appendQueryValue = (
  params: URLSearchParams,
  key: string,
  value: QueryPrimitive,
) => {
  if (value === null || value === undefined || value === '') return;
  params.append(key, String(value));
};

export const buildApiUrl = (
  path: string,
  query?: Record<string, QueryValue>,
) => {
  const baseUrl = BACKEND_URL.replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${baseUrl}${normalizedPath}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => appendQueryValue(url.searchParams, key, item));
        return;
      }
      appendQueryValue(url.searchParams, key, value);
    });
  }

  return url.toString();
};

export async function parseApiResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  let payload: unknown = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {
    const detail =
      payload && typeof payload === 'object' && 'detail' in payload
        ? String(payload.detail)
        : typeof payload === 'string' && payload.trim().length > 0
          ? payload
          : response.statusText || 'Unexpected API error';
    throw new ApiError(detail, response.status);
  }

  if (typeof payload === 'string') {
    throw new ApiError('Expected JSON response from API', response.status);
  }

  return payload as T;
}

export async function apiFetch<T>({
  path,
  method = 'GET',
  query,
  body,
  headers,
  accessToken,
  cache = 'no-store',
}: ApiRequestOptions & { path: string }): Promise<T> {
  const finalHeaders = new Headers(headers);

  if (body !== undefined) {
    finalHeaders.set('Content-Type', 'application/json');
  }

  if (accessToken) {
    finalHeaders.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(buildApiUrl(path, query), {
    method,
    headers: finalHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
    cache,
  });

  return parseApiResponse<T>(response);
}
