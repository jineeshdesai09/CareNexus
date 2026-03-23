import Link from "next/link";
import { requireAuth } from "@/app/lib/auth";
import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/logout";
import { Header } from "@/components/layout/header";
import { LayoutDashboard, CalendarDays, Users, UsersRound, UserPlus } from "lucide-react";

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
    <div className="min-h-screen flex overflow-hidden bg-slate-50 dark:bg-zinc-950">
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800">
        <div className="p-5 border-b border-slate-200 dark:border-zinc-800 flex items-center h-16">
          <h2 className="text-xl font-bold text-teal-700 dark:text-teal-500 tracking-tight">Doctor Panel</h2>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <Link href="/doctor/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:text-teal-700 hover:bg-teal-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50 transition-colors">
            <LayoutDashboard size={18} />
            Dashboard / My OPD
          </Link>
          <Link href="/doctor/schedule" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:text-teal-700 hover:bg-teal-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50 transition-colors">
            <CalendarDays size={18} />
            My Schedule
          </Link>
          <Link href="/doctor/patients" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:text-teal-700 hover:bg-teal-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50 transition-colors">
            <Users size={18} />
            My Patients & Follow-ups
          </Link>

          <div className="pt-4 pb-2 px-3">
            <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">My Staff</p>
          </div>
          <Link href="/doctor/staff?role=receptionist" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:text-teal-700 hover:bg-teal-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50 transition-colors">
            <UsersRound size={18} />
            My Receptionists
          </Link>

          <Link href="/doctor/staff/add" className="flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-lg text-teal-600 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-900/20 transition-colors border border-transparent hover:border-teal-200 dark:hover:border-teal-800 mt-2">
            <UserPlus size={18} />
            Register New Staff
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-zinc-800">
          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors dark:text-rose-400 dark:bg-rose-500/10 dark:hover:bg-rose-500/20"
            >
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header userName={user?.Name} userRole={user?.Role} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
