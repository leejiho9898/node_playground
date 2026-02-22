"use client";

import { loginAction, type LoginState } from "@/app/login/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useActionState } from "react";
import PageContainer from "../components/PageContainer";

const initialState: LoginState = { error: null };

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (state?.success) router.push("/dashboard/assets");
  }, [state?.success, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100">
      <PageContainer className="flex flex-col items-center py-8">
        <h1 className="mb-2 text-2xl font-bold text-slate-800">가계부</h1>
        <p className="mb-8 text-slate-600">로그인</p>

        <form
          action={formAction}
          className="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm"
        >
          {state?.error && (
            <p
              className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
              role="alert"
            >
              {state.error}
            </p>
          )}
          <div>
            <label
              htmlFor="username"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              아이디
            </label>
            <input
              id="username"
              type="text"
              name="username"
              autoComplete="username"
              required
              disabled={isPending}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none disabled:opacity-60"
              placeholder="아이디 입력"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="current-password"
              required
              disabled={isPending}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none disabled:opacity-60"
              placeholder="비밀번호 입력"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="mt-2 w-full rounded-lg bg-emerald-600 py-3 font-medium text-white transition-colors hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60"
          >
            {isPending ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          계정이 없으신가요?{" "}
          <Link
            href="/signup"
            className="font-medium text-emerald-600 hover:underline"
          >
            회원가입
          </Link>
        </p>
      </PageContainer>
    </div>
  );
}
