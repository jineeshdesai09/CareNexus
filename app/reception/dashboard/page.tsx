import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "../../lib/auth";
import Link from "next/link";
import { 
  Users, 
  Stethoscope, 
  Clock, 
  Wallet, 
  UserPlus, 
  ClipboardList, 
  Search,
  ArrowRight
} from "lucide-react";

export const runtime = "nodejs";

export default async function ReceptionDashboard() {
  const user = await getCurrentUser();

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // Stats
  const [patientCount, opdToday, waitingCount, billingCount] = await Promise.all([
    prisma.patient.count({ where: { Created: { gte: startOfDay, lte: endOfDay } } }),
    prisma.oPD.count({ where: { OPDDateTime: { gte: startOfDay, lte: endOfDay } } }),
    prisma.oPD.count({ where: { OPDDateTime: { gte: startOfDay, lte: endOfDay }, Status: "WAITING" } }),
    prisma.oPD.count({ where: { OPDDateTime: { gte: startOfDay, lte: endOfDay }, Status: "COMPLETED" } }),
  ]);

  const stats = [
    { label: "New Patients", value: patientCount, icon: Users, color: "bg-blue-50 text-blue-600", border: "border-blue-100" },
    { label: "Today's OPDs", value: opdToday, icon: Stethoscope, color: "bg-indigo-50 text-indigo-600", border: "border-indigo-100" },
    { label: "Currently Waiting", value: waitingCount, icon: Clock, color: "bg-amber-50 text-amber-600", border: "border-amber-100" },
    { label: "Ready for Billing", value: billingCount, icon: Wallet, color: "bg-green-50 text-green-600", border: "border-green-100" },
  ];

  const quickActions = [
    { title: "Register Patient", href: "/reception/patients", description: "Create a new patient file", icon: UserPlus, color: "bg-blue-600" },
    { title: "Assign OPD", href: "/reception/opd/create", description: "Create a token for a doctor", icon: ClipboardList, color: "bg-indigo-600" },
    { title: "Find Patient", href: "/reception/patients/directory", description: "Search the existing directory", icon: Search, color: "bg-slate-700" },
    { title: "Process Billing", href: "/reception/opd/queue", description: "Manage queue and payments", icon: Wallet, color: "bg-green-600" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Reception Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back, <span className="font-bold text-gray-700">{user?.Name}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className={`bg-white p-6 rounded-2xl border ${stat.border} shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow`}>
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl font-black text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <ArrowRight className="text-blue-600 w-5 h-5" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, idx) => (
              <Link key={idx} href={action.href} className="group relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-lg transition-all active:scale-[0.98] overflow-hidden">
                <div className={`absolute top-0 right-0 w-24 h-24 ${action.color} opacity-[0.03] rounded-bl-full group-hover:opacity-[0.06] transition-opacity`} />
                <div className={`w-12 h-12 ${action.color} text-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Live Status Summary */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Operational Summary</h2>
                <Link href="/reception/opd/queue" className="text-sm font-bold text-blue-600 hover:underline">View Live Queue →</Link>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-center items-center text-center space-y-4">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-full">
                    <ClipboardList className="w-10 h-10" />
                </div>
                <div className="max-w-xs">
                    <p className="text-lg font-bold text-gray-900">Queue is Running</p>
                    <p className="text-sm text-gray-500">There are currently <span className="font-bold text-blue-600">{waitingCount} patients</span> waiting for consultation across all doctors.</p>
                </div>
                <div className="pt-4 flex gap-4">
                    <div className="text-center px-4">
                        <p className="text-2xl font-black text-gray-900">{opdToday}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Visits</p>
                    </div>
                    <div className="w-px bg-gray-200 h-10" />
                    <div className="text-center px-4">
                        <p className="text-2xl font-black text-green-600">{opdToday - waitingCount - billingCount}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">In Consultation</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
