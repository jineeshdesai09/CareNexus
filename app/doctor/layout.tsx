import Link from "next/link";
import { requireAuth } from "../lib/auth";
import { getCurrentUser } from "../lib/auth";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/logout";

export default async function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || user.Role !== "DOCTOR") {
    redirect("/login");
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <aside className="w-64 flex-shrink-0 bg-gray-900 text-white p-5 flex flex-col">
        <h2 className="text-xl font-bold mb-6 tracking-tight">Doctor Panel</h2>

        <nav className="space-y-3 flex-1">
          <Link
            href="/doctor/dashboard"
            className="block p-3 hover:bg-gray-800 rounded-xl transition-all duration-200 hover:translate-x-1"
          >
            Dashboard / My OPD
          </Link>
          <Link
            href="/patients"
            className="block p-3 hover:bg-gray-800 rounded-xl transition-all duration-200 hover:translate-x-1"
          >
            Global Patient Search
          </Link>
          <Link
            href="/doctor/staff/add"
            className="block p-3 hover:bg-gray-800 rounded-xl transition-all duration-200 hover:translate-x-1"
          >
            Staff Registration
          </Link>
        </nav>

        <form action={logout} className="mt-auto pt-6 border-t border-gray-800">
          <button
            type="submit"
            className="w-full text-left p-3 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-xl transition-all duration-200 font-semibold flex items-center justify-between group"
          >
            <span>Logout</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </button>
        </form>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">{children}</main>
    </div>
  );
}
