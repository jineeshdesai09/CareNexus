import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getSession } from "../../lib/session";


export const runtime = "nodejs";

export default async function DashboardPage() {
  const userId = await getSession();

  if (!userId) {
    redirect("/login");
  }
  
  const hospitalCount = await prisma.hospital.count();

  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p>Hospital count: {hospitalCount}</p>
    </div>
  );
}
