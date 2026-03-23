import Link from "next/link";
import { getCurrentUser } from "../lib/auth";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/logout";
import { Heart, Home, History, User, LogOut, FileText, Calendar } from "lucide-react";
import { Header } from "@/components/layout/header";

export const runtime = "nodejs";

export default async function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || user.Role !== "PATIENT") {
    redirect("/login");
  }

  const menuItems = [
    { label: "Dashboard", href: "/patient/dashboard", icon: Home },
    { label: "My Appointments", href: "/patient/appointments", icon: Calendar },
    { label: "Medical History", href: "/patient/history", icon: History },
    { label: "My Profile", href: "/patient/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex transition-colors">
      {/* Sidebar */}
      <aside className="w-72 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 flex flex-col hidden md:flex sticky top-0 h-screen transition-colors">
        <div className="p-8">
          <Link href="/patient/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 dark:from-teal-400 dark:to-teal-600 bg-clip-text text-transparent">
              Care Nexus Patient
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-zinc-400 hover:bg-teal-50 dark:hover:bg-zinc-800 hover:text-teal-600 dark:hover:text-teal-400 rounded-xl transition-all font-medium group"
            >
              <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100 dark:border-zinc-800">
          <div className="mb-6 p-4 bg-slate-50 dark:bg-zinc-950 rounded-2xl flex items-center gap-3 shadow-inner">
            <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/40 rounded-full flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold border border-teal-200 dark:border-teal-800">
              {user.Name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 dark:text-zinc-100 truncate">{user.Name}</p>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Patient</p>
            </div>
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all font-semibold group"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0 relative">
        <Header userName={user?.Name} userRole={user?.Role} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800 flex justify-around items-center p-2 z-50 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] transition-colors">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center p-2 text-slate-500 dark:text-zinc-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold">{item.label.replace("My ", "")}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
