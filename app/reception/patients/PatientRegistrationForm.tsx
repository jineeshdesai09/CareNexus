"use client";

import React, { useState } from "react";
import { createPatient } from "@/app/actions/patient";
import { User, MapPin, Phone, Briefcase, Heart, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const PatientRegistrationForm = () => {
  const [formData, setFormData] = useState({
    PatientName: "",
    DOB: "",
    age: "",
    Gender: "",
    BloodGroup: "",
    Occupation: "",
    MobileNo: "",
    EmergencyContactNo: "",
    Address: "",
    PinCode: "",
    ReferredBy: "",
    Description: "",
    Height: ""
  });

  const calculateAge = (dob: string) => {
    if (!dob) return "";
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "DOB" && { age: calculateAge(value) }),
    }));
  };

  const handleCancel = () => {
    setFormData({
      PatientName: "",
      DOB: "",
      age: "",
      Gender: "",
      BloodGroup: "",
      Occupation: "",
      MobileNo: "",
      EmergencyContactNo: "",
      Address: "",
      PinCode: "",
      ReferredBy: "",
      Description:"",
      Height: ""
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12 pt-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-3">
            <span className="p-2.5 bg-teal-100 dark:bg-teal-900/30 rounded-xl text-teal-700 dark:text-teal-400">
                <User className="w-6 h-6" />
            </span>
            Patient Registration
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-2 font-medium">Create a new digital medical record for a patient</p>
        </div>
        <div className="flex gap-3">
            <Link href="/reception/patients/directory" className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-sm font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                <Search className="w-4 h-4" />
                Directory
            </Link>
            <Link href="/reception/dashboard" className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-zinc-800 rounded-lg text-sm font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 transition focus:outline-none focus:ring-2 focus:ring-teal-500">
                <ArrowLeft className="w-4 h-4" />
                Back
            </Link>
        </div>
      </div>

      <form action={createPatient} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Personal & Contact */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Basic Info */}
          <Card className="border-none shadow-sm ring-1 ring-slate-200 dark:ring-zinc-800">
            <CardHeader className="border-b border-slate-100 dark:border-zinc-800/50 pb-4">
                <CardTitle className="text-sm font-bold text-teal-600 dark:text-teal-500 uppercase tracking-widest flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500" />
                    Basic Information
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <Input
                        label="FULL PATIENT NAME"
                        name="PatientName"
                        value={formData.PatientName}
                        onChange={handleChange}
                        required
                        placeholder="e.g. John Doe"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium leading-none mb-1.5 text-slate-900 dark:text-zinc-300">DATE OF BIRTH</label>
                    <input
                        type="date"
                        name="DOB"
                        value={formData.DOB}
                        onChange={handleChange}
                        required
                        className="flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm transition-shadow focus-visible:outline-none focus-visible:border-teal-500 focus-visible:ring-1 focus-visible:ring-teal-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-visible:ring-teal-500 border-slate-300"
                    />
                </div>
                <div>
                    <Input
                        label="CURRENT AGE"
                        type="text"
                        value={formData.age}
                        readOnly
                        placeholder="Auto-calculated"
                        disabled
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium leading-none mb-1.5 text-slate-900 dark:text-zinc-300">GENDER</label>
                    <select
                        name="Gender"
                        value={formData.Gender}
                        onChange={handleChange}
                        required
                        className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm transition-shadow focus-visible:outline-none focus-visible:border-teal-500 focus-visible:ring-1 focus-visible:ring-teal-500 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-visible:ring-teal-500 appearance-none font-medium"
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium leading-none mb-1.5 text-slate-900 dark:text-zinc-300">BLOOD GROUP</label>
                    <select
                        name="BloodGroup"
                        value={formData.BloodGroup}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm transition-shadow focus-visible:outline-none focus-visible:border-teal-500 focus-visible:ring-1 focus-visible:ring-teal-500 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-visible:ring-teal-500 appearance-none font-medium"
                    >
                        <option value="">Unknown</option>
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
                <div>
                    <Input
                        label="HEIGHT (CM)"
                        type="number"
                        step="0.1"
                        name="Height"
                        value={formData.Height}
                        onChange={handleChange}
                        placeholder="e.g. 175"
                    />
                </div>
            </CardContent>
          </Card>

          {/* Section 2: Contact Info */}
          <Card className="border-none shadow-sm ring-1 ring-slate-200 dark:ring-zinc-800">
            <CardHeader className="border-b border-slate-100 dark:border-zinc-800/50 pb-4">
                <CardTitle className="text-sm font-bold text-teal-600 dark:text-teal-500 uppercase tracking-widest flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contact Details
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Input
                        label="PRIMARY MOBILE NO"
                        type="tel"
                        name="MobileNo"
                        value={formData.MobileNo}
                        onChange={handleChange}
                        required
                        placeholder="10-digit number"
                    />
                </div>
                <div>
                    <Input
                        label="EMERGENCY CONTACT"
                        type="tel"
                        name="EmergencyContactNo"
                        value={formData.EmergencyContactNo}
                        onChange={handleChange}
                        required
                        placeholder="Relative's number"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium leading-none mb-1.5 text-slate-900 dark:text-zinc-300">RESIDENTIAL ADDRESS</label>
                    <textarea
                        name="Address"
                        value={formData.Address}
                        onChange={handleChange}
                        rows={2}
                        placeholder="House no, Street, Locality..."
                        className="flex min-h-[80px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm transition-shadow focus-visible:outline-none focus-visible:border-teal-500 focus-visible:ring-1 focus-visible:ring-teal-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:placeholder:text-zinc-500 dark:focus-visible:ring-teal-500 resize-none"
                    />
                </div>
                <div>
                    <Input
                        label="PIN CODE"
                        name="PinCode"
                        value={formData.PinCode}
                        onChange={handleChange}
                        placeholder="6-digit code"
                    />
                </div>
                <div>
                    <Input
                        label="OCCUPATION"
                        name="Occupation"
                        value={formData.Occupation}
                        onChange={handleChange}
                        placeholder="e.g. Student, Engineer"
                    />
                </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Referral & Summary */}
        <div className="space-y-6">
            <Card className="bg-slate-900 dark:bg-zinc-950 text-white border-none ring-1 ring-slate-800 dark:ring-zinc-800 shadow-xl shadow-slate-200 dark:shadow-none">
                <CardHeader className="border-b border-slate-800 dark:border-zinc-900 pb-4">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-teal-400" />
                        Referral Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Referred By (Doctor/Hospital)</label>
                        <input
                            name="ReferredBy"
                            value={formData.ReferredBy}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-slate-800 dark:bg-zinc-900 border border-slate-700 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all text-white font-medium text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Clinical Remarks (Internal)</label>
                        <textarea
                            name="Description"
                            value={formData.Description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-2.5 bg-slate-800 dark:bg-zinc-900 border border-slate-700 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all text-white font-medium text-sm resize-none"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-3">
                <Button
                    type="submit"
                    size="lg"
                    className="w-full font-bold shadow-lg hover:shadow-teal-600/20 py-6"
                >
                    <User className="w-5 h-5 mr-2" />
                    REGISTER PATIENT
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    size="lg"
                    className="w-full font-bold py-6"
                >
                    RESET FORM
                </Button>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/50">
                <p className="text-xs text-amber-800 dark:text-amber-500 leading-relaxed font-medium">
                    * Patient ID will be automatically issued based on the next sequence in the hospital master records.
                </p>
            </div>
        </div>
      </form>
    </div>
  );
};

export default PatientRegistrationForm;
