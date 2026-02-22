const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const DEFAULT_OPTIONS: RequestInit = {
  headers: {
    "Content-Type": "application/json",
  },
};

/** 토큰 저장소 (참고: axios 인터셉터 패턴의 userStorage 역할) */
const tokenStorage = {
  get(): { accessToken: string; refreshToken: string } | null {
    if (typeof window === "undefined") return null;
    const accessToken = localStorage.getItem("gagaebuAccessToken");
    const refreshToken = localStorage.getItem("gagaebuRefreshToken");
    if (!accessToken || !refreshToken) return null;
    return { accessToken, refreshToken };
  },
  set(tokens: { accessToken: string; refreshToken: string }) {
    if (typeof window === "undefined") return;
    localStorage.setItem("gagaebuAccessToken", tokens.accessToken);
    localStorage.setItem("gagaebuRefreshToken", tokens.refreshToken);
  },
  clear() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("gagaebuAccessToken");
    localStorage.removeItem("gagaebuRefreshToken");
  },
};

/** 로그아웃: 토큰 삭제 후 로그인 페이지로 이동 */
function logout() {
  tokenStorage.clear();
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
}

function getHeaders(accessToken?: string | null): HeadersInit {
  const headers: Record<string, string> = {
    ...(DEFAULT_OPTIONS.headers as Record<string, string>),
  };
  const token =
    accessToken ??
    (typeof window !== "undefined" ? tokenStorage.get()?.accessToken ?? null : null);
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

type RefreshResponse = { access_token: string; refresh_token: string };

/** 리프레시 토큰으로 access/refresh 재발급 (참고: reIssuanceTokenAPI) */
async function reIssuanceTokenAPI(refreshToken: string): Promise<RefreshResponse | null> {
  const res = await fetch(`${BASE_URL}/login/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  if (!res.ok) return null;
  const text = await res.text();
  if (!text) return null;
  const data = JSON.parse(text) as RefreshResponse;
  if (!data.access_token || !data.refresh_token) return null;
  return data;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = new Error(res.statusText || "Request failed");
    (err as Error & { status: number }).status = res.status;
    throw err;
  }
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

async function requestWithRefreshRetry<T>(
  path: string,
  init: RequestInit,
  parseBody: (res: Response) => Promise<T>,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, init);

  if (res.status === 401 && path !== "/login/refresh" && typeof window !== "undefined") {
    const tokens = tokenStorage.get();
    if (!tokens) {
      logout();
      return parseBody(res);
    }
    const { refreshToken } = tokens;

    try {
      const newTokens = await reIssuanceTokenAPI(refreshToken);
      if (!newTokens) {
        logout();
        return parseBody(res);
      }
      tokenStorage.set({
        accessToken: newTokens.access_token,
        refreshToken: newTokens.refresh_token,
      });
      const retryInit: RequestInit = {
        ...init,
        headers: getHeaders(newTokens.access_token),
      };
      const retryRes = await fetch(`${BASE_URL}${path}`, retryInit);
      if (retryRes.status === 401) logout();
      return parseBody(retryRes);
    } catch {
      logout();
      return parseBody(res);
    }
  }

  return parseBody(res);
}

export const apiClient = {
  async get<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await requestWithRefreshRetry(
      path,
      {
        ...DEFAULT_OPTIONS,
        ...options,
        method: "GET",
        headers: getHeaders(),
      },
      handleResponse<T>,
    );
    return res;
  },

  async post<T>(
    path: string,
    body?: unknown,
    options?: RequestInit,
  ): Promise<T> {
    const res = await requestWithRefreshRetry(
      path,
      {
        ...DEFAULT_OPTIONS,
        ...options,
        method: "POST",
        headers: getHeaders(),
        body: body !== undefined ? JSON.stringify(body) : undefined,
      },
      handleResponse<T>,
    );
    return res;
  },

  async put<T>(
    path: string,
    body?: unknown,
    options?: RequestInit,
  ): Promise<T> {
    const res = await requestWithRefreshRetry(
      path,
      {
        ...DEFAULT_OPTIONS,
        ...options,
        method: "PUT",
        headers: getHeaders(),
        body: body !== undefined ? JSON.stringify(body) : undefined,
      },
      handleResponse<T>,
    );
    return res;
  },

  async patch<T>(
    path: string,
    body?: unknown,
    options?: RequestInit,
  ): Promise<T> {
    const res = await requestWithRefreshRetry(
      path,
      {
        ...DEFAULT_OPTIONS,
        ...options,
        method: "PATCH",
        headers: getHeaders(),
        body: body !== undefined ? JSON.stringify(body) : undefined,
      },
      handleResponse<T>,
    );
    return res;
  },

  async delete<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await requestWithRefreshRetry(
      path,
      {
        ...DEFAULT_OPTIONS,
        ...options,
        method: "DELETE",
        headers: getHeaders(),
      },
      handleResponse<T>,
    );
    return res;
  },
};
