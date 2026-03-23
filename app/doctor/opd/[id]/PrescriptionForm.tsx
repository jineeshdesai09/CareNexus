"use client";

import { useState } from "react";
import { Plus, Trash2, Calendar, Heart, Thermometer, Activity, Weight as WeightIcon, Ruler, Save, Copy } from "lucide-react";
import { savePrescriptionTemplate } from "@/app/actions/prescriptionTemplate";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
        <div className="flex flex-col space-y-6">
            {/* Vitals Section */}
            <Card className="border-none ring-1 ring-slate-200 dark:ring-zinc-800 shadow-sm bg-slate-50/50 dark:bg-zinc-900/30">
                <CardHeader className="pb-4 border-b border-slate-200 dark:border-zinc-800 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-bold text-teal-700 dark:text-teal-400 uppercase tracking-widest flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Patient Vitals
                    </CardTitle>
                    {defaultVitals?.Height && (
                        <div className="px-3 py-1.5 bg-teal-50 dark:bg-teal-900/40 border border-teal-100 dark:border-teal-800/50 rounded-lg inline-flex items-center gap-2 text-teal-700 dark:text-teal-300 text-xs font-bold shadow-sm">
                            <Ruler className="w-3.5 h-3.5" />
                            Baseline Height: {defaultVitals.Height} cm
                        </div>
                    )}
                </CardHeader>
                <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-5 gap-6">
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <Heart className="w-3.5 h-3.5 text-rose-500" />
                            Blood Pressure
                        </label>
                        <div className="flex items-center gap-2 bg-white dark:bg-zinc-950 px-2 py-1 rounded-lg border border-slate-300 dark:border-zinc-700 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-shadow">
                            <input 
                                type="number" 
                                name="BP_Systolic" 
                                placeholder="SYS" 
                                defaultValue={defaultVitals?.BP_Systolic ?? ""}
                                className="w-full bg-transparent border-none focus:ring-0 text-sm py-1.5 text-slate-900 dark:text-zinc-100 font-bold text-center placeholder-slate-400"
                            />
                            <span className="text-slate-300 dark:text-zinc-600 font-bold">/</span>
                            <input 
                                type="number" 
                                name="BP_Diastolic" 
                                placeholder="DIA" 
                                defaultValue={defaultVitals?.BP_Diastolic ?? ""}
                                className="w-full bg-transparent border-none focus:ring-0 text-sm py-1.5 text-slate-900 dark:text-zinc-100 font-bold text-center placeholder-slate-400"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                            Temp (°C)
                        </label>
                        <Input 
                            type="number" 
                            step="0.1" 
                            name="Temperature" 
                            placeholder="e.g. 37.0" 
                            defaultValue={defaultVitals?.Temperature ?? ""}
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <Activity className="w-3.5 h-3.5 text-emerald-500" />
                            Pulse (bpm)
                        </label>
                        <Input 
                            type="number" 
                            name="Pulse" 
                            placeholder="e.g. 72" 
                            defaultValue={defaultVitals?.Pulse ?? ""}
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <WeightIcon className="w-3.5 h-3.5 text-blue-500" />
                            Weight (kg)
                        </label>
                        <div className="w-full px-3 py-2 bg-slate-100/50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-600 dark:text-zinc-400 font-bold text-sm h-10 flex items-center shadow-inner">
                            {defaultVitals?.Weight || "—"}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <Activity className="w-3.5 h-3.5 text-indigo-500" />
                            SpO2 (%)
                        </label>
                        <div className="w-full px-3 py-2 bg-slate-100/50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-600 dark:text-zinc-400 font-bold text-sm h-10 flex items-center shadow-inner">
                            {defaultVitals?.SpO2 || "—"}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-none ring-1 ring-slate-200 dark:ring-zinc-800 shadow-sm">
                <CardHeader className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800/50 gap-4">
                    <CardTitle className="text-lg font-bold text-slate-800 dark:text-zinc-100">Prescription</CardTitle>
                    <div className="flex flex-wrap items-center gap-3">
                        {currentTemplates.length > 0 && (
                            <div className="flex items-center gap-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-teal-500">
                                <Copy className="w-4 h-4 text-slate-400" />
                                <select 
                                    onChange={(e) => handleLoadTemplate(e.target.value)}
                                    className="border-none bg-transparent text-sm font-semibold text-slate-700 dark:text-zinc-300 focus:ring-0 py-1 pl-1 pr-6"
                                    defaultValue=""
                                >
                                    <option value="" disabled>Load Template...</option>
                                    {currentTemplates.map(t => (
                                        <option key={t.TemplateID} value={t.TemplateID}>{t.TemplateName}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleSaveTemplate}
                            disabled={selectedMedicines.length === 0 || isSavingTemplate}
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Save as Template
                        </Button>
                        <Button
                            type="button"
                            onClick={addMedicine}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Medicine
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest min-w-[300px]">Medicine Name</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest min-w-[120px]">Dosage</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest min-w-[140px]">Frequency</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest min-w-[120px]">Duration</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest min-w-[180px]">Instructions</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                            {selectedMedicines.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center text-slate-400 dark:text-zinc-500 text-sm font-medium">
                                        No medications added. Click "Add Medicine" to start prescribing.
                                    </td>
                                </tr>
                            ) : (
                                selectedMedicines.map((item, index) => (
                                    <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <input
                                                name={`med_name_${index}`}
                                                type="text"
                                                placeholder="Enter Medicine Name..."
                                                value={item.MedicineName}
                                                onChange={(e) => updateMedicine(index, "MedicineName", e.target.value)}
                                                required
                                                className="w-full rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                name={`med_dosage_${index}`}
                                                type="text"
                                                placeholder="1 tab"
                                                value={item.Dosage}
                                                onChange={(e) => updateMedicine(index, "Dosage", e.target.value)}
                                                required
                                                className="w-full rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                name={`med_freq_${index}`}
                                                type="text"
                                                placeholder="1-0-1"
                                                value={item.Frequency}
                                                onChange={(e) => updateMedicine(index, "Frequency", e.target.value)}
                                                required
                                                className="w-full rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                name={`med_dur_${index}`}
                                                type="text"
                                                placeholder="5 days"
                                                value={item.Duration}
                                                onChange={(e) => updateMedicine(index, "Duration", e.target.value)}
                                                required
                                                className="w-full rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                name={`med_inst_${index}`}
                                                value={item.Instructions}
                                                onChange={(e) => updateMedicine(index, "Instructions", e.target.value)}
                                                className="w-full rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow appearance-none"
                                            >
                                                <option value="After Food">After Food</option>
                                                <option value="Before Food">Before Food</option>
                                                <option value="Empty Stomach">Empty Stomach</option>
                                                <option value="At Bedtime">At Bedtime</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => removeMedicine(index)}
                                                className="text-rose-500 border-rose-200 hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-900/20"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <input type="hidden" name="medicine_count" value={selectedMedicines.length} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 border-none ring-1 ring-slate-200 dark:ring-zinc-800 shadow-sm">
                    <CardHeader className="pb-2 text-sm font-bold text-slate-500 uppercase tracking-widest">
                        Prescription Notes & Advice
                    </CardHeader>
                    <CardContent>
                        <textarea
                            name="PrescriptionNotes"
                            rows={4}
                            placeholder="General advice, lifestyle changes, or diet instructions..."
                            defaultValue={initialNotes}
                            className="w-full rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow resize-none"
                        />
                    </CardContent>
                </Card>

                <Card className="border-none ring-[1.5px] ring-teal-500/30 bg-teal-50/30 dark:bg-teal-900/10 shadow-sm">
                    <CardHeader className="pb-2 text-sm font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest flex flex-row items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Follow-up Visit
                    </CardHeader>
                    <CardContent>
                        <Input 
                            type="date" 
                            name="FollowUpDate" 
                            defaultValue={defaultFollowUpDate}
                            className="bg-white dark:bg-zinc-950 border-teal-200 dark:border-teal-800 focus-visible:ring-teal-500"
                        />
                        <p className="mt-3 text-[11px] font-medium text-slate-500 dark:text-zinc-500 leading-normal">
                            Schedule the next consultation. This will map directly to the follow-up queue.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
