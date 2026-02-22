import { apiClient } from "@/lib/api";

export type LoginState = {
  error: string | null;
  success?: boolean;
};

type LoginSuccessResponse = {
  success: true;
  access_token: string;
  refresh_token: string;
  user: { id: number; username: string };
};

type LoginResponse =
  | { success: false }
  | LoginSuccessResponse;

function saveTokens(accessToken: string, refreshToken: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("gagaebuAccessToken", accessToken);
    localStorage.setItem("gagaebuRefreshToken", refreshToken);
  }
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = ((formData.get("username") as string) ?? "").trim();
  const password = ((formData.get("password") as string) ?? "").trim();

  try {
    const data = await apiClient.post<LoginResponse>("/login", {
      username,
      password,
    });
    if (data.success && "access_token" in data && "refresh_token" in data) {
      saveTokens(data.access_token, data.refresh_token);
      return { error: null, success: true };
    }
    return { error: "아이디 또는 비밀번호를 확인해 주세요." };
  } catch {
    return {
      error: "로그인 요청에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }
}
