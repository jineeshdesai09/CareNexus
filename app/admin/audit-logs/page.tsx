import { prisma } from "@/lib/prisma";
import { requireAdmin } from "../../lib/auth";
import { formatDate } from "@/app/lib/utils/date";
import { ShieldAlert, User, Activity, Clock } from "lucide-react";

export const runtime = "nodejs";

export default async function AuditLogsPage() {
    await requireAdmin();

    const logs = await prisma.auditLog.findMany({
        include: { 
            User: { 
                select: { 
                    Name: true, 
                    Role: true 
                } 
            } 
        },
        orderBy: { Created: "desc" },
        take: 100
    });

    return (
        <div className="max-w-6xl space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <ShieldAlert className="w-8 h-8 text-red-600" />
                    Security Audit Logs
                </h1>
                <p className="text-slate-500 mt-1 font-medium">Monitoring administrative actions and critical system changes</p>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Administrator</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Module</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Event Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 italic font-medium">
                                        No security events recorded yet.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.LogID} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span className="text-xs font-bold">{formatDate(log.Created)}</span>
                                            </div>
                                            <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                                                {log.Created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-black text-xs">
                                                    {log.User.Name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{log.User.Name}</p>
                                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-tighter">{log.User.Role}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                                log.Action === 'DELETE' ? 'bg-red-50 text-red-600' :
                                                log.Action === 'UPDATE' ? 'bg-amber-50 text-amber-600' :
                                                'bg-indigo-50 text-indigo-600'
                                            }`}>
                                                {log.Action}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 font-bold text-xs text-slate-600">
                                                <Activity className="w-3.5 h-3.5 text-slate-400" />
                                                {log.Module}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="text-sm font-medium text-slate-600 max-w-xs truncate" title={log.Details || ""}>
                                                {log.Details || "No additional info"}
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
