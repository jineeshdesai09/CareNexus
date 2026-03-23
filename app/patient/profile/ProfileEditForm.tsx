"use client";

import { useState } from "react";
import { updatePatientProfile } from "@/app/actions/patient";
import { Save, User as UserIcon, Phone, MapPin, Briefcase, Ruler, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
                <div className={`p-4 rounded-xl flex items-center gap-3 border animate-in fade-in slide-in-from-top-2 ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-800" : "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/30 dark:border-rose-800"}`}>
                    {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <p className="font-semibold text-sm">{message.text}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fixed Information */}
                <Card className="bg-slate-50 dark:bg-zinc-900/50 border-none ring-1 ring-slate-200 dark:ring-zinc-800 shadow-none">
                    <CardHeader className="pb-4 border-b border-slate-200 dark:border-zinc-800">
                        <CardTitle className="text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <UserIcon className="w-4 h-4" />
                            Basic Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Full Name</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-zinc-50">{patient.PatientName}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-6 pt-2">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Age / Gender</p>
                                <p className="text-lg font-semibold text-slate-700 dark:text-zinc-300">{patient.Age}Y / {patient.Gender}</p>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Blood Group</label>
                                <div className="relative">
                                  <select
                                      name="BloodGroup"
                                      defaultValue={patient.BloodGroup || ""}
                                      className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm transition-shadow focus-visible:outline-none focus-visible:border-teal-500 focus-visible:ring-1 focus-visible:ring-teal-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus-visible:ring-teal-500 appearance-none font-medium dark:text-zinc-100"
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
                        </div>
                        <div className="pt-2">
                            <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Registration No</p>
                            <span className="inline-flex items-center rounded-full bg-slate-200 dark:bg-zinc-800 px-3 py-1 text-xs font-semibold text-slate-800 dark:text-zinc-300">
                                #{patient.PatientNo}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Editable: Contact Info */}
                <Card className="bg-white dark:bg-zinc-900/50 border-none ring-1 ring-slate-200 dark:ring-zinc-800 shadow-sm">
                    <CardHeader className="pb-4 border-b border-slate-100 dark:border-zinc-800/50">
                        <CardTitle className="text-xs font-bold text-teal-600 dark:text-teal-500 uppercase tracking-widest flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Contact Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-5">
                        <Input
                            label="MOBILE NUMBER"
                            type="text"
                            name="MobileNo"
                            defaultValue={patient.MobileNo}
                            required
                            placeholder="e.g. +1 234 567 8900"
                        />
                        <Input
                            label="EMERGENCY CONTACT"
                            type="text"
                            name="EmergencyContactNo"
                            defaultValue={patient.EmergencyContactNo || ""}
                            placeholder="Emergency contact number"
                        />
                    </CardContent>
                </Card>

                {/* Editable: Personal Info */}
                <Card className="bg-white dark:bg-zinc-900/50 border-none ring-1 ring-slate-200 dark:ring-zinc-800 shadow-sm">
                    <CardHeader className="pb-4 border-b border-slate-100 dark:border-zinc-800/50">
                        <CardTitle className="text-xs font-bold text-teal-600 dark:text-teal-500 uppercase tracking-widest flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            Professional & Physical
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-5">
                        <Input
                            label="OCCUPATION"
                            type="text"
                            name="Occupation"
                            defaultValue={patient.Occupation || ""}
                            placeholder="e.g. Software Engineer"
                        />
                        <Input
                            label="HEIGHT (CM)"
                            type="number"
                            name="Height"
                            leftIcon={<Ruler className="w-4 h-4" />}
                            defaultValue={patient.Height || ""}
                            placeholder="e.g. 175"
                        />
                    </CardContent>
                </Card>

                {/* Editable: Address */}
                <Card className="bg-white dark:bg-zinc-900/50 border-none ring-1 ring-slate-200 dark:ring-zinc-800 shadow-sm">
                    <CardHeader className="pb-4 border-b border-slate-100 dark:border-zinc-800/50">
                        <CardTitle className="text-xs font-bold text-teal-600 dark:text-teal-500 uppercase tracking-widest flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Address Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-5">
                        <div className="space-y-1.5 w-full">
                            <label className="text-[10px] font-bold uppercase tracking-wider leading-none text-slate-400 dark:text-zinc-500">
                                FULL ADDRESS
                            </label>
                            <textarea
                                name="Address"
                                defaultValue={patient.Address || ""}
                                rows={2}
                                placeholder="Enter your full address"
                                className="flex min-h-[80px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 transition-shadow focus-visible:outline-none focus-visible:border-teal-500 focus-visible:ring-1 focus-visible:ring-teal-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus-visible:ring-teal-500 resize-none font-medium"
                            />
                        </div>
                        <Input
                            label="PIN CODE"
                            type="text"
                            name="PinCode"
                            defaultValue={patient.PinCode || ""}
                            placeholder="e.g. 10001"
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end pt-4">
                <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="gap-2 shadow-lg hover:shadow-teal-600/20 px-8 dark:bg-teal-600 dark:text-zinc-50 dark:hover:bg-teal-500"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {loading ? "Updating Profile..." : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}
