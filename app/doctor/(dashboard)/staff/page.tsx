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
        <div className="max-w-6xl mx-auto p-4 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Staff Management</h1>
                <p className="text-slate-500 font-medium">View and manage your hospital support team.</p>
            </div>

            {/* Role Header */}
            <div className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-3xl shadow-sm w-fit">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-black">
                    <Users className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="font-black text-slate-900 leading-none">Receptionists</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Hospital Front-desk</p>
                </div>
            </div>

            {/* Staff List */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                {staff.length === 0 ? (
                    <div className="p-20 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                            <User className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">No Receptionists Registered</h3>
                        <p className="text-slate-400 font-medium max-w-xs mx-auto mb-8">
                            We couldn't find any receptionists registered in the system.
                        </p>
                        <Link 
                            href="/doctor/staff/add"
                            className="px-8 py-3 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
                        >
                            + Register Receptionist
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                    <th className="px-8 py-5">Staff Member</th>
                                    <th className="px-8 py-5">Contact Details</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5">Registered On</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {staff.map((s) => (
                                    <tr key={s.UserID} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center text-lg font-black shadow-sm group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                    {s.Name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 text-base">{s.Name}</p>
                                                    <p className="text-xs text-slate-400 font-bold mt-0.5 uppercase tracking-widest">
                                                        {s.Role.replace('_', ' ')}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-sm font-black text-slate-700">
                                                <Mail className="w-4 h-4 text-slate-300" />
                                                {s.Email}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                                                s.Status === 'ACTIVE' || s.Status === 'APPROVED'
                                                    ? 'bg-green-50 text-green-700 border-green-100' 
                                                    : 'bg-amber-50 text-amber-700 border-amber-100'
                                            }`}>
                                                <ShieldCheck className="w-3 h-3" />
                                                {s.Status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-sm font-black text-slate-700">
                                                <Calendar className="w-4 h-4 text-slate-300" />
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
