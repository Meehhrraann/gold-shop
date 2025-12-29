// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gradient-to-bl from-sky-400 to-sky-900 text-center">
//       {children}
//     </div>
//   );
// }
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
