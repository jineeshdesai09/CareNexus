import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import ReceptionOPDForm from "./ReceptionOPDForm";
import Link from "next/link";

export const runtime = "nodejs";

export default async function CreateOPDPage() {
  const user = await getCurrentUser();

  if (!user || user.Role !== "RECEPTIONIST") {
    redirect("/login");
  }

  const doctors = await prisma.doctor.findMany({
    orderBy: { FirstName: "asc" },
    select: { DoctorID: true, FirstName: true, LastName: true, Specialization: true },
  });

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create New OPD</h1>
          <p className="text-gray-500 mt-1">Register a patient for doctor consultation</p>
        </div>
        <Link href="/reception/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition">
          ← Back to Dashboard
        </Link>
      </div>

      <ReceptionOPDForm doctors={doctors} />
    </div>
  );
}
