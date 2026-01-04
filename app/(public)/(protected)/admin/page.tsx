// admin/page.tsx
import AdminDashboardClient from "@/components/AdminDashboardClient";
import AdminGate from "@/components/authentication/AdminGate";

export default async function Page() {
  // This is a Server Component.
  // We wrap everything in the Gate to ensure only admins see the UI.
  return (
    <AdminGate>
      <AdminDashboardClient />
    </AdminGate>
  );
}
