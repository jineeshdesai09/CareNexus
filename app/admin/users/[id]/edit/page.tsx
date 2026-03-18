import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/app/lib/auth";
import { updateUser, resetPassword } from "@/app/actions/user";
import Link from "next/link";
import { User, Key, Save, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Role } from "@prisma/client";

export default async function EditUserPage({ 
    params,
    searchParams 
}: { 
    params: Promise<{ id: string }>,
    searchParams: Promise<{ success?: string, error?: string }>
}) {
    await requireAdmin();
    const { id } = await params;
    const { success, error } = await searchParams;
    const userId = Number(id);

    const user = await prisma.user.findUnique({
        where: { UserID: userId },
    });

    if (!user) return <div className="p-8">User not found</div>;

    return (
        <div className="max-w-4xl mx-auto p-8 space-y-12">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/users" className="p-2 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-100 transition">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-3xl font-bold text-slate-900">Edit User Profile</h1>
                    </div>
                </div>

                {/* Status Alerts */}
                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <p className="font-semibold">
                            {success === 'profile' ? 'Profile details updated successfully!' : 'Password has been reset successfully!'}
                        </p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <p className="font-semibold">
                            {error === 'profile' ? 'Failed to update profile details.' : 'Failed to reset password.'}
                        </p>
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                {/* General Information */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2">
                        <User className="text-blue-600 w-5 h-5" />
                        Account Details
                    </h2>
                    
                    <form action={updateUser.bind(null, userId)} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                            <input 
                                name="name" 
                                defaultValue={user.Name} 
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                            <input 
                                name="email" 
                                defaultValue={user.Email} 
                                type="email"
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Role</label>
                                <select 
                                    name="role" 
                                    defaultValue={user.Role} 
                                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                >
                                    {Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Status</label>
                                <select 
                                    name="status" 
                                    defaultValue={user.Status} 
                                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="APPROVED">Approved</option>
                                    <option value="REJECTED">Rejected</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-slate-900 hover:bg-black text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-slate-200 transition-all active:scale-[0.98]">
                            <Save className="w-5 h-5 text-blue-400" />
                            Update Profile
                        </button>
                    </form>
                </div>

                {/* Password Reset */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2">
                        <Key className="text-amber-500 w-5 h-5" />
                        Security Settings
                    </h2>
                    
                    <form action={resetPassword.bind(null, userId)} className="space-y-6">
                        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                            <p className="text-xs text-amber-700 leading-relaxed font-medium">
                                This will permanently change the user's password. They will need to log in again with the new credentials.
                            </p>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">New Password</label>
                            <input 
                                name="password" 
                                type="password" 
                                placeholder="Enter strong password..."
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                                required
                            />
                        </div>

                        <button type="submit" className="w-full bg-slate-100 hover:bg-amber-500 hover:text-white text-slate-900 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] border border-transparent hover:border-amber-400">
                            <Key className="w-5 h-5" />
                            Reset Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
