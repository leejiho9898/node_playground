"use server";

import { signupApi } from "./service";

export type SignupState = {
  error: string | null;
  success?: boolean;
};

export async function signupAction(
  _prevState: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const id = ((formData.get("id") as string) ?? "").trim();
  const password = ((formData.get("password") as string) ?? "").trim();
  const email = ((formData.get("email") as string) ?? "").trim();

  try {
    const data = await signupApi({ id, password, email });
    if (data.success) return { error: null, success: true };
    return { error: "가입에 실패했습니다. 다시 시도해 주세요." };
  } catch {
    return {
      error: "회원가입 요청에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }
}
