import Link from "next/link";
import { getCurrentUser } from "../lib/auth";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/logout";
import { Header } from "@/components/layout/header";
import { LayoutDashboard, Users, UserPlus, ListTodo, MonitorPlay, Settings } from "lucide-react";

export default async function ReceptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || user.Role !== "RECEPTIONIST") {
    redirect("/login");
  }

  const sidebarNav = (
    <>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <Link href="/reception/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:text-teal-700 hover:bg-teal-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50 transition-colors">
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link href="/reception/patients" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:text-teal-700 hover:bg-teal-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50 transition-colors">
            <UserPlus size={18} />
            Patient Registration
          </Link>
          <Link href="/reception/opd/create" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:text-teal-700 hover:bg-teal-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50 transition-colors">
            <ListTodo size={18} />
            Assign OPD (Token)
          </Link>
          <Link href="/reception/opd/queue" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:text-teal-700 hover:bg-teal-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50 transition-colors">
            <Users size={18} />
            OPD Queue & Billing
          </Link>
          
          <div className="pt-4 pb-2 px-3">
            <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Monitors</p>
          </div>
          <Link href="/reception/status" className="flex items-center gap-3 px-3 py-2 text-sm font-bold rounded-lg text-teal-700 bg-teal-50/50 hover:bg-teal-100 dark:text-teal-400 dark:bg-teal-900/10 dark:hover:bg-teal-900/30 transition-colors border-l-2 border-transparent hover:border-teal-500">
            <MonitorPlay size={18} />
            Live Status Screen
          </Link>

          <div className="pt-4 pb-2 px-3">
            <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">System</p>
          </div>
          <Link href="/reception/staff/add" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:text-teal-700 hover:bg-teal-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50 transition-colors">
            <Settings size={18} />
            Staff Management
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-zinc-800 mt-auto">
          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors dark:text-rose-400 dark:bg-rose-500/10 dark:hover:bg-rose-500/20"
            >
              Logout
            </button>
          </form>
        </div>
    </>
  );

  return (
    <div className="min-h-screen flex overflow-hidden bg-slate-50 dark:bg-zinc-950">
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800">
        <div className="p-5 border-b border-slate-200 dark:border-zinc-800 flex items-center h-16">
          <h2 className="text-xl font-bold text-teal-700 dark:text-teal-500 tracking-tight">Care Nexus Reception</h2>
        </div>
        {sidebarNav}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header userName={user?.Name} userRole={user?.Role} mobileMenu={sidebarNav} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
