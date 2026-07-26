const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

/**
 * Reusable utility to make API calls to the backend.
 * Automatically prepends the base URL and formats JSON headers & errors.
 */
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  // Normalize slashes to build the full URL path
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const normalizedBaseUrl = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
  const url = `${normalizedBaseUrl}${normalizedEndpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong");
  }

  return data;
}
