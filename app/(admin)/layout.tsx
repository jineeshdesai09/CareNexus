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
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-5 flex flex-col">
        <h2 className="text-xl font-bold mb-6">OPD Admin</h2>

        <nav className="space-y-3 flex-1">
          <Link href="/dashboard" className="block hover:text-blue-400">
            Dashboard
          </Link>

          <Link href="/hospital" className="block hover:text-blue-400">
            Hospital Master
          </Link>

          <Link href="/doctors" className="block hover:text-blue-400">
            Doctor Master
          </Link>

          <Link href="/diagnosis" className="block hover:text-blue-400">
            Diagnosis Master
          </Link>

          <Link href="/treatments" className="block hover:text-blue-400">
            Treatment Types
          </Link>

          <Link href="/sub-treatments" className="block hover:text-blue-400">
            Sub Treatments
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
      <main className="flex-1 p-6 bg-white text-gray-900">{children}</main>
    </div>
  );
}
