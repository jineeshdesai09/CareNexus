"use client";

import React, { useState } from "react";
import { createPatient } from "@/app/actions/patient";
import { User, MapPin, Phone, Briefcase, Heart, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";

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
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <span className="p-2 bg-blue-600 rounded-xl text-white">
                <User className="w-6 h-6" />
            </span>
            Patient Registration
          </h1>
          <p className="text-gray-500 mt-1 font-medium">Create a new digital medical record for a patient</p>
        </div>
        <div className="flex gap-3">
            <Link href="/reception/patients/directory" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition shadow-sm">
                <Search className="w-4 h-4" />
                View Directory
            </Link>
            <Link href="/reception/dashboard" className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-200 transition">
                <ArrowLeft className="w-4 h-4" />
                Back
            </Link>
        </div>
      </div>

      <form action={createPatient} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Personal & Contact */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Basic Info */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b border-gray-50 pb-4">
                <Heart className="w-5 h-5 text-red-500" />
                Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Patient Name</label>
                    <input
                        name="PatientName"
                        value={formData.PatientName}
                        onChange={handleChange}
                        required
                        placeholder="e.g. John Doe"
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all text-gray-900 font-medium"
                    />
                </div>
                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Date of Birth</label>
                    <input
                        type="date"
                        name="DOB"
                        value={formData.DOB}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all text-gray-900 font-medium"
                    />
                </div>
                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Current Age</label>
                    <input
                        type="text"
                        value={formData.age}
                        readOnly
                        placeholder="Auto-calculated"
                        className="w-full px-5 py-3 bg-gray-100 border border-gray-200 rounded-2xl text-gray-500 font-bold cursor-not-allowed"
                    />
                </div>
                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Gender</label>
                    <select
                        name="Gender"
                        value={formData.Gender}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all text-gray-900 font-medium appearance-none"
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Blood Group</label>
                    <select
                        name="BloodGroup"
                        value={formData.BloodGroup}
                        onChange={handleChange}
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all text-gray-900 font-medium appearance-none"
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
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Height (cm)</label>
                    <input
                        type="number"
                        step="0.1"
                        name="Height"
                        value={formData.Height}
                        onChange={handleChange}
                        placeholder="e.g. 175"
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all text-gray-900 font-medium"
                    />
                </div>
            </div>
          </div>

          {/* Section 2: Contact Info */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b border-gray-50 pb-4">
                <Phone className="w-5 h-5 text-blue-500" />
                Contact Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Primary Mobile No</label>
                    <input
                        type="tel"
                        name="MobileNo"
                        value={formData.MobileNo}
                        onChange={handleChange}
                        required
                        placeholder="10-digit number"
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all text-gray-900 font-medium"
                    />
                </div>
                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Emergency Contact</label>
                    <input
                        type="tel"
                        name="EmergencyContactNo"
                        value={formData.EmergencyContactNo}
                        onChange={handleChange}
                        required
                        placeholder="Relative's number"
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all text-gray-900 font-medium"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Residential Address</label>
                    <textarea
                        name="Address"
                        value={formData.Address}
                        onChange={handleChange}
                        rows={2}
                        placeholder="House no, Street, Locality..."
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all text-gray-900 font-medium"
                    />
                </div>
                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Pin Code</label>
                    <input
                        name="PinCode"
                        value={formData.PinCode}
                        onChange={handleChange}
                        placeholder="6-digit code"
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all text-gray-900 font-medium"
                    />
                </div>
                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Occupation</label>
                    <input
                        name="Occupation"
                        value={formData.Occupation}
                        onChange={handleChange}
                        placeholder="e.g. Student, Engineer"
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all text-gray-900 font-medium"
                    />
                </div>
            </div>
          </div>
        </div>

        {/* Right: Referral & Summary */}
        <div className="space-y-8">
            <div className="bg-slate-900 p-8 rounded-3xl text-white space-y-6 shadow-xl shadow-slate-200">
                <h2 className="text-xl font-bold flex items-center gap-2 border-b border-slate-800 pb-4">
                    <Briefcase className="w-5 h-5 text-blue-400" />
                    Referral Details
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Referred By (Doctor/Hospital)</label>
                        <input
                            name="ReferredBy"
                            value={formData.ReferredBy}
                            onChange={handleChange}
                            className="w-full px-5 py-3 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-slate-700 focus:outline-none transition-all text-white font-medium"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Clinical Remarks (Internal)</label>
                        <textarea
                            name="Description"
                            value={formData.Description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-5 py-3 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-slate-700 focus:outline-none transition-all text-white font-medium"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <button
                    type="submit"
                    className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-[0.98] flex items-center justify-center gap-3"
                >
                    <User className="w-6 h-6" />
                    REGISTER PATIENT
                </button>

                <button
                    type="button"
                    onClick={handleCancel}
                    className="w-full py-4 bg-white text-gray-500 border border-gray-200 rounded-3xl font-bold hover:bg-gray-50 transition-all"
                >
                    RESET FORM
                </button>
            </div>

            <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
                <p className="text-xs text-amber-800 leading-relaxed font-medium italic">
                    * Patient ID will be automatically issued based on the next sequence in the hospital master records.
                </p>
            </div>
        </div>
      </form>
    </div>
  );
};

export default PatientRegistrationForm;
