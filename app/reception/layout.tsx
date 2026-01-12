import { getCurrentUser } from "../lib/auth";
import { redirect } from "next/navigation";

export default async function ReceptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || user.Role !== "RECEPTIONIST") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-green-900 text-white p-5">
        <h2 className="text-xl font-bold mb-4">Reception</h2>

        <nav className="space-y-3">
          <a href="/reception/patients">Patient Registration</a>
          <a href="/reception/opd">Assign OPD</a>
          <a href="/reception/status">OPD Status</a>
          <a href="/reception/billing">Billing</a>
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
