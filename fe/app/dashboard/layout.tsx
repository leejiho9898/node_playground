import PageContainer from "../components/PageContainer";
import BottomNav from "./components/BottomNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <PageContainer className="pb-20 pt-6">
        {children}
      </PageContainer>
      <BottomNav />
    </div>
  );
}
