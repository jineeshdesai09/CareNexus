import Link from "next/link";
import { logout } from "@/app/actions/logout";
import { requireAuth, getCurrentUser } from "../lib/auth";
import { Header } from "@/components/layout/header";
import { 
  LayoutDashboard, 
  Building2, 
  Stethoscope, 
  Activity, 
  FileText, 
  Layers, 
  Users, 
  BarChart3, 
  ShieldAlert 
} from "lucide-react";

export const runtime = "nodejs";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen flex overflow-hidden bg-slate-50 dark:bg-zinc-950">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800">
        <div className="p-5 border-b border-slate-200 dark:border-zinc-800 flex items-center h-16">
          <h2 className="text-xl font-bold text-teal-700 dark:text-teal-500 tracking-tight">OPD Admin</h2>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:text-teal-700 hover:bg-teal-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50 transition-colors">
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <div className="pt-4 pb-2 px-3">
            <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Masters</p>
          </div>
          <Link href="/admin/hospital" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:text-teal-700 hover:bg-teal-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50 transition-colors">
            <Building2 size={18} />
            Hospital
          </Link>
          <Link href="/admin/doctors" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:text-teal-700 hover:bg-teal-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50 transition-colors">
            <Stethoscope size={18} />
            Doctor
          </Link>
          <Link href="/admin/diagnosis" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:text-teal-700 hover:bg-teal-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50 transition-colors">
            <Activity size={18} />
            Diagnosis
          </Link>
          <Link href="/admin/treatments" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:text-teal-700 hover:bg-teal-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50 transition-colors">
            <FileText size={18} />
            Treatments
          </Link>
          <Link href="/admin/sub-treatments" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:text-teal-700 hover:bg-teal-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50 transition-colors">
            <Layers size={18} />
            Sub Treatments
          </Link>

          <div className="pt-4 pb-2 px-3">
            <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">System</p>
          </div>
          <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:text-teal-700 hover:bg-teal-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50 transition-colors">
            <Users size={18} />
            User Management
          </Link>
          <Link href="/admin/reports" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:text-teal-700 hover:bg-teal-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50 transition-colors">
            <BarChart3 size={18} />
            Reports & Analytics
          </Link>
          <Link href="/admin/audit-logs" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:text-teal-700 hover:bg-teal-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50 transition-colors">
            <ShieldAlert size={18} />
            Audit Logs
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
