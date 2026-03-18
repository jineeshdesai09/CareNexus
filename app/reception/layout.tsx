import Link from "next/link";
import { getCurrentUser } from "../lib/auth";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/logout";

export default async function ReceptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || user.Role !== "RECEPTIONIST") {
    redirect("/login");
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <aside className="w-64 flex-shrink-0 bg-gray-900 text-white p-5 flex flex-col">
        <h2 className="text-xl font-bold mb-6">Reception</h2>

        <nav className="space-y-3 flex-1">
          <Link href="/reception/dashboard" className="block p-2 hover:bg-gray-800 rounded transition-colors">Dashboard</Link>
          <Link href="/reception/patients" className="block p-2 hover:bg-gray-800 rounded transition-colors">Patient Registration</Link>
          <Link href="/reception/opd/create" className="block p-2 hover:bg-gray-800 rounded transition-colors">Assign OPD (Token)</Link>
          <Link href="/reception/opd/queue" className="block p-2 hover:bg-gray-800 rounded transition-colors">OPD Queue & Billing</Link>
          <Link href="/reception/status" className="block p-2 hover:bg-blue-600 bg-blue-700/20 text-blue-400 rounded transition-colors font-bold">📺 Live Status Screen</Link>
          <Link href="/reception/staff/add" className="block p-2 hover:bg-gray-800 rounded transition-colors">Staff Management</Link>
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-800">
          <div className="mb-4 text-sm text-gray-400">
            Logged in as <br />
            <span className="font-semibold text-white">
              {user?.Name}
            </span>
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="w-full text-left p-2 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded transition-colors flex items-center gap-2"
            >
              <span>Logout</span>
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
