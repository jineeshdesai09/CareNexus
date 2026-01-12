"use client";

import React, { useState } from "react";
import Link from "next/link";

import {
  Heart,
  Users,
  Shield,
  Activity,
  Package,
  FlaskConical,
  FileCheck,
  Phone,
  Mail,
  Stethoscope,
  DollarSign,
} from "lucide-react";

type ColorType = "blue" | "green" | "purple" | "orange" | "teal" | "indigo";

interface StatItem {
  icon: React.ComponentType<any>;
  label: string;
  value: string;
  color: ColorType;
}

interface FeatureItem {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  color: ColorType;
}

export default function OPDLandingPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const stats: StatItem[] = [
    { icon: Activity, label: "Total Patients", value: "1,284", color: "blue" },
    { icon: Users, label: "Staff Members", value: "287", color: "green" },
    { icon: Shield, label: "Uptime", value: "98.5%", color: "purple" },
    { icon: Heart, label: "Support", value: "24/7", color: "orange" },
  ];

  const features: FeatureItem[] = [
    {
      icon: Heart,
      title: "Patient Management",
      description:
        "Complete patient records, admission, and discharge tracking",
      color: "blue",
    },
    {
      icon: Activity,
      title: "Diagnosis Type",
      description:
        "Comprehensive diagnosis categorization and medical condition tracking",
      color: "green",
    },
    {
      icon: DollarSign,
      title: "Billing & Finance",
      description: "Automated billing with integrated service charges",
      color: "purple",
    },
    {
      icon: Shield,
      title: "Treatment Type",
      description: "Treatment plans, procedures, and therapy management",
      color: "orange",
    },
    {
      icon: Stethoscope,
      title: "Doctor Functionality",
      description:
        "Doctor profiles, schedules, and patient consultation management",
      color: "teal",
    },
    {
      icon: FileCheck,
      title: "Document Control",
      description: "Secure document tracking with approval workflows",
      color: "indigo",
    },
  ];

  const getColorClasses = (color: ColorType): string => {
    const colors: Record<ColorType, string> = {
      blue: "bg-blue-50 text-blue-600",
      green: "bg-green-50 text-green-600",
      purple: "bg-purple-50 text-purple-600",
      orange: "bg-orange-50 text-orange-600",
      teal: "bg-teal-50 text-teal-600",
      indigo: "bg-indigo-50 text-indigo-600",
    };

    return colors[color];
  };

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

          {/* Replaced Button with Link */}
          <Link
            href="/login"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              TechCare Hospital Management Platform
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Smart, integrated solutions for modern hospitals. Streamline
              operations, enhance patient care, and optimize resource
              management.
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all hover:shadow-lg flex items-center gap-2">
                Get Started
                <span>→</span>
              </button>
              <button className="px-8 py-3 bg-white text-gray-900 rounded-lg font-medium border-2 border-gray-200 hover:border-gray-300 transition-all">
                Learn More
              </button>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-xl ${getColorClasses(
                    stat.color
                  )} transition-transform hover:scale-105`}
                >
                  <stat.icon className="w-8 h-8 mb-3" />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm opacity-80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Healthcare Solutions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to manage a modern hospital efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                className="bg-white border-2 border-gray-100 rounded-2xl p-8 transition-all hover:shadow-xl hover:border-gray-200 hover:-translate-y-1"
              >
                <div
                  className={`w-14 h-14 rounded-xl ${getColorClasses(
                    feature.color
                  )} flex items-center justify-center mb-6 transition-transform ${
                    hoveredCard === idx ? "scale-110" : ""
                  }`}
                >
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" fill="white" />
                </div>
                <span className="text-xl font-semibold">TechCare</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Leading hospital management platform trusted by healthcare
                providers worldwide.
              </p>
            </div>

            {/* Contact Us */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-400">
                  <Phone className="w-5 h-5" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <Mail className="w-5 h-5" />
                  <span>support@techcare.health</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>© 2024 TechCare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
