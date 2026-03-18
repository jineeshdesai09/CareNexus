"use client";

import { useState } from "react";
import { Plus, Trash2, Calendar, Heart, Thermometer, Activity, Weight as WeightIcon, Ruler, Save, Copy } from "lucide-react";
import { savePrescriptionTemplate } from "@/app/actions/prescriptionTemplate";

interface Medicine {
    MedicineID: number;
    Name: string;
    GenericName: string | null;
    Category: string | null;
}

interface PrescriptionFormProps {
    medicines: Medicine[];
    doctorID: number;
    templates: any[];
    defaultFollowUpDate?: string;
    defaultVitals?: {
        BP_Systolic?: number | null;
        BP_Diastolic?: number | null;
        Temperature?: number | null;
        Pulse?: number | null;
        Weight?: number | null;
        SpO2?: number | null;
        Height?: number | null;
    };
    initialMedicines?: {
        MedicineName: string;
        Dosage: string;
        Frequency: string;
        Duration: string;
        Instructions: string;
    }[];
    initialNotes?: string;
}

export default function PrescriptionForm({ 
    doctorID, 
    templates = [], 
    defaultFollowUpDate, 
    defaultVitals, 
    initialMedicines = [], 
    initialNotes = "" 
}: PrescriptionFormProps) {
    const [selectedMedicines, setSelectedMedicines] = useState<{
        MedicineName: string;
        Dosage: string;
        Frequency: string;
        Duration: string;
        Instructions: string;
    }[]>(initialMedicines);
    const [currentTemplates, setCurrentTemplates] = useState(templates);
    const [isSavingTemplate, setIsSavingTemplate] = useState(false);

    const addMedicine = () => {
        setSelectedMedicines([
            ...selectedMedicines,
            { MedicineName: "", Dosage: "", Frequency: "", Duration: "", Instructions: "After Food" },
        ]);
    };

    const removeMedicine = (index: number) => {
        setSelectedMedicines(selectedMedicines.filter((_, i) => i !== index));
    };

    const updateMedicine = (index: number, field: string, value: string) => {
        const newMedicines = [...selectedMedicines];
        newMedicines[index] = { ...newMedicines[index], [field]: value };
        setSelectedMedicines(newMedicines);
    };

    const handleLoadTemplate = (templateID: string) => {
        const template = currentTemplates.find(t => t.TemplateID.toString() === templateID);
        if (template) {
            const templateMedicines = template.Medicines.map((m: any) => ({
                MedicineName: m.MedicineName,
                Dosage: m.Dosage,
                Frequency: m.Frequency,
                Duration: m.Duration,
                Instructions: m.Instructions || "After Food"
            }));
            setSelectedMedicines(templateMedicines);
        }
    };

    const handleSaveTemplate = async () => {
        const name = prompt("Enter a name for this template (e.g., Fever Kit, Diabetic Routine):");
        if (!name) return;

        setIsSavingTemplate(true);
        const result = await savePrescriptionTemplate({
            TemplateName: name,
            DoctorID: doctorID,
            Medicines: selectedMedicines
        });

        if (result.success) {
            setCurrentTemplates([...currentTemplates, result.template]);
            alert("Template saved successfully!");
        } else {
            alert("Failed to save template.");
        }
        setIsSavingTemplate(false);
    };

    return (
        <div className="flex flex-col">
            {/* Vitals Section at the start of the form */}
            <div className="p-8 bg-blue-50/50 border-b border-blue-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-bold text-blue-800 uppercase tracking-wider flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Patient Vitals
                    </h3>
                    {defaultVitals?.Height && (
                        <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl inline-flex items-center gap-2 text-indigo-700 text-xs font-bold">
                            <Ruler className="w-3.5 h-3.5" />
                            Baseline Height: {defaultVitals.Height} cm
                        </div>
                    )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <Heart className="w-3 h-3 text-red-500" />
                            Blood Pressure
                        </label>
                        <div className="flex items-center gap-2">
                            <input 
                                type="number" 
                                name="BP_Systolic" 
                                placeholder="SYS" 
                                defaultValue={defaultVitals?.BP_Systolic ?? ""}
                                className="w-full rounded-lg border-slate-300 focus:ring-blue-500 focus:border-blue-500 text-base py-2 text-slate-900 font-bold text-center"
                            />
                            <span className="text-slate-400 font-bold">/</span>
                            <input 
                                type="number" 
                                name="BP_Diastolic" 
                                placeholder="DIA" 
                                defaultValue={defaultVitals?.BP_Diastolic ?? ""}
                                className="w-full rounded-lg border-slate-300 focus:ring-blue-500 focus:border-blue-500 text-base py-2 text-slate-900 font-bold text-center"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <Thermometer className="w-3 h-3 text-orange-500" />
                            Temp (°C)
                        </label>
                        <input 
                            type="number" 
                            step="0.1" 
                            name="Temperature" 
                            placeholder="e.g. 37.0" 
                            defaultValue={defaultVitals?.Temperature ?? ""}
                            className="w-full rounded-lg border-slate-300 focus:ring-blue-500 focus:border-blue-500 text-base py-2 text-slate-900 font-bold"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <Activity className="w-3 h-3 text-green-500" />
                            Pulse (bpm)
                        </label>
                        <input 
                            type="number" 
                            name="Pulse" 
                            placeholder="e.g. 72" 
                            defaultValue={defaultVitals?.Pulse ?? ""}
                            className="w-full rounded-lg border-slate-300 focus:ring-blue-500 focus:border-blue-500 text-base py-2 text-slate-900 font-bold"
                        />
                    </div>

                    {/* Receptionist-filled Vitals (Read-only) */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <WeightIcon className="w-3 h-3 text-emerald-500" />
                            Weight (kg)
                        </label>
                        <div className="w-full px-3 py-2 bg-white/50 border border-slate-200 rounded-lg text-slate-600 font-bold text-base h-[42px] flex items-center">
                            {defaultVitals?.Weight || "—"}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <Activity className="w-3 h-3 text-teal-500" />
                            SpO2 (%)
                        </label>
                        <div className="w-full px-3 py-2 bg-white/50 border border-slate-200 rounded-lg text-slate-600 font-bold text-base h-[42px] flex items-center">
                            {defaultVitals?.SpO2 || "—"}
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800">Prescription</h3>
                <div className="flex items-center gap-3">
                    {currentTemplates.length > 0 && (
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 py-1 shadow-sm">
                            <Copy className="w-4 h-4 text-slate-400" />
                            <select 
                                onChange={(e) => handleLoadTemplate(e.target.value)}
                                className="border-none bg-transparent text-sm font-bold text-slate-700 focus:ring-0 py-1 pl-1 pr-8"
                                defaultValue=""
                            >
                                <option value="" disabled>Load Template...</option>
                                {currentTemplates.map(t => (
                                    <option key={t.TemplateID} value={t.TemplateID}>{t.TemplateName}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={handleSaveTemplate}
                        disabled={selectedMedicines.length === 0 || isSavingTemplate}
                        className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-sm font-bold hover:bg-indigo-100 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Save current prescription as a template"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save as Template
                    </button>
                    <button
                        type="button"
                        onClick={addMedicine}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition shadow-sm"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Medicine
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider min-w-[350px]">Medicine Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Dosage</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Frequency</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Duration</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Instructions</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {selectedMedicines.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-16 text-center text-slate-400 text-lg italic">
                                    No medications added. Click "Add Medicine" to start prescribing.
                                </td>
                            </tr>
                        ) : (
                            selectedMedicines.map((item, index) => (
                                <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-5">
                                        <input
                                            name={`med_name_${index}`}
                                            type="text"
                                            placeholder="Enter Medicine Name..."
                                            value={item.MedicineName}
                                            onChange={(e) => updateMedicine(index, "MedicineName", e.target.value)}
                                            required
                                            className="w-full rounded-lg border-slate-300 focus:ring-blue-500 focus:border-blue-500 text-base py-2.5 text-slate-900 font-bold"
                                        />
                                    </td>
                                    <td className="px-6 py-5">
                                        <input
                                            name={`med_dosage_${index}`}
                                            type="text"
                                            placeholder="1 tab"
                                            value={item.Dosage}
                                            onChange={(e) => updateMedicine(index, "Dosage", e.target.value)}
                                            required
                                            className="w-28 rounded-lg border-slate-300 focus:ring-blue-500 focus:border-blue-500 text-base py-2.5 text-slate-900 font-bold placeholder:text-slate-400"
                                        />
                                    </td>
                                    <td className="px-6 py-5">
                                        <input
                                            name={`med_freq_${index}`}
                                            type="text"
                                            placeholder="1-0-1"
                                            value={item.Frequency}
                                            onChange={(e) => updateMedicine(index, "Frequency", e.target.value)}
                                            required
                                            className="w-32 rounded-lg border-slate-300 focus:ring-blue-500 focus:border-blue-500 text-base py-2.5 text-slate-900 font-bold placeholder:text-slate-400"
                                        />
                                    </td>
                                    <td className="px-6 py-5">
                                        <input
                                            name={`med_dur_${index}`}
                                            type="text"
                                            placeholder="5 days"
                                            value={item.Duration}
                                            onChange={(e) => updateMedicine(index, "Duration", e.target.value)}
                                            required
                                            className="w-28 rounded-lg border-slate-300 focus:ring-blue-500 focus:border-blue-500 text-base py-2.5 text-slate-900 font-bold placeholder:text-slate-400"
                                        />
                                    </td>
                                    <td className="px-6 py-5">
                                        <select
                                            name={`med_inst_${index}`}
                                            value={item.Instructions}
                                            onChange={(e) => updateMedicine(index, "Instructions", e.target.value)}
                                            className="w-full min-w-[200px] rounded-lg border-slate-300 focus:ring-blue-500 focus:border-blue-500 text-base py-2.5 text-slate-900 font-bold"
                                        >
                                            <option value="After Food">After Food</option>
                                            <option value="Before Food">Before Food</option>
                                            <option value="Empty Stomach">Empty Stomach</option>
                                            <option value="At Bedtime">At Bedtime</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button
                                            type="button"
                                            onClick={() => removeMedicine(index)}
                                            className="text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-6 h-6" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <input type="hidden" name="medicine_count" value={selectedMedicines.length} />

            <div className="p-8 bg-slate-50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-3">
                    <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider">Prescription Notes & Advice</label>
                    <textarea
                        name="PrescriptionNotes"
                        rows={4}
                        placeholder="General advice, lifestyle changes, or diet instructions..."
                        defaultValue={initialNotes}
                        className="w-full rounded-xl border-slate-300 focus:ring-blue-500 focus:border-blue-500 text-base p-5 text-slate-900 font-bold placeholder:text-slate-400 shadow-sm bg-white"
                    />
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <label className="flex items-center gap-2 text-sm font-bold text-blue-600 uppercase tracking-wider">
                        <Calendar className="w-4 h-4" />
                        Follow-up Visit
                    </label>
                    <input 
                        type="date" 
                        name="FollowUpDate" 
                        defaultValue={defaultFollowUpDate}
                        className="w-full rounded-lg border-slate-300 focus:ring-blue-500 focus:border-blue-500 text-base py-3 text-slate-900 font-bold"
                    />
                    <p className="mt-3 text-xs text-slate-400 leading-normal">
                        Schedule the next consultation. This helps tracking patient recovery.
                    </p>
                </div>
            </div>
        </div>
    );
}
