"use client";

import React, { useState } from "react";
import {
  Users,
  Bed,
  Package,
  ShoppingCart,
  DollarSign,
  Pill,
  Stethoscope,
  Receipt,
  ClipboardList,
  Activity,
  TestTube,
  LayoutDashboard,
  User,
  Clock,
  AlertCircle,
  Info,
} from "lucide-react";

type ColorType = "blue" | "green" | "purple" | "orange";
type NotificationType = "error" | "info";

const getIconColor = (color: ColorType) => {
  const colors: Record<ColorType, string> = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
  };
  return colors[color];
};

const getNotificationIcon = (type: NotificationType) =>
  type === "error" ? AlertCircle : Info;

const getNotificationColor = (type: NotificationType) =>
  type === "error" ? "text-red-600" : "text-blue-600";

export default function DashboardClient() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const stats = [
    {
      label: "Total Patients",
      value: "1,284",
      icon: Users,
      color: "blue" as ColorType,
    },
    {
      label: "Active Doctors",
      value: "43",
      icon: Stethoscope,
      color: "orange" as ColorType,
    },
    {
      label: "Active Admissions",
      value: "156",
      icon: Bed,
      color: "green" as ColorType,
    },
  ];

  const notifications: {
    type: NotificationType;
    message: string;
    time: string;
  }[] = [
    {
      type: "error",
      message: "Low stock alert: Surgical gloves below minimum threshold",
      time: "5 min ago",
    },
    {
      type: "info",
      message: "12 patients pending discharge today",
      time: "15 min ago",
    },
    {
      type: "error",
      message: "Expired medicines: 5 items need disposal",
      time: "1 hour ago",
    },
    {
      type: "info",
      message: "Payroll processing scheduled for tomorrow",
      time: "2 hours ago",
    },
    {
      type: "error",
      message: "Room 304 requires maintenance",
      time: "3 hours ago",
    },
  ];

  const recentActivities = [
    { name: "John Smith", action: "Admitted to Ward A", time: "10:30 AM" },
    { name: "Emma Davis", action: "Lab test completed", time: "11:15 AM" },
    { name: "Michael Brown", action: "Discharged", time: "12:00 PM" },
    {
      name: "Sarah Wilson",
      action: "OPD appointment scheduled",
      time: "1:30 PM",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              TechCare Hospital Management System
            </h1>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">demo</p>
                <p className="text-xs text-gray-600">Administrator</p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border shadow-sm"
              >
                <div className="flex justify-between mb-4">
                  <p className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </p>
                  <stat.icon
                    className={`w-6 h-6 ${getIconColor(stat.color)}`}
                  />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Notifications + Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Notifications */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border shadow-sm">
              <h2 className="text-lg font-bold mb-4">Notifications & Alerts</h2>

              {notifications.map((n, idx) => {
                const Icon = getNotificationIcon(n.type);
                return (
                  <div
                    key={idx}
                    className="flex gap-3 border-b pb-4 mb-4 last:border-none"
                  >
                    <Icon
                      className={`w-5 h-5 ${getNotificationColor(n.type)} mt-1`}
                    />
                    <div>
                      <p className="text-gray-900 text-sm">{n.message}</p>
                      <p className="text-gray-500 text-xs mt-1">{n.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Activities */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h2 className="text-lg font-bold mb-4">Recent Activities</h2>
              {recentActivities.map((activity, idx) => (
                <div key={idx} className="flex gap-3 mb-4">
                  <Clock className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {activity.name}
                    </p>
                    <p className="text-xs text-gray-600">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-blue-600 font-semibold mb-2">
                Today's Appointments
              </h3>
              <p className="text-4xl font-bold text-gray-900 mb-2">42</p>
              <p className="text-sm text-gray-600">18 pending, 24 completed</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-green-600 font-semibold mb-2">
                Available Beds
              </h3>
              <p className="text-4xl font-bold text-gray-900 mb-2">28</p>
              <p className="text-sm text-gray-600">Out of 184 total beds</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-purple-600 font-semibold mb-2">
                Staff on Duty
              </h3>
              <p className="text-4xl font-bold text-gray-900 mb-2">87</p>
              <p className="text-sm text-gray-600">32 doctors, 55 nurses</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}