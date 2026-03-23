import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Users, FlaskConical, ShoppingBag, ShieldCheck, Mail, Calendar } from "lucide-react";

export const runtime = "nodejs";

export default async function DoctorStaffPage({
    searchParams,
}: {
    searchParams: Promise<{ role?: string }>;
}) {
    const user = await getCurrentUser();
    if (!user || user.Role !== "DOCTOR") {
        redirect("/login");
    }

    const { role } = await searchParams;
    const activeTab = role || "receptionist";

    const targetRole = "RECEPTIONIST";

    // Fetch all staff for this role
    const staff = await prisma.user.findMany({
        where: {
            Role: targetRole,
        },
        orderBy: {
            Name: "asc",
        },
    });

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">Staff Management</h1>
                    <p className="text-slate-500 dark:text-zinc-400 mt-1 font-medium text-sm">View and manage your hospital support team.</p>
                </div>
            </div>

            {/* Role Header */}
            <div className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm w-fit">
                <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-xl flex items-center justify-center border border-teal-100 dark:border-teal-800/50">
                    <Users className="w-5 h-5" />
                </div>
                <div className="pr-4">
                    <h2 className="font-extrabold text-slate-900 dark:text-zinc-100 leading-tight">Receptionists</h2>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-widest">Hospital Front-desk</p>
                </div>
            </div>

            {/* Staff List */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 overflow-hidden ring-1 ring-slate-100 dark:ring-zinc-800/50">
                {staff.length === 0 ? (
                    <div className="p-20 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-zinc-800/50 text-slate-300 dark:text-zinc-600 rounded-full flex items-center justify-center mb-6 shadow-inner ring-1 ring-slate-100 dark:ring-zinc-700/50">
                            <User className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-zinc-100 mb-2">No Receptionists Registered</h3>
                        <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium max-w-xs mx-auto mb-8">
                            We couldn't find any receptionists registered in the system.
                        </p>
                        <Link 
                            href="/doctor/staff/add"
                            className="px-6 py-2.5 bg-teal-600 text-white font-bold text-sm rounded-xl hover:bg-teal-700 shadow-sm transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
                        >
                            + Register Receptionist
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/80 dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Staff Member</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Contact Details</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Registered On</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50">
                                {staff.map((s) => (
                                    <tr key={s.UserID} className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 rounded-xl flex items-center justify-center text-sm font-black shadow-sm group-hover:bg-teal-50 group-hover:text-teal-600 dark:group-hover:bg-teal-900/30 dark:group-hover:text-teal-400 border border-slate-200 dark:border-zinc-700 transition-colors">
                                                    {s.Name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-zinc-100 text-sm group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{s.Name}</p>
                                                    <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold mt-1 uppercase tracking-widest">
                                                        {s.Role.replace('_', ' ')}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-zinc-300">
                                                <Mail className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
                                                {s.Email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border shadow-sm ${
                                                s.Status === 'ACTIVE' || s.Status === 'APPROVED'
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400' 
                                                    : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-400'
                                            }`}>
                                                <ShieldCheck className="w-3.5 h-3.5" />
                                                {s.Status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-zinc-400">
                                                <Calendar className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
                                                {formatDate(s.Created)}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper to format date if not imported or available
function formatDate(date: Date) {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}
