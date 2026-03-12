"use client";

import React from "react";
import {
  Users,
  Bed,
  DollarSign,
  Stethoscope,
  User,
  Clock,
  ShieldCheck,
  UserCheck,
  UserX,
} from "lucide-react";
import { updateUserStatus } from "@/app/actions/user";

type ColorType = "blue" | "green" | "purple" | "orange";

const getIconColor = (color: ColorType) => {
  const colors: Record<ColorType, string> = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
  };
  return colors[color];
};

interface DashboardClientProps {
  userName: string;
  stats: {
    patientCount: number;
    doctorCount: number;
    totalRevenue: number;
  };
  pendingUsers: any[];
  recentActivities: any[];
}

export default function DashboardClient({
  userName,
  stats,
  pendingUsers,
  recentActivities,
}: DashboardClientProps) {
  const statCards = [
    {
      label: "Total Patients",
      value: stats.patientCount.toLocaleString(),
      icon: Users,
      color: "blue" as ColorType,
    },
    {
      label: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "green" as ColorType,
    },
    {
      label: "Active Doctors",
      value: stats.doctorCount.toLocaleString(),
      icon: Stethoscope,
      color: "orange" as ColorType,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <ShieldCheck className="text-blue-600 w-8 h-8" />
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{userName}</p>
                <p className="text-xs text-gray-600 uppercase tracking-wider font-bold">Administrator</p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {statCards.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between mb-4">
                  <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <stat.icon
                    className={`w-6 h-6 ${getIconColor(stat.color)}`}
                  />
                </div>
                <p className="text-3xl font-black text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Approval Queue */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <UserCheck className="text-blue-600 w-6 h-6" />
                    Pending Approvals
                  </h2>
                  <div className="flex items-center gap-4">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                      {pendingUsers.length} Action Required
                    </span>
                    <a 
                      href="/admin/users" 
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                    >
                      View All Users →
                    </a>
                  </div>
                </div>

                {pendingUsers.length === 0 ? (
                  <div className="py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No pending user registrations</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {pendingUsers.map((user) => (
                      <div key={user.UserID} className="group bg-gray-50 hover:bg-white border border-transparent hover:border-blue-100 p-5 rounded-xl transition-all flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                              user.Role === 'DOCTOR' ? 'bg-blue-100 text-blue-700' : 
                              user.Role === 'PATIENT' ? 'bg-green-100 text-green-700' :
                              user.Role === 'RECEPTIONIST' ? 'bg-purple-100 text-purple-700' :
                              user.Role === 'PHARMACIST' ? 'bg-orange-100 text-orange-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                            {user.Name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold text-gray-900">{user.Name}</p>
                              <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${
                                user.Role === "DOCTOR" ? "bg-blue-100 text-blue-700" : 
                                user.Role === "PATIENT" ? "bg-green-100 text-green-700" :
                                user.Role === "RECEPTIONIST" ? "bg-purple-100 text-purple-700" :
                                user.Role === "PHARMACIST" ? "bg-orange-100 text-orange-700" :
                                "bg-amber-100 text-amber-700"
                              }`}>
                                {user.Role}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">{user.Email}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateUserStatus(user.UserID, "APPROVED")}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors shadow-sm"
                            title="Approve User"
                          >
                            <UserCheck className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => updateUserStatus(user.UserID, "REJECTED")}
                            className="bg-white hover:bg-red-50 text-red-600 border border-gray-200 hover:border-red-200 p-2 rounded-lg transition-colors shadow-sm"
                            title="Reject/Delete Account"
                          >
                            <UserX className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Side Column: Recent Activity */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-full">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Clock className="text-blue-600 w-6 h-6" />
                  Recent Activity
                </h2>
                <div className="space-y-6">
                  {recentActivities.map((activity, idx) => (
                    <div key={idx} className="flex gap-4 relative">
                      {idx !== recentActivities.length - 1 && (
                        <div className="absolute left-2 top-8 bottom-[-24px] w-0.5 bg-gray-100" />
                      )}
                      <div className="w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{activity.name}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{activity.action}</p>
                        <p className="text-[10px] text-gray-400 mt-1 font-medium">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div >
    </div >
  );
}