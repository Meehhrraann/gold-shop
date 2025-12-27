// RootLayout.tsx

import AdminGate from "@/components/authentication/AdminGate";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <AdminGate>
        <div className="flex-1">{children}</div>
      </AdminGate>
    </div>
  );
}
