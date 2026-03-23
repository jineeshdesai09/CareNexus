"use client";

import { useState } from "react";
import { XCircle, AlertTriangle, Loader2 } from "lucide-react";
import { cancelAppointment } from "@/app/actions/patient";

interface CancelButtonProps {
  opdId: number;
  doctorName: string;
  appointmentDate: string;
}

export default function CancelButton({ opdId, doctorName, appointmentDate }: CancelButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCancel = async () => {
    setLoading(true);
    setError("");
    try {
      await cancelAppointment(opdId);
      setShowModal(false);
      // Page will auto-refresh via revalidatePath
    } catch (err: any) {
      setError(err.message || "Failed to cancel appointment.");
      setLoading(false);
    }
  };

  return (
    <>
      {/* Cancel trigger button */}
      <button
        onClick={() => setShowModal(true)}
        className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/20 border border-red-100 dark:border-red-900/50 transition-colors"
      >
        <XCircle className="w-4 h-4" />
        Cancel Appointment
      </button>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !loading && setShowModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 animate-in fade-in slide-in-from-bottom-4 border border-transparent dark:border-zinc-800">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mb-4 border border-red-200 dark:border-red-900/50">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-zinc-50 mb-2">Cancel Appointment?</h2>
              <p className="text-slate-500 dark:text-zinc-400 text-sm">
                Are you sure you want to cancel your appointment with{" "}
                <span className="font-semibold text-slate-700 dark:text-zinc-200">{doctorName}</span> on{" "}
                <span className="font-semibold text-slate-700 dark:text-zinc-200">{appointmentDate}</span>?
              </p>
              <p className="text-xs text-slate-400 dark:text-zinc-500 mt-2">This action cannot be undone.</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-900/50 font-medium">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="flex-1 py-3 rounded-xl font-bold text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50 border border-transparent dark:border-zinc-700"
              >
                Keep It
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 py-3 rounded-xl font-bold text-white dark:text-red-50 bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Yes, Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
