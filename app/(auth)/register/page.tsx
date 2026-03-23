"use client";

import { Heart, ArrowLeft, UserPlus, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { register } from "@/app/actions/auth";
import { useState } from "react";
import ThemeToggle from "@/app/components/ui/ThemeToggle";

export default function RegisterPage() {
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-zinc-950 dark:to-zinc-900">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-950 shadow-sm border-b border-transparent dark:border-zinc-800 transition-colors">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-zinc-50">
              TechCare
            </span>
          </div>

          <div className="flex flex-row gap-4 items-center">
            <ThemeToggle />
            <Link
                href="/login"
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Login</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Register Form Container */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl dark:shadow-none p-8 dark:border dark:border-zinc-800">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-500 border border-transparent dark:border-blue-800/50">
                <UserPlus className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-50">Create Account</h1>
            </div>

            <form action={register} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-zinc-300 mb-2">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400
                  dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-600"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-zinc-300 mb-2">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400
                  dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-zinc-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Create a password"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400 pr-12
                    dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Mobile and Gender Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-zinc-300 mb-2">
                    Mobile No
                  </label>
                  <input
                    name="mobile"
                    type="tel"
                    required
                    placeholder="10-digit number"
                    pattern="[0-9]{10}"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900
                    dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-zinc-300 mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900
                    dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-zinc-300 mb-2">
                  Date of Birth
                </label>
                <input
                  name="dob"
                  type="date"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900
                  dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-600"
                  style={{ colorScheme: 'dark light' }}
                />
              </div>

              {/* Role Select */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-zinc-300 mb-2">
                  Select Role
                </label>
                <select
                  name="role"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900
                  dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
                >
                  <option value="">Select Role</option>
                  <option value="DOCTOR">Doctor</option>
                  <option value="RECEPTIONIST">Receptionist</option>
                  <option value="PATIENT">Patient</option>
                </select>
              </div>

              {role === "PATIENT" && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50">
                    <p className="text-xs text-blue-800 dark:text-blue-400">Note: Your patient ID will be issued upon admin approval.</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-lg 
                hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl dark:shadow-none"
              >
                Register Now
              </button>

              <p className="text-center text-sm text-gray-600 dark:text-zinc-400">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold">
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
