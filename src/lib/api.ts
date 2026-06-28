const TOKEN_KEY = "rove_token";

function readStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

function migrateLegacyToken(): void {
  if (typeof window === "undefined") return;
  const legacy = window.sessionStorage.getItem(TOKEN_KEY);
  if (legacy && !window.localStorage.getItem(TOKEN_KEY)) {
    window.localStorage.setItem(TOKEN_KEY, legacy);
    window.sessionStorage.removeItem(TOKEN_KEY);
  }
}

export function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
}

export function getToken(): string | null {
  migrateLegacyToken();
  return readStorage()?.getItem(TOKEN_KEY) ?? null;
}

export function setToken(token: string): void {
  readStorage()?.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  readStorage()?.removeItem(TOKEN_KEY);
}

export function hasToken(): boolean {
  return !!getToken();
}

export class ApiRequestError extends Error {
  code?: string;
  status: number;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
};

export async function api<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, auth = false, headers: customHeaders, ...rest } = options;

  const headers = new Headers(customHeaders);

  if (body !== undefined && !(body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${getApiUrl()}${path}`, {
    ...rest,
    headers,
    credentials: "include",
    body:
      body instanceof FormData
        ? body
        : body !== undefined
          ? JSON.stringify(body)
          : undefined,
  });

  const contentType = res.headers.get("content-type") ?? "";
  const json =
    contentType.includes("application/json")
      ? await res.json().catch(() => null)
      : null;

  if (!contentType.includes("application/json")) {
    throw new ApiRequestError(
      `API returned non-JSON response (${res.status}). Is the backend running at ${getApiUrl()}?`,
      res.status
    );
  }

  if (!res.ok || !json?.success) {
    throw new ApiRequestError(
      json?.error?.message ?? "Request failed",
      res.status,
      json?.error?.code
    );
  }

  return json.data as T;
}

export function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}
