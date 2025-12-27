// import AdminGate from "@/components/authentication/AdminGate";
// import { currentRole } from "@/lib/actions/currentSession.action";
// import React from "react";
// import { TbTicket } from "react-icons/tb";

// const Page = () => {
//   const role = currentRole();
//   return (
//     <div className="flex w-full flex-col items-center justify-center gap-1 px-5 pt-20">
//       <AdminGate>
//         <div className="flex items-center justify-between rounded-lg bg-white p-1 shadow-md">
//           <p className="font-semibold">Role :</p>
//           <p className="truncate rounded-lg bg-slate-200 p-1 text-sm">{role}</p>
//         </div>
//       </AdminGate>
//     </div>
//   );
// };

// export default Page;

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
