import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "../../lib/auth";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";

export default async function LabDashboard() {
  const user = await getCurrentUser();
  if (!user || user.Role !== "LAB_TECHNICIAN") redirect("/login");

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <ShieldCheck className="text-blue-600" />
        Lab Dashboard (Placeholder)
      </h1>
      <p className="text-slate-500 mt-2 text-lg">
        Successfully logged in as Lab Technician. This module is scheduled for Phase 2.
      </p>
    </div>
  );
}
