const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const DEFAULT_OPTIONS: RequestInit = {
  headers: {
    "Content-Type": "application/json",
  },
};

function getHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    ...(DEFAULT_OPTIONS.headers as Record<string, string>),
  };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401 && typeof window !== "undefined") {
    // 나중에: localStorage.removeItem('accessToken'); window.location.href = '/';
  }
  if (!res.ok) {
    const err = new Error(res.statusText || "Request failed");
    (err as Error & { status: number }).status = res.status;
    throw err;
  }
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

export const apiClient = {
  async get<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...DEFAULT_OPTIONS,
      ...options,
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse<T>(res);
  },

  async post<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...DEFAULT_OPTIONS,
      ...options,
      method: "POST",
      headers: getHeaders(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async put<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...DEFAULT_OPTIONS,
      ...options,
      method: "PUT",
      headers: getHeaders(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async patch<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...DEFAULT_OPTIONS,
      ...options,
      method: "PATCH",
      headers: getHeaders(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async delete<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...DEFAULT_OPTIONS,
      ...options,
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse<T>(res);
  },
};
