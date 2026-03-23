"use client";

import { useState } from "react";
import { login } from "@/app/actions/auth";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={login} className="space-y-6">
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
          className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 dark:placeholder:text-zinc-500"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-zinc-300 mb-2">
          Password
        </label>
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="Enter your Password"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 dark:placeholder:text-zinc-500 pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-lg 
        hover:bg-blue-700 dark:hover:bg-blue-400 transition-colors shadow-lg shadow-blue-200 dark:shadow-none hover:shadow-xl"
      >
        Login
      </button>

      <div className="flex flex-col gap-3 text-center">
        <Link href="/register" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm">
          Register for a new account
        </Link>
        <button
          type="button"
          className="text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 font-medium text-xs"
        >
          Forgot Password?
        </button>
      </div>
    </form>
  );
}
