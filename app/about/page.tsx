import { Heart, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "@/app/components/ui/ThemeToggle";

export const runtime = "nodejs";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 dark:from-zinc-950 dark:to-zinc-900">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-950 shadow-sm border-b border-transparent dark:border-zinc-800 transition-colors">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-blue-600 dark:bg-blue-500 p-2.5 rounded-xl text-white shadow-lg shadow-blue-600/20 dark:shadow-none">
              <Heart className="w-6 h-6" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-zinc-50">
              Care Nexus
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/login"
              className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-400 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* About Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight animate-fade-in">
              Transforming Healthcare Management
            </h1>
            <p className="text-xl text-gray-600 dark:text-zinc-400 mb-8 leading-relaxed">
              Care Nexus was founded on a simple principle: healthcare providers should spend their time focusing on patients, not administrative overhead.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="bg-white dark:bg-zinc-900 py-20 border-y border-slate-200 dark:border-zinc-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
                <p className="text-lg text-gray-600 dark:text-zinc-400 leading-relaxed mb-6">
                  We are building the operating system for modern clinics and hospitals. By creating intuitive, fast, and connected digital tools, we empower medical professionals to deliver better care, reduce wait times, and drastically improve the patient experience.
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">✓</div>
                    <p className="text-gray-700 dark:text-zinc-300">Streamline daily operations across all departments.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">✓</div>
                    <p className="text-gray-700 dark:text-zinc-300">Ensure patient data is secure and universally accessible to authorized staff.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">✓</div>
                    <p className="text-gray-700 dark:text-zinc-300">Bridge the communication gap between doctors, reception, and patients.</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-3xl bg-gradient-to-tr from-blue-100 to-teal-50 dark:from-zinc-800 dark:to-zinc-900 border border-slate-200 dark:border-zinc-800 p-8 flex items-center justify-center shadow-xl">
                  <Heart className="w-32 h-32 text-blue-500 drop-shadow-lg" fill="currentColor" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section at the bottom */}
        <section id="contact" className="max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-16 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>

            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Get in Touch</h2>
              <p className="text-zinc-400 text-lg mb-10">
                Have questions about implementing Care Nexus in your facility? Our team is ready to help you transform your healthcare management.
              </p>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-400">Email Us</h4>
                    <p className="text-lg font-medium">carenexus8@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-teal-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-400">Call Us</h4>
                    <p className="text-lg font-medium">+91 88495 68502</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:col-span-2">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-400">Visit Us</h4>
                    <p className="text-lg font-medium">Rajkot</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 text-white py-12 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-zinc-500 text-sm">
            <p>© 2024 Care Nexus. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
              <Link href="/about#contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
