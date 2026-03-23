"use client";
import StaffRegistrationForm from "@/app/components/staff/StaffRegistrationForm";
import { ShieldCheck } from "lucide-react";

export default function DoctorAddStaffPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 pt-4">
      <div className="mb-10 text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-900/40 border border-teal-100 dark:border-teal-800/50 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-widest shadow-sm">
          <ShieldCheck className="w-4 h-4" />
          Staff Management
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">Add Staff Member</h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium leading-relaxed">
          Register receptionists to support your OPD workflow seamlessly.
        </p>
      </div>

      <StaffRegistrationForm />
    </div>
  );
}
