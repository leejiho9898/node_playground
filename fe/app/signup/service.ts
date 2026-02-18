const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export type SignupPayload = {
  id: string;
  password: string;
  email: string;
};

export type SignupResponse = { success: boolean };

/** 회원가입 API 호출만 담당 */
export async function signupApi(
  payload: SignupPayload,
): Promise<SignupResponse> {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(res.statusText || "Request failed");
  }

  const text = await res.text();
  if (!text) return { success: true };
  return JSON.parse(text) as SignupResponse;
}
