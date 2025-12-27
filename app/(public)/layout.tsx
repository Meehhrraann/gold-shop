// RootLayout.tsx

import NavbarGold from "@/components/navbar/NavbarGold";
import FooterGold from "@/components/navbar/FooterGold";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarGold />
      <div className="flex-1">{children}</div>
      <FooterGold />
    </div>
  );
}
