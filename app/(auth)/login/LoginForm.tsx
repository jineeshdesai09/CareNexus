"use client";

import { useState } from "react";
import { login } from "@/app/actions/auth";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={login} className="space-y-6">
      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 px-1">
          Email Address
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors">
            <Mail className="w-5 h-5" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="doctor.smith@carenexus.com"
            className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-zinc-900 rounded-xl border-none focus:ring-2 focus:ring-teal-600 focus:bg-white dark:focus:bg-zinc-950 transition-all text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 px-1">
          Password
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors">
            <Lock className="w-5 h-5" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="••••••••"
            className="w-full pl-11 pr-12 py-4 bg-slate-50 dark:bg-zinc-900 rounded-xl border-none focus:ring-2 focus:ring-teal-600 focus:bg-white dark:focus:bg-zinc-950 transition-all text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
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

      {/* Remember & Forgot */}
      <div className="flex items-center justify-between py-2">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              className="peer h-5 w-5 rounded border-slate-300 dark:border-zinc-700 text-teal-600 focus:ring-teal-600 bg-slate-50 dark:bg-zinc-900 transition-all"
            />
          </div>
          <span className="text-sm font-medium text-slate-600 dark:text-zinc-400 group-hover:text-slate-900 dark:group-hover:text-zinc-200 transition-colors">
            Remember me
          </span>
        </label>
        <Link
          href="#"
          className="text-sm font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors underline-offset-4 hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit Button */}
      <SubmitButton
        className="w-full py-4 px-6 bg-gradient-to-br from-teal-600 to-teal-700 dark:from-teal-500 dark:to-teal-600 text-white font-bold rounded-2xl shadow-lg shadow-teal-600/20 dark:shadow-none hover:shadow-teal-600/40 transform hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
        loadingText="Authenticating..."
      >
        <span>Sign In to Dashboard</span>
        <ArrowRight className="w-5 h-5" />
      </SubmitButton>
    </form>
  );
}
