import { currentRole, currentUser } from "@/lib/actions/currentSession.action";
import React from "react";
import { TbTicket } from "react-icons/tb";
import AdminDashboard from "../adminDashboard/AdminDashboard";

const AdminGate = async ({ children }) => {
  const role = await currentRole();
  const user = await currentUser();

  if (role === "ADMIN") {
    return <div>{children}</div>;
  }

  return (
    <div
      dir="rtl"
      className="fit-full mx-auto flex max-w-sm flex-col justify-center pt-20"
    >
      <div className="mb-5 flex items-center gap-1 text-center text-xl">
        <p className="font-semibold text-gray-300">پنل ادمین</p>
        <TbTicket className="size-6 text-rose-500" />
      </div>
      <p className="rounded-lg border-r-4 bg-red-200 p-2 text-red-900">
        شما مجوز دسترسی به این بخش را ندارید!
      </p>
    </div>
  );
};

export default AdminGate;
