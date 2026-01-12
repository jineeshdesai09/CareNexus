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
    <div className="min-h-screen flex">
      <aside className="w-64 bg-blue-900 text-white p-5">
        <h2 className="text-xl font-bold mb-4">Doctor Panel</h2>

        <nav className="space-y-3">
          <a href="/doctor/dashboard">Dashboard</a>
          <a href="/doctor/opd">My OPD</a>
          <a href="/doctor/patients">Patients</a>
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
