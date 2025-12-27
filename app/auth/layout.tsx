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
    <html lang="en">
      <body className="bg-[#252525] text-black antialiased dark:text-white">
        {/* No NavbarGold or FooterGold here */}
        {children}
      </body>
    </html>
  );
}
