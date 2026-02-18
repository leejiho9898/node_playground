import { apiClient } from "@/lib/api";

export type LoginState = {
  error: string | null;
  success?: boolean;
};

type LoginResponse = { success: boolean };

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const id = ((formData.get("id") as string) ?? "").trim();
  const password = ((formData.get("password") as string) ?? "").trim();

  try {
    const data = await apiClient.post<LoginResponse>("/login", {
      id,
      password,
    });
    if (data.success) return { error: null, success: true };
    return { error: "아이디 또는 비밀번호를 확인해 주세요." };
  } catch {
    return {
      error: "로그인 요청에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }
}
