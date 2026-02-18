import Link from "next/link";

export default function ProfilePage() {
  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-slate-800">내정보</h1>
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <span className="text-sm text-slate-500">아이디</span>
            <p className="font-medium text-slate-800">-</p>
          </div>
          <div>
            <span className="text-sm text-slate-500">이메일</span>
            <p className="font-medium text-slate-800">-</p>
          </div>
        </div>
        <Link
          href="/"
          className="mt-6 block w-full rounded-lg border border-slate-200 py-3 text-center text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          로그아웃
        </Link>
      </div>
    </div>
  );
}
