"use client";

import { Heart, Activity, ShieldCheck, Lock, User, Mail, EyeOff, Eye, Phone, Calendar, Users, Briefcase, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { register } from "@/app/actions/auth";
import { useState } from "react";
import ThemeToggle from "@/app/components/ui/ThemeToggle";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default function RegisterPage() {
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-slate-50 dark:bg-zinc-950 font-sans text-slate-900 dark:text-zinc-50">
      {/* Left Side: Branding & Illustration */}
      <section className="hidden md:flex md:w-1/2 lg:w-3/5 relative flex-col justify-center items-center p-12 overflow-hidden bg-gradient-to-br from-teal-700 to-teal-900 dark:from-teal-900 dark:to-teal-950">
        {/* Background Abstract Patterns */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern height="40" id="grid" patternUnits="userSpaceOnUse" width="40">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"></path>
              </pattern>
            </defs>
            <rect fill="url(#grid)" height="100%" width="100%"></rect>
          </svg>
        </div>
        
        {/* Content Container */}
        <div className="relative z-10 w-full max-w-xl">
          <div className="mb-12">
            <h1 className="font-extrabold text-5xl text-white tracking-tighter mb-4 flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                <Heart className="w-8 h-8 text-white" fill="white" />
              </div>
              Care Nexus
            </h1>
            <p className="text-xl text-teal-50 font-medium leading-relaxed max-w-md">
              Join the future of healthcare. Get your Care Nexus profile set up in seconds.
            </p>
          </div>
          
          {/* Abstract Medical Illustration */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-white/10 rounded-2xl blur-2xl group-hover:bg-white/20 transition duration-500"></div>
            <img 
              alt="Medical Concept" 
              className="relative rounded-2xl shadow-2xl transform group-hover:scale-[1.02] transition duration-500 w-full h-auto object-cover aspect-video" 
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2000&auto=format&fit=crop"
            />
            {/* Floating Stat Badge */}
            <div className="absolute -bottom-6 -right-6 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl p-6 rounded-2xl shadow-xl hidden lg:block border border-white/20 dark:border-zinc-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center text-teal-700 dark:text-teal-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Security</div>
                  <div className="text-xl font-black text-teal-700 dark:text-teal-400">Verified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Side: Auth Form */}
      <section className="flex-1 flex flex-col relative px-6 py-12 md:p-8 lg:p-12 bg-white dark:bg-zinc-950 h-screen overflow-y-auto w-full">
        
        {/* Theme Toggle (Absolute Top Right for desktop, static for mobile) */}
        <div className="absolute top-6 right-6 hidden md:block z-50">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md mx-auto my-auto relative z-10">
          {/* Mobile Header elements */}
          <div className="md:hidden flex justify-between items-center mb-6">
            <Link href="/login" className="text-slate-500 dark:text-zinc-400 hover:text-teal-600 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <ThemeToggle />
          </div>

          <div className="md:hidden text-center mb-8 flex flex-col items-center">
            <div className="w-12 h-12 bg-teal-600 dark:bg-teal-500 rounded-xl flex items-center justify-center mb-3">
              <Heart className="w-7 h-7 text-white" fill="white" />
            </div>
            <h1 className="font-extrabold text-3xl text-slate-900 dark:text-zinc-50 tracking-tighter">Care Nexus</h1>
          </div>
          
          <div className="bg-white dark:bg-zinc-950 rounded-2xl sm:shadow-none">
            <div className="mb-8 text-center md:text-left">
              <h2 className="font-extrabold text-2xl lg:text-3xl text-slate-900 dark:text-zinc-50 mb-2 tracking-tight">Create Account</h2>
              <p className="text-slate-500 dark:text-zinc-400 font-medium">Register for Care Nexus Access</p>
            </div>

            <form action={register} className="space-y-5">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 px-1 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-zinc-900 rounded-xl border-none focus:ring-2 focus:ring-teal-600 focus:bg-white dark:focus:bg-zinc-950 transition-all text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 px-1 uppercase tracking-wider">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="name@carenexus.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-zinc-900 rounded-xl border-none focus:ring-2 focus:ring-teal-600 focus:bg-white dark:focus:bg-zinc-950 transition-all text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 px-1 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Create a password"
                    className="w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-zinc-900 rounded-xl border-none focus:ring-2 focus:ring-teal-600 focus:bg-white dark:focus:bg-zinc-950 transition-all text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 dark:text-zinc-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Mobile and Gender Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 px-1 uppercase tracking-wider">
                    Mobile No
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors">
                      <Phone className="w-5 h-5" />
                    </div>
                    <input
                      name="mobile"
                      type="tel"
                      required
                      placeholder="10-digits"
                      pattern="[0-9]{10}"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-zinc-900 rounded-xl border-none focus:ring-2 focus:ring-teal-600 focus:bg-white dark:focus:bg-zinc-950 transition-all text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 px-1 uppercase tracking-wider">
                    Gender
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors">
                      <Users className="w-5 h-5" />
                    </div>
                    <select
                      name="gender"
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-zinc-900 rounded-xl border-none focus:ring-2 focus:ring-teal-600 focus:bg-white dark:focus:bg-zinc-950 transition-all text-slate-900 dark:text-zinc-100 appearance-none"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Date of Birth */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 px-1 uppercase tracking-wider">
                  Date of Birth
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <input
                    name="dob"
                    type="date"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-zinc-900 rounded-xl border-none focus:ring-2 focus:ring-teal-600 focus:bg-white dark:focus:bg-zinc-950 transition-all text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                    style={{ colorScheme: 'dark light' }}
                  />
                </div>
              </div>

              {/* Role Select */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 px-1 uppercase tracking-wider">
                  Select Role
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <select
                    name="role"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-zinc-900 rounded-xl border-none focus:ring-2 focus:ring-teal-600 focus:bg-white dark:focus:bg-zinc-950 transition-all text-slate-900 dark:text-zinc-100 appearance-none"
                  >
                    <option value="">Select Role</option>
                    <option value="DOCTOR">Doctor</option>
                    <option value="RECEPTIONIST">Receptionist</option>
                    <option value="PATIENT">Patient</option>
                  </select>
                </div>
              </div>

              {role === "PATIENT" && (
                <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-100 dark:border-teal-800/50 my-2">
                    <p className="text-xs text-teal-800 dark:text-teal-400 font-medium leading-relaxed">Note: Your patient ID will be issued upon admin approval.</p>
                </div>
              )}

              <div className="pt-2">
                <SubmitButton
                  className="w-full py-4 px-6 bg-gradient-to-br from-teal-600 to-teal-700 dark:from-teal-500 dark:to-teal-600 text-white font-bold rounded-2xl shadow-lg shadow-teal-600/20 dark:shadow-none hover:shadow-teal-600/40 transform hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>Register Now</span>
                  <ArrowRight className="w-5 h-5" />
                </SubmitButton>
              </div>

            </form>

            {/* Footer Action */}
            <div className="mt-8 text-center hidden md:block">
              <p className="text-slate-500 dark:text-zinc-400 font-medium text-sm">
                Already have an account? 
                <Link className="ml-1 text-teal-600 dark:text-teal-400 font-bold hover:text-teal-700 dark:hover:text-teal-300 transition-colors" href="/login">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
