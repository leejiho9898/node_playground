"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import PageContainer from "../components/PageContainer";

export default function SignupPage() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: 실제 회원가입 API 연동
    router.push("/");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 py-12">
      <PageContainer className="flex flex-col items-center">
        <h1 className="mb-2 text-2xl font-bold text-slate-800">가계부</h1>
        <p className="mb-8 text-slate-600">회원가입</p>

        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm"
        >
          <div>
            <label htmlFor="id" className="mb-1 block text-sm font-medium text-slate-700">
              아이디
            </label>
            <input
              id="id"
              type="text"
              name="id"
              autoComplete="username"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="아이디 입력"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="new-password"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="비밀번호 입력"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
              이메일
            </label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="이메일 입력"
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-emerald-600 py-3 font-medium text-white transition-colors hover:bg-emerald-700 active:bg-emerald-800"
          >
            가입하기
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          이미 계정이 있으신가요?{" "}
          <Link href="/" className="font-medium text-emerald-600 hover:underline">
            로그인
          </Link>
        </p>
      </PageContainer>
    </div>
  );
}
