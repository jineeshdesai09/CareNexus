import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/app/lib/auth";
import { updateUserStatus, deleteUser } from "@/app/actions/user";
import { UserCheck, UserX, Clock, ShieldCheck, User, Trash2 } from "lucide-react";
import { formatDate } from "@/app/lib/utils/date";
import Link from "next/link";

export const runtime = "nodejs";

export default async function UserManagementPage() {
    await requireAdmin();

    const users = await prisma.user.findMany({
        where: {
            Role: { not: "ADMIN" },
        },
        orderBy: { Created: "desc" },
    });

    const pendingUsers = users.filter((u) => u.Status === "PENDING");
    const activeUsers = users.filter((u) => u.Status === "APPROVED");
    const rejectedUsers = users.filter((u) => u.Status === "REJECTED");

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-zinc-50 flex items-center gap-3">
                        <ShieldCheck className="text-blue-600 dark:text-blue-500 w-8 h-8" />
                        Access Management
                    </h1>
                    <p className="text-slate-500 dark:text-zinc-400 mt-1">Review and manage registration requests for staff and patients</p>
                </div>
            </div>

            {/* Pending Approvals */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                        <Clock className="text-amber-500 dark:text-amber-400 w-5 h-5" />
                        Pending Requests
                        <span className="ml-2 px-2.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 rounded-full text-xs">
                            {pendingUsers.length}
                        </span>
                    </h2>
                </div>

                {pendingUsers.length === 0 ? (
                    <div className="bg-slate-50 dark:bg-zinc-900/50 border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl p-12 text-center">
                        <User className="w-12 h-12 text-slate-300 dark:text-zinc-600 mx-auto mb-4" />
                        <p className="text-slate-500 dark:text-zinc-400 font-medium">No pending user registrations at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingUsers.map((user) => (
                            <div key={user.UserID} className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md dark:shadow-none dark:hover:border-zinc-700 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${user.Role === "DOCTOR" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800/50" :
                                            user.Role === "PATIENT" ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800/50" :
                                                "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-800/50"
                                        }`}>
                                        {user.Role}
                                    </div>
                                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase">
                                        {formatDate(user.Created)}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 mb-1">{user.Name}</h3>
                                <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6 truncate">{user.Email}</p>

                                <div className="flex gap-3">
                                    <form action={async () => {
                                        "use server";
                                        await updateUserStatus(user.UserID, "APPROVED");
                                    }} className="flex-1">
                                        <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all">
                                            <UserCheck className="w-4 h-4" />
                                            Approve
                                        </button>
                                    </form>
                                    <form action={async () => {
                                        "use server";
                                        await updateUserStatus(user.UserID, "REJECTED");
                                    }} className="flex-1">
                                        <button className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-zinc-800 hover:bg-rose-50 dark:hover:bg-rose-900/30 text-slate-700 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-rose-400 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-transparent hover:border-rose-200 dark:hover:border-rose-800/50">
                                            <UserX className="w-4 h-4" />
                                            Reject
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Active Accounts */}
            <section className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden ring-1 ring-slate-200/50 dark:ring-zinc-800/50">
                <div className="p-6 border-b border-slate-50 dark:border-zinc-800/50 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                        <UserCheck className="text-green-600 dark:text-green-500 w-5 h-5" />
                        Active Accounts
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 dark:bg-zinc-950/50">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest border-b border-slate-100 dark:border-zinc-800/50">User Details</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest border-b border-slate-100 dark:border-zinc-800/50">Role</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest text-center border-b border-slate-100 dark:border-zinc-800/50">Date Joined</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest text-right border-b border-slate-100 dark:border-zinc-800/50">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-zinc-800/50">
                            {activeUsers.map((user) => (
                                <tr key={user.UserID} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-zinc-100">{user.Name}</p>
                                            <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium mt-0.5">{user.Email}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase ${user.Role === "DOCTOR" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800/50" :
                                                user.Role === "PATIENT" ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800/50" :
                                                    "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-800/50"
                                            }`}>
                                            {user.Role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-center text-sm font-medium text-slate-500 dark:text-zinc-400">
                                        {formatDate(user.Created)}
                                    </td>
                                    <td className="px-8 py-5 text-right flex items-center justify-end gap-2">
                                        <Link 
                                            href={`/admin/users/${user.UserID}/edit`}
                                            className="p-2 text-slate-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        >
                                            <ShieldCheck className="w-4 h-4" />
                                        </Link>
                                        <form action={async () => {
                                            "use server";
                                            await deleteUser(user.UserID);
                                        }}>
                                            <button className="p-2 text-slate-300 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
