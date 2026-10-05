import AuthGuard from "@/app/components/auth/AuthGuard";
import DashboardShell from "@/app/components/dashboard/DashboardShell";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <DashboardShell>{children}</DashboardShell>
    </AuthGuard>
  );
}