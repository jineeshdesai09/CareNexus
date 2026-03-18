"use client";

import { useState } from "react";

type PastOPD = {
  OPDID: number;
  OPDDateTime: Date;
  Status: string;
  Diagnoses: { DiagnosisType: { DiagnosisTypeName: string } }[];
  prescription: {
    Medicines: {
      Medicine: { Name: string } | null;
      MedicineName: string | null;
      Dosage: string;
      Frequency: string;
      Duration: string;
      Instructions: string | null;
    }[];
    Notes: string | null;
  } | null;
  Weight: any | null; // Prisma Decimal
  BP_Systolic: number | null;
  BP_Diastolic: number | null;
  Temperature: any | null; // Prisma Decimal
  Pulse: number | null;
  Description: string | null;
};

export default function MedicalHistoryDrawer({
  patientName,
  pastOpds,
}: {
  patientName: string;
  pastOpds: PastOPD[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full mt-4 bg-indigo-50 text-indigo-700 border border-indigo-200 py-2 rounded-lg font-medium hover:bg-indigo-100 transition flex items-center justify-center gap-2 text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        View Medical History
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-gray-900/50 backdrop-blur-sm transition-opacity">
          {/* Drawer Content */}
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">
                Medical History
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-4 overflow-y-auto flex-1 space-y-6 bg-gray-50">
              <div className="text-sm text-gray-500 mb-2">
                Showing previous completed visits for <span className="font-semibold text-gray-800">{patientName}</span>
              </div>

              {pastOpds.length === 0 ? (
                <div className="text-center text-gray-500 py-10 bg-white rounded-lg border border-dashed border-gray-300">
                  No previous consultation records found.
                </div>
              ) : (
                pastOpds.map((opd) => (
                  <div key={opd.OPDID} className="bg-white border rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 flex justify-between items-center">
                      <div className="font-bold text-indigo-900">
                        {new Date(opd.OPDDateTime).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-xs font-semibold px-2 py-1 bg-white text-indigo-600 rounded-md border border-indigo-200">
                         Status: {opd.Status}
                      </div>
                    </div>
                    
                    <div className="p-4 space-y-4">
                        {/* Vitals Summary */}
                        {(opd.BP_Systolic || opd.Weight || opd.Temperature) && (
                            <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                                {opd.Weight && <div><span className="font-semibold text-gray-800">Wt:</span> {opd.Weight.toString()}kg</div>}
                                {opd.BP_Systolic && <div><span className="font-semibold text-gray-800">BP:</span> {opd.BP_Systolic}/{opd.BP_Diastolic}</div>}
                                {opd.Temperature && <div><span className="font-semibold text-gray-800">Temp:</span> {opd.Temperature.toString()}°C</div>}
                            </div>
                        )}

                        {/* Diagnoses */}
                        {opd.Diagnoses.length > 0 && (
                            <div>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Diagnoses</div>
                                <div className="flex flex-wrap gap-1">
                                    {opd.Diagnoses.map(d => (
                                        <span key={d.DiagnosisType.DiagnosisTypeName} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100">
                                            {d.DiagnosisType.DiagnosisTypeName}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Prescriptions */}
                        {opd.prescription && opd.prescription.Medicines.length > 0 && (
                            <div>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Prescription</div>
                                <ul className="space-y-2">
                                    {opd.prescription.Medicines.map((m, idx) => (
                                        <li key={idx} className="text-sm flex flex-col border-l-2 border-indigo-200 pl-3 py-0.5">
                                            <span className="font-medium text-gray-800">
                                                {m.Medicine?.Name || m.MedicineName || "Unknown Medicine"}
                                            </span>
                                            <span className="text-gray-500 text-xs">
                                                {m.Dosage} • {m.Frequency} • {m.Duration}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Clinical Notes */}
                        {opd.prescription?.Notes && (
                             <div>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Notes</div>
                                <p className="text-sm text-gray-700 italic border-l-2 border-gray-200 pl-3">"{opd.prescription.Notes}"</p>
                            </div>
                        )}
                        {!opd.prescription?.Notes && opd.Description && (
                            <div>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Notes</div>
                                <p className="text-sm text-gray-700 italic border-l-2 border-gray-200 pl-3">"{opd.Description}"</p>
                            </div>
                        )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
