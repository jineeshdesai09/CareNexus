import { Heart, ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) {
    if (user.Role === "ADMIN") redirect("/admin/dashboard");
    if (user.Role === "DOCTOR") redirect("/doctor/dashboard");
    if (user.Role === "RECEPTIONIST") redirect("/reception/dashboard");
    if (user.Role === "PATIENT") redirect("/patient/dashboard");
    redirect("/"); // Fallback
  }

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
              <div className="rounded bg-red-100 text-red-800 px-4 py-2 text-sm mb-4 font-medium">
                Invalid email or password
              </div>
            )}

            {params?.error === "role" && (
              <div className="rounded bg-yellow-100 text-yellow-800 px-4 py-2 text-sm mb-4 font-medium">
                Selected role does not match your account
              </div>
            )}

            {params?.error === "pending" && (
              <div className="rounded bg-blue-100 text-blue-800 px-4 py-2 text-sm mb-4 font-medium">
                Your account is pending admin approval. Please try again later.
              </div>
            )}

            {/* Registration success message */}
            {(await searchParams).message === "registered" && (
              <div className="rounded bg-green-100 text-green-800 px-4 py-2 text-sm mb-4 font-medium">
                Registration successful! Please wait for admin approval.
              </div>
            )}

            <LoginForm />

            {/* Demo Access */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 space-y-3">
              <p className="text-sm font-bold text-gray-800 border-b pb-1 border-blue-200">
                Support / Demo Credentials:
              </p>

              <div className="text-[10px] text-gray-600 space-y-2">
                <p>Email: <span className="font-semibold text-blue-600">admin@hospital.com</span> (Pass: admin123)</p>
                <p>Email: <span className="font-semibold text-blue-600">reception@hospital.com</span> (Pass: reception123)</p>
                <p>Email: <span className="font-semibold text-blue-600">sarah.jenkins@hospital.com</span> (Pass: doctor123)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
