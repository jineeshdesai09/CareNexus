"use client";

import React, { useState } from "react";

const PatientRegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    age: "",
    gender: "",
    bloodGroup: "",
    contactNumber: "",
    emergencyNumber: "",
    email: "",
    address: "",
    referredBy: "",
    insuranceProvider: "",
    policyNumber: "",
    coverageValidity: "",
  });

  const calculateAge = (dob: string) => {
    if (!dob) return "";
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
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
      ...(name === "dateOfBirth" && { age: calculateAge(value) }),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Patient ID created successfully!");
  };

  const handleCancel = () => {
    setFormData({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      age: "",
      gender: "",
      bloodGroup: "",
      contactNumber: "",
      emergencyNumber: "",
      email: "",
      address: "",
      referredBy: "",
      insuranceProvider: "",
      policyNumber: "",
      coverageValidity: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Patient Registration
        </h1>
        <p className="text-gray-600 mb-8">
          Enter patient details and insurance information (if any).
        </p>

        <div>
          {/* First Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First name"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
              required
            />
          </div>

          {/* Last Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last name"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
              required
            />
          </div>

          {/* Date of Birth and Age */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Age
              </label>
              <input
                type="text"
                name="age"
                value={formData.age}
                placeholder="Auto-calculated"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                readOnly
              />
            </div>
          </div>

          {/* Gender and Blood Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Blood Group
              </label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
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

          {/* Contact Number */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Contact Number
            </label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="+91 9xxxxxxxxx"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
              required
            />
          </div>

          {/* Emergency Mobile Number */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Emergency Mobile Number
            </label>
            <input
              type="tel"
              name="emergencyNumber"
              value={formData.emergencyNumber}
              onChange={handleChange}
              placeholder="+91 9xxxxxxxxx"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
              required
            />
          </div>

          {/* Address */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter full address"
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
              required
            />
          </div>

          {/* Referred By */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Referred By
            </label>
            <input
              type="text"
              name="referredBy"
              value={formData.referredBy}
              onChange={handleChange}
              placeholder="Doctor name or hospital"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Insurance Section */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Insurance (optional)
            </h2>

            {/* Provider */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Provider
              </label>
              <input
                type="text"
                name="insuranceProvider"
                value={formData.insuranceProvider}
                onChange={handleChange}
                placeholder="Insurance provider name"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Policy Number */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Policy Number
              </label>
              <input
                type="text"
                name="policyNumber"
                value={formData.policyNumber}
                onChange={handleChange}
                placeholder="Policy / Member number"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Coverage Validity */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Coverage Validity
              </label>
              <input
                type="text"
                name="coverageValidity"
                value={formData.coverageValidity}
                onChange={handleChange}
                placeholder="Valid from - to"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="submit"
              className="w-full py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create & Issue Patient ID
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full py-4 bg-gray-100 text-gray-900 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>

          <p className="text-sm text-gray-600 text-center mt-6">
            After patient creation, PatientID will be shown and a printed
            wristband can be issued at frontdesk.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistrationForm;
