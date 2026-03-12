"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Medicine {
    MedicineID: number;
    Name: string;
    GenericName: string | null;
    Category: string | null;
}

interface PrescriptionFormProps {
    medicines: Medicine[];
}

export default function PrescriptionForm({ medicines }: PrescriptionFormProps) {
    const [selectedMedicines, setSelectedMedicines] = useState<{
        MedicineID: string;
        Dosage: string;
        Frequency: string;
        Duration: string;
        Instructions: string;
    }[]>([]);

    const addMedicine = () => {
        setSelectedMedicines([
            ...selectedMedicines,
            { MedicineID: "", Dosage: "", Frequency: "", Duration: "", Instructions: "" },
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="p-1.5 bg-green-100 rounded-lg text-lg">💊</span>
                    Prescription
                </h2>
                <button
                    type="button"
                    onClick={addMedicine}
                    className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"
                >
                    <Plus className="w-4 h-4" />
                    Add Medicine
                </button>
            </div>

            {selectedMedicines.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-gray-500">
                    No medicines added to prescription. Click "Add Medicine" to start.
                </div>
            ) : (
                <div className="space-y-4">
                    {selectedMedicines.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative group transition-all hover:bg-white hover:shadow-md">
                            <button
                                type="button"
                                onClick={() => removeMedicine(index)}
                                className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-full shadow-sm hover:bg-red-200 transition"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                <div className="lg:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Medicine</label>
                                    <select
                                        name={`med_id_${index}`}
                                        value={item.MedicineID}
                                        onChange={(e) => updateMedicine(index, "MedicineID", e.target.value)}
                                        required
                                        className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    >
                                        <option value="">Select Medicine...</option>
                                        {medicines.map((m) => (
                                            <option key={m.MedicineID} value={m.MedicineID}>
                                                {m.Name} {m.GenericName ? `(${m.GenericName})` : ""}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dosage</label>
                                    <input
                                        name={`med_dosage_${index}`}
                                        type="text"
                                        placeholder="e.g. 1-0-1"
                                        value={item.Dosage}
                                        onChange={(e) => updateMedicine(index, "Dosage", e.target.value)}
                                        required
                                        className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Frequency</label>
                                    <input
                                        name={`med_freq_${index}`}
                                        type="text"
                                        placeholder="Brief frequency"
                                        value={item.Frequency}
                                        onChange={(e) => updateMedicine(index, "Frequency", e.target.value)}
                                        required
                                        className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Duration</label>
                                    <input
                                        name={`med_dur_${index}`}
                                        type="text"
                                        placeholder="e.g. 5 days"
                                        value={item.Duration}
                                        onChange={(e) => updateMedicine(index, "Duration", e.target.value)}
                                        required
                                        className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="mt-3">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Specific Instructions (Optional)</label>
                                <input
                                    name={`med_inst_${index}`}
                                    type="text"
                                    placeholder="e.g. After food, avoid dairy"
                                    value={item.Instructions}
                                    onChange={(e) => updateMedicine(index, "Instructions", e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <input type="hidden" name="medicine_count" value={selectedMedicines.length} />

            <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Prescription Notes</label>
                <textarea
                    name="PrescriptionNotes"
                    rows={2}
                    placeholder="General advice or lifestyle changes..."
                    className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
            </div>
        </div>
    );
}
