"use client";

import { useState } from "react";
import { updatePatientProfile } from "@/app/actions/patient";
import { Save, User as UserIcon, Phone, MapPin, Briefcase, Ruler, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ProfileEditForm({ patient }: { patient: any }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        const formData = new FormData(e.currentTarget);
        const data = {
            MobileNo: formData.get("MobileNo") as string,
            EmergencyContactNo: formData.get("EmergencyContactNo") as string,
            Occupation: formData.get("Occupation") as string,
            Address: formData.get("Address") as string,
            PinCode: formData.get("PinCode") as string,
            Height: formData.get("Height") ? Number(formData.get("Height")) : null,
            BloodGroup: formData.get("BloodGroup") as string,
        };

        try {
            await updatePatientProfile(data);
            setMessage({ type: "success", text: "Profile updated successfully!" });
        } catch (error: any) {
            setMessage({ type: "error", text: error.message || "Failed to update profile." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pb-12">
            {message.text && (
                <div className={`p-4 rounded-xl flex items-center gap-3 border animate-in fade-in slide-in-from-top-2 ${message.type === "success" ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"
                    }`}>
                    {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <p className="font-bold">{message.text}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fixed Information */}
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        Basic Information
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Full Name</p>
                            <p className="text-2xl font-black text-slate-800">{patient.PatientName}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-6 pt-2">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Age / Gender</p>
                                <p className="text-lg font-bold text-slate-700">{patient.Age}Y / {patient.Gender}</p>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Blood Group</label>
                                <select
                                    name="BloodGroup"
                                    defaultValue={patient.BloodGroup || ""}
                                    className="w-full p-4 rounded-2xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 font-bold bg-white transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">Not Set</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>
                        </div>
                        <div className="pt-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Registration No</p>
                            <p className="text-sm font-bold text-slate-500">#{patient.PatientNo}</p>
                        </div>
                    </div>
                </div>

                {/* Editable: Contact Info */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Contact Details
                    </h3>
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Mobile Number</label>
                            <input
                                type="text"
                                name="MobileNo"
                                defaultValue={patient.MobileNo}
                                required
                                placeholder="e.g. +1 234 567 8900"
                                className="w-full p-4 rounded-2xl border border-slate-200 text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:ring-2 focus:ring-blue-500 font-bold bg-slate-50/50 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Emergency Contact</label>
                            <input
                                type="text"
                                name="EmergencyContactNo"
                                defaultValue={patient.EmergencyContactNo || ""}
                                placeholder="Emergency contact number"
                                className="w-full p-4 rounded-2xl border border-slate-200 text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:ring-2 focus:ring-blue-500 font-bold bg-slate-50/50 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Editable: Personal Info */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Professional & Physical
                    </h3>
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Occupation</label>
                            <input
                                type="text"
                                name="Occupation"
                                defaultValue={patient.Occupation || ""}
                                placeholder="e.g. Software Engineer"
                                className="w-full p-4 rounded-2xl border border-slate-200 text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:ring-2 focus:ring-blue-500 font-bold bg-slate-50/50 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Height (cm)</label>
                            <div className="relative">
                                <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="number"
                                    name="Height"
                                    defaultValue={patient.Height || ""}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:ring-2 focus:ring-blue-500 font-bold bg-slate-50/50 transition-all"
                                    placeholder="e.g. 175"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Editable: Address */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Address Details
                    </h3>
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Full Address</label>
                            <textarea
                                name="Address"
                                defaultValue={patient.Address || ""}
                                rows={2}
                                placeholder="Enter your full address"
                                className="w-full p-4 rounded-2xl border border-slate-200 text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:ring-2 focus:ring-blue-500 font-bold bg-slate-50/50 transition-all resize-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Pin Code</label>
                            <input
                                type="text"
                                name="PinCode"
                                defaultValue={patient.PinCode || ""}
                                placeholder="e.g. 10001"
                                className="w-full p-4 rounded-2xl border border-slate-200 text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:ring-2 focus:ring-blue-500 font-bold bg-slate-50/50 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-10 py-5 bg-blue-600 text-white font-black text-lg rounded-2xl hover:bg-blue-700 transition-all flex items-center gap-3 shadow-xl hover:shadow-blue-200 active:scale-95 disabled:opacity-50"
                >
                    <Save className="w-6 h-6" />
                    {loading ? "Updating Profile..." : "Save Changes"}
                </button>
            </div>
        </form>
    );
}
