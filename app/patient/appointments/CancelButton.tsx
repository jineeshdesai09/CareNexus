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
        className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-bold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 border border-red-100 transition-colors"
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
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-2">Cancel Appointment?</h2>
              <p className="text-slate-500 text-sm">
                Are you sure you want to cancel your appointment with{" "}
                <span className="font-semibold text-slate-700">{doctorName}</span> on{" "}
                <span className="font-semibold text-slate-700">{appointmentDate}</span>?
              </p>
              <p className="text-xs text-slate-400 mt-2">This action cannot be undone.</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-medium">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="flex-1 py-3 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                Keep It
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
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
