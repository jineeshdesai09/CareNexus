import Link from "next/link";
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
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <aside className="w-64 flex-shrink-0 bg-gray-900 text-white p-5">
        <h2 className="text-xl font-bold mb-4">Reception</h2>

        <nav className="space-y-3">
          <Link href="/reception/dashboard">Dashboard</Link>
          <br />
          <Link href="/reception/patients">Patient Registration</Link>
          <br />
          <Link href="/reception/opd">Assign OPD</Link>
          <br />
          <Link href="/reception/status">OPD Status</Link>
          <br />
          <Link href="/reception/opd/queue">OPD Queue</Link>
          <br />
          <Link href="/reception/billing">Billing</Link>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
