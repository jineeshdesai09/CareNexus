"use client";

import React, { useState } from "react";
import { createPatient } from "@/app/actions/patient";

const PatientRegistrationForm = () => {
  const [formData, setFormData] = useState({
    PatientName: "",
    DOB: "",
    age: "",
    Gender: "",
    BloodGroup: "",
    MobileNo: "",
    EmergencyContactNo: "",
    Email: "",
    Address: "",
    ReferredBy: "",
    Description: ""
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
      MobileNo: "",
      EmergencyContactNo: "",
      Email: "",
      Address: "",
      ReferredBy: "",
      Description:""
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Patient Registration
        </h1>

        <form action={createPatient}>
          {/* Patient Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Patient Name
            </label>
            <input
              type="text"
              name="PatientName"
              value={formData.PatientName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* DOB & Age */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="DOB"
                value={formData.DOB}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Age
              </label>
              <input
                type="text"
                value={formData.age}
                readOnly
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Gender & Blood Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Gender
              </label>
              <select
                name="Gender"
                value={formData.Gender}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Blood Group
              </label>
              <select
                name="BloodGroup"
                value={formData.BloodGroup}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="">Select blood group</option>
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

          {/* Mobile */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Mobile Number
            </label>
            <input
              type="tel"
              name="MobileNo"
              value={formData.MobileNo}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* EmergencyContactNo */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Emergency Number
            </label>
            <input
              type="tel"
              name="EmergencyContactNo"
              value={formData.EmergencyContactNo}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Address */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Address
            </label>
            <textarea
              name="Address"
              value={formData.Address}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Reffered by */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Reffer Doctor
            </label>
            <input
              type="text"
              name="ReferredBy"
              value={formData.ReferredBy}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Description
            </label>
            <textarea
              name="Description"
              value={formData.Description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create & Issue Patient ID
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="w-full py-3 bg-gray-100 text-gray-900 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientRegistrationForm;
