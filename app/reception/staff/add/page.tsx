"use client";
import StaffRegistrationForm from "@/app/components/staff/StaffRegistrationForm";
import { ShieldCheck } from "lucide-react";

export default function AddStaffPage() {
  return (
    <div className="p-8">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          Staff Management
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Add Medical Staff</h1>
        <p className="text-slate-500 text-lg">
          Securely register new doctors and receptionists to the system. 
          Staff members can log in immediately after creation.
        </p>
      </div>

      <StaffRegistrationForm />
    </div>
  );
}
