"use client";

import { useState } from "react";
import { createStaff } from "@/app/actions/user";
import { UserPlus, ShieldCheck, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";

export default function StaffRegistrationForm() {
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setStatus(null);
    const result = await createStaff(formData);
    setLoading(false);

    if (result.success) {
      setStatus({ type: 'success', message: 'Staff member added successfully!' });
      (document.getElementById('staff-form') as HTMLFormElement).reset();
    } else {
      setStatus({ type: 'error', message: result.error || 'Failed to add staff member' });
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 rounded-[2rem] border border-slate-200 dark:border-zinc-800 shadow-xl overflow-hidden ring-1 ring-slate-100 dark:ring-zinc-800/50">
      <div className="p-8 border-b border-slate-100 dark:border-zinc-800/50 bg-slate-50/50 dark:bg-zinc-950/50">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-teal-600 dark:bg-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20 dark:shadow-teal-900/40">
            <UserPlus className="text-white w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-zinc-50">Add Staff Member</h2>
            <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium mt-1">Create accounts for Doctors and Receptionists</p>
          </div>
        </div>
      </div>

      <form id="staff-form" action={handleSubmit} className="p-8 space-y-8">
        {status && (
          <div className={`p-4 rounded-xl flex items-center gap-3 animate-in zoom-in duration-300 border shadow-sm ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:border-rose-800/50 dark:text-rose-400'
            }`}>
            {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span className="text-sm font-bold">{status.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Full Name</label>
            <input
              name="name"
              type="text"
              required
              placeholder="e.g. John Doe"
              className="flex h-12 w-full rounded-xl border bg-white px-4 py-3 text-sm transition-shadow placeholder:text-slate-400 focus-visible:outline-none focus-visible:border-teal-500 focus-visible:ring-1 focus-visible:ring-teal-500 dark:border-zinc-700 dark:bg-zinc-950 dark:placeholder:text-zinc-600 dark:focus-visible:border-teal-500 dark:focus-visible:ring-teal-400 dark:text-zinc-100 font-medium border-slate-300"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Role</label>
            <select
              name="role"
              required
              className="flex h-12 w-full rounded-xl border bg-white px-4 py-3 text-sm transition-shadow placeholder:text-slate-400 focus-visible:outline-none focus-visible:border-teal-500 focus-visible:ring-1 focus-visible:ring-teal-500 dark:border-zinc-700 dark:bg-zinc-950 dark:placeholder:text-zinc-600 dark:focus-visible:border-teal-500 dark:focus-visible:ring-teal-400 dark:text-zinc-100 font-medium border-slate-300"
            >
              <option value="DOCTOR">Doctor</option>
              <option value="RECEPTIONIST">Receptionist</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Email Address</label>
          <input
            name="email"
            type="email"
            required
            placeholder="staff@hospital.com"
            className="flex h-12 w-full rounded-xl border bg-white px-4 py-3 text-sm transition-shadow placeholder:text-slate-400 focus-visible:outline-none focus-visible:border-teal-500 focus-visible:ring-1 focus-visible:ring-teal-500 dark:border-zinc-700 dark:bg-zinc-950 dark:placeholder:text-zinc-600 dark:focus-visible:border-teal-500 dark:focus-visible:ring-teal-400 dark:text-zinc-100 font-medium border-slate-300"
          />
        </div>

        <div className="space-y-2 relative">
          <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Default Password</label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              className="flex h-12 w-full rounded-xl border bg-white pl-4 pr-12 py-3 text-sm transition-shadow placeholder:text-slate-400 focus-visible:outline-none focus-visible:border-teal-500 focus-visible:ring-1 focus-visible:ring-teal-500 dark:border-zinc-700 dark:bg-zinc-950 dark:placeholder:text-zinc-600 dark:focus-visible:border-teal-500 dark:focus-visible:ring-teal-400 dark:text-zinc-100 font-medium border-slate-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-zinc-800/50">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 border-b-[3px] border-teal-800 active:border-b-0"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>Register Staff Member</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
