import Link from "next/link";
import { logout } from "@/app/actions/logout";
import { requireAuth } from "../lib/auth";
import { getCurrentUser } from "../lib/auth";

export const runtime = "nodejs"; // whats is this

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  const user = await getCurrentUser();

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-gray-900 text-white p-5">
        <h2 className="text-xl font-bold mb-6">OPD Admin</h2>

        <nav className="space-y-3 flex-1">
          <Link href="/admin/dashboard" className="block hover:text-blue-400">
            Dashboard
          </Link>

          <Link href="/admin/hospital" className="block hover:text-blue-400">
            Hospital Master
          </Link>

          <Link href="/admin/doctors" className="block hover:text-blue-400">
            Doctor Master
          </Link>

          <Link href="/admin/diagnosis" className="block hover:text-blue-400">
            Diagnosis Master
          </Link>

          <Link href="/admin/treatments" className="block hover:text-blue-400">
            Treatment Types
          </Link>

          <Link href="/admin/sub-treatments" className="block hover:text-blue-400">
            Sub Treatments
          </Link>

          <Link href="/admin/users" className="block hover:text-blue-400">
            User Management
          </Link>

          <Link href="/admin/reports" className="block hover:text-blue-400">
            Reports & Analytics
          </Link>

          <Link href="/admin/audit-logs" className="block hover:text-blue-400">
            Audit Logs
          </Link>
        </nav>
        <div className="mb-6 text-sm text-gray-300">
          Logged in as <br />
          <span className="font-semibold text-white">
            {user?.Name} ({user?.Role})
          </span>
        </div>

        {/* ✅ Logout */}
        <form action={logout}>
          <button
            type="submit"
            className="mt-6 w-full text-left text-red-400 hover:text-red-300"
          >
            Logout
          </button>
        </form>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
