import PageContainer from "../components/PageContainer";
import BottomNav from "./components/BottomNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <PageContainer className="pt-6 pb-20">{children}</PageContainer>
      <BottomNav />
    </div>
  );
}
