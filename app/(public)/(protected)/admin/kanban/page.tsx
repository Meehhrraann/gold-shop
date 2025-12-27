import { auth } from "@/auth";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  return (
    <div className="h-full px-2 py-5">
      {/* FIX: Pass userId, NOT initialData */}
      <KanbanBoard userId={session.user.id} />
    </div>
  );
};

export default page;
