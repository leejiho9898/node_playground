export default function AssetsPage() {
  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-slate-800">내 자산</h1>
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-slate-600">자산 현황이 여기에 표시됩니다.</p>
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex justify-between rounded-lg bg-slate-50 px-4 py-3">
            <span className="text-slate-600">총 자산</span>
            <span className="font-semibold text-slate-800">0원</span>
          </div>
          <div className="flex justify-between rounded-lg bg-slate-50 px-4 py-3">
            <span className="text-slate-600">예금·적금</span>
            <span className="font-semibold text-slate-800">0원</span>
          </div>
          <div className="flex justify-between rounded-lg bg-slate-50 px-4 py-3">
            <span className="text-slate-600">현금</span>
            <span className="font-semibold text-slate-800">0원</span>
          </div>
        </div>
      </div>
    </div>
  );
}
