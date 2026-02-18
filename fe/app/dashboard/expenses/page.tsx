export default function ExpensesPage() {
  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-slate-800">지출 내역</h1>
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-slate-600">지출 내역이 여기에 표시됩니다.</p>
        <ul className="mt-4 divide-y divide-slate-100">
          <li className="py-3 text-sm text-slate-500">
            등록된 지출이 없습니다.
          </li>
        </ul>
      </div>
    </div>
  );
}
