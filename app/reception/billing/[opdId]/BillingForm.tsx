"use client";

import { useState, useMemo } from "react";
import { createReceipt } from "@/app/actions/receipt";

interface SubTreatment {
    SubTreatmentTypeID: number;
    SubTreatmentTypeName: string;
    Rate: number;
}

interface Treatment {
    TreatmentTypeID: number;
    TreatmentTypeName: string;
    SubTreatmentTypes: SubTreatment[];
}

interface BillingFormProps {
    opdId: number;
    baseTotal: number;
    treatments: Treatment[];
    isRateEnabled?: boolean;
}

export default function BillingForm({ opdId, baseTotal, treatments, isRateEnabled = true }: BillingFormProps) {
    const [selectedServices, setSelectedServices] = useState<Record<number, { checked: boolean, quantity: number, rate: number }>>({});
    const [isInsurance, setIsInsurance] = useState(false);

    const handleServiceToggle = (id: number, rate: number, checked: boolean) => {
        setSelectedServices(prev => ({
            ...prev,
            [id]: {
                checked,
                rate,
                quantity: prev[id]?.quantity || 1
            }
        }));
    };

    const handleQuantityChange = (id: number, quantity: number) => {
        setSelectedServices(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                quantity: Math.max(1, quantity)
            }
        }));
    };

    const grandTotal = useMemo(() => {
        const servicesTotal = Object.values(selectedServices).reduce((sum, item) => {
            if (item.checked) {
                return sum + (item.rate * item.quantity);
            }
            return sum;
        }, 0);
        return baseTotal + servicesTotal;
    }, [selectedServices, baseTotal]);

    return (
        <form action={createReceipt} className="p-6 space-y-6">
            <input type="hidden" name="OPDID" value={opdId} />

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded flex justify-between items-center text-blue-900 dark:text-blue-100 font-medium border border-blue-100 dark:border-blue-800/50">
                <span>OPD Registration Fee</span>
                <span>₹ {baseTotal.toFixed(2)}</span>
            </div>

            {/* Billable Services */}
            <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-zinc-100 mb-4">Add Billable Services</h2>
                <div className="space-y-4">
                    {treatments.map((treatment) => (
                        <div key={treatment.TreatmentTypeID} className="border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                            <div className="bg-gray-50 dark:bg-zinc-900/50 px-4 py-2 border-b border-gray-200 dark:border-zinc-800 font-medium text-gray-700 dark:text-zinc-300">
                                {treatment.TreatmentTypeName}
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                                {treatment.SubTreatmentTypes.map((sub) => (
                                    <div key={sub.SubTreatmentTypeID} className="p-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition">
                                        <label className="flex items-center gap-3 cursor-pointer flex-1">
                                            <input
                                                type="checkbox"
                                                name={`subtreatment_${sub.SubTreatmentTypeID}`}
                                                checked={!!selectedServices[sub.SubTreatmentTypeID]?.checked}
                                                onChange={(e) => handleServiceToggle(sub.SubTreatmentTypeID, sub.Rate, e.target.checked)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 rounded"
                                            />
                                            <div>
                                                <span className="text-gray-900 dark:text-zinc-100 block font-medium">{sub.SubTreatmentTypeName}</span>
                                                {isRateEnabled && <span className="text-gray-500 dark:text-zinc-400 text-sm">₹ {sub.Rate.toString()}</span>}
                                            </div>
                                        </label>
                                        {isRateEnabled && (
                                            <div className="flex gap-2 items-center">
                                                <label className="text-xs text-gray-500 dark:text-zinc-400">Qty:</label>
                                                <input
                                                    type="number"
                                                    name={`quantity_${sub.SubTreatmentTypeID}`}
                                                    value={selectedServices[sub.SubTreatmentTypeID]?.quantity || 1}
                                                    onChange={(e) => handleQuantityChange(sub.SubTreatmentTypeID, parseInt(e.target.value))}
                                                    min={1}
                                                    className="w-16 p-1 border border-gray-200 dark:border-zinc-700 rounded text-right text-sm bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-gray-200 dark:border-zinc-800 pt-6 space-y-6">
                {/* Insurance / TPA */}
                <div className="bg-slate-50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={isInsurance} 
                            onChange={(e) => setIsInsurance(e.target.checked)}
                            className="h-5 w-5 rounded border-slate-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500 bg-white dark:bg-zinc-950" 
                        />
                        <span className="font-bold text-slate-700 dark:text-zinc-300">Apply Insurance / TPA (Third Party Administrator)</span>
                    </label>

                    {isInsurance && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 dark:text-zinc-500 uppercase">Insurance Provider</label>
                                <input type="text" name="InsuranceProvider" className="w-full p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g. Star Health" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 dark:text-zinc-500 uppercase">Policy / Claim No</label>
                                <input type="text" name="PolicyNo" className="w-full p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="POL-123456" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 dark:text-zinc-500 uppercase">Claim Status</label>
                                <select name="ClaimStatus" className="w-full p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                    <option value="PENDING">Pending Approval</option>
                                    <option value="APPROVED">Approved</option>
                                    <option value="REJECTED">Rejected</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1 font-bold">Receipt Notes</label>
                    <input type="text" name="Description" className="w-full px-4 py-3 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Optional notes for this receipt..." />
                </div>

                {/* Amount Display */}
                <div className="bg-gray-900 dark:bg-black text-white p-6 rounded-xl shadow-inner border border-transparent dark:border-zinc-800">
                    <div className="flex justify-between items-center mb-2 text-gray-400 text-sm">
                        <span>Total Calculation</span>
                        <span>Auto-summarized</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <span className="text-xl font-medium tracking-tight">Grand Total</span>
                        <div className="text-right">
                            <span className="text-sm mr-2 opacity-70 font-mono">INR</span>
                            <span className="text-4xl font-bold font-mono">₹ {grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                    <input type="hidden" name="AmountPaid" value={grandTotal} />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-4 rounded-lg flex items-start gap-3">
                    <span className="text-blue-600 dark:text-blue-500 mt-0.5 text-lg">ℹ️</span>
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                        This is the final amount to be collected from the patient. Ensure all services are checked above.
                    </p>
                </div>

                <button type="submit" className="w-full bg-blue-600 dark:bg-blue-500 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 dark:hover:bg-blue-400 transition shadow-lg dark:shadow-none transform active:scale-[0.98] border border-blue-700 dark:border-transparent">
                    Process & Print Receipt
                </button>
            </div>
        </form>
    );
}
