import { Heart, ArrowLeft, LogIn } from "lucide-react";
import { login } from "@/app/actions/auth";
import { getSession } from "@/app/lib/session";
import { redirect } from "next/navigation";

export default async function LoginPage({ searchParams }: any) {
  const session = await getSession();
  if (session) redirect("/dashboard");

  const params = await searchParams;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">
              TechCare
            </span>
          </div>

          <a
            href="/"
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </a>
        </div>
      </header>

      {/* Login Form Container */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
          
            {params?.error === "invalid" && (
              <div className="rounded bg-red-100 text-red-800 px-4 py-2 text-sm mb-4">
                Invalid email or password
              </div>
            )}

            {params?.error === "role" && (
              <div className="rounded bg-yellow-100 text-yellow-800 px-4 py-2 text-sm mb-4">
                Selected role does not match your account
              </div>
            )}

            
            <form action={login} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="Enter your Password"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                />
              </div>

              {/* Role Select */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Select Role
                </label>
                <select
                  name="role"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                >
                  <option value="">Select Role</option>
                  <option value="ADMIN">Admin</option>
                  <option value="DOCTOR">Doctor</option>
                  <option value="RECEPTIONIST">Receptionist</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg 
                hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Login
              </button>

              <div className="text-center">
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Forgot Password?
                </button>
              </div>
            </form>

            {/* Demo Access */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Demo Access OF Admin:
              </p>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Email: admin@hospital.com</li>
                <li>• Password: admin123</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
