/**
 * Base URL of the backend API (used by browser fetch and Route Handlers).
 */
export function getApiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.API_URL ??
    "http://localhost:3000"
  );
}
