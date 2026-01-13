import Link from "next/link";
import { requireAuth } from "../lib/auth";
import { getCurrentUser } from "../lib/auth";
import { redirect } from "next/navigation";

export default async function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || user.Role !== "DOCTOR") {
    redirect("/dashboard");
  }

  return (
        <div className="h-screen flex overflow-hidden bg-gray-50">
      <aside className="w-64 flex-shrink-0 bg-gray-900 text-white p-5">
        <h2 className="text-xl font-bold mb-4">Doctor Panel</h2>

        <nav className="space-y-3">
          <Link href="/doctor/dashboard">Dashboard</Link>
          <Link href="/doctor/opd">My OPD</Link>
          <Link href="/doctor/patients">Patients</Link>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
