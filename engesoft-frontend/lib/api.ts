import { getAuthToken } from "@/lib/auth-token";
import { getApiBaseUrl } from "@/lib/api-base-url";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function messageFromBody(data: unknown): string {
  if (
    data &&
    typeof data === 'object' &&
    'message' in data &&
    typeof (data as { message: unknown }).message === 'string'
  ) {
    return (data as { message: string }).message;
  }
  return 'Erro na requisição';
}

export async function apiFetch(path: string, options?: RequestInit) {
  const token = getAuthToken();

  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(messageFromBody(data), res.status, data);
  }

  return data;
}