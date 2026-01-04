export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-[url('/authImage.png')] bg-cover">
      <div className="flex min-h-screen w-full items-center justify-center bg-black/50 backdrop-blur-sm">
        {/* No NavbarGold or FooterGold here */}
        {children}
      </div>
    </div>
  );
}
