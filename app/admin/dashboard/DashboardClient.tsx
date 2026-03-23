"use client";

import React, { useRef, useState } from "react";
import {
  Users,
  DollarSign,
  Stethoscope,
  Clock,
  UserCheck,
  UserX,
  Database,
  Download,
  Upload,
  Loader2,
  ShieldCheck
} from "lucide-react";
import { updateUserStatus } from "@/app/actions/user";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ColorType = "teal" | "emerald" | "amber" | "rose" | "blue" | "green" | "purple" | "orange";

const getIconColor = (color: ColorType) => {
  const colors: Record<ColorType, string> = {
    teal: "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20",
    emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20",
    amber: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20",
    rose: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20",
    blue: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
    green: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20",
    purple: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20",
    orange: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20",
  };
  return colors[color] || colors.teal;
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
  const [isRestoring, setIsRestoring] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    window.location.href = "/api/backup/export";
  };

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!confirm(`Are you sure you want to restore the database from ${file.name}? This will overwrite existing data.`)) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsRestoring(true);
    const formData = new FormData();
    formData.append("backup", file);

    try {
      const response = await fetch("/api/backup/restore", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Database restored successfully!");
        window.location.reload();
      } else {
        const error = await response.text();
        alert(`Restore failed: ${error}`);
      }
    } catch (error) {
      alert(`Restore failed: ${error}`);
    } finally {
      setIsRestoring(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const statCards = [
    {
      label: "Total Patients",
      value: stats.patientCount.toLocaleString(),
      icon: Users,
      color: "teal" as ColorType,
    },
    {
      label: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "emerald" as ColorType,
    },
    {
      label: "Active Doctors",
      value: stats.doctorCount.toLocaleString(),
      icon: Stethoscope,
      color: "amber" as ColorType,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-teal-100 dark:bg-teal-900/30 rounded-xl text-teal-700 dark:text-teal-400">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight">Admin Overview</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">Welcome back, monitor your clinic's performance today.</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => (
          <Card key={idx} className="border-none shadow-sm ring-1 ring-slate-200 dark:ring-zinc-800 bg-white/50 hover:bg-white dark:bg-zinc-900/50 dark:hover:bg-zinc-900 transition-colors">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <p className="text-sm font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                  {stat.label}
                </p>
                <div className={`p-2 rounded-lg ${getIconColor(stat.color)}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* User Approval Queue */}
        <Card className="lg:col-span-2 border-none shadow-sm ring-1 ring-slate-200 dark:ring-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserCheck className="text-teal-600 dark:text-teal-400 w-5 h-5" />
              Pending Approvals
            </CardTitle>
            <div className="flex items-center gap-4">
              <span className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-amber-200 dark:border-amber-800/50">
                {pendingUsers.length} Required
              </span>
              <a href="/admin/users" className="text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 hover:underline">
                View All →
              </a>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {pendingUsers.length === 0 ? (
              <div className="py-12 text-center rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
                <Users className="w-10 h-10 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
                <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium">No pending registrations</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingUsers.map((user) => (
                  <div key={user.UserID} className="group bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-teal-200 dark:hover:border-teal-900/50 p-4 rounded-xl transition-all flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getIconColor(user.Role === 'DOCTOR' ? 'teal' : user.Role === 'PATIENT' ? 'emerald' : user.Role === 'RECEPTIONIST' ? 'purple' : 'amber')}`}>
                        {user.Name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-semibold text-sm text-slate-900 dark:text-zinc-100">{user.Name}</p>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${getIconColor(user.Role === 'DOCTOR' ? 'teal' : user.Role === 'PATIENT' ? 'emerald' : user.Role === 'RECEPTIONIST' ? 'purple' : 'amber')}`}>
                            {user.Role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">{user.Email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="default" onClick={() => updateUserStatus(user.UserID, "APPROVED")} className="h-8 w-8 px-0" title="Approve">
                        <UserCheck className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="outline" onClick={() => updateUserStatus(user.UserID, "REJECTED")} className="h-8 w-8 px-0 border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20" title="Reject">
                        <UserX className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Side Column: Recent Activity */}
        <Card className="border-none shadow-sm ring-1 ring-slate-200 dark:ring-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="text-teal-600 dark:text-teal-400 w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-6">
              {recentActivities.map((activity, idx) => (
                <div key={idx} className="flex gap-4 relative">
                  {idx !== recentActivities.length - 1 && (
                    <div className="absolute left-[7px] top-6 bottom-[-24px] w-[2px] bg-slate-100 dark:bg-zinc-800" />
                  )}
                  <div className="w-4 h-4 rounded-full bg-teal-100 dark:bg-teal-900/50 border-2 border-teal-600 dark:border-teal-500 mt-0.5 flex-shrink-0 z-10" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100 leading-none">{activity.name}</p>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1.5">{activity.action}</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Maintenance Section */}
      <Card className="mt-8 overflow-hidden border-none shadow-md bg-slate-900 dark:bg-zinc-950 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-600/10 dark:bg-teal-900/20 blur-[80px] rounded-full -mr-32 -mt-32" />
        <CardContent className="p-8 sm:p-10 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                <Database className="w-8 h-8 text-teal-400" />
              </div>
              <div>
                <p className="text-xl font-bold tracking-tight text-white mb-1">System Maintenance</p>
                <p className="text-sm text-slate-400 font-medium max-w-sm">
                  Perform database snapshots or restore your system from a previous backup point securely.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 w-full md:w-auto">
              <button
                onClick={handleExport}
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold text-sm text-white transition-all flex items-center gap-2 backdrop-blur-md group active:scale-95"
              >
                <Download className="w-4 h-4 text-teal-400 group-hover:translate-y-[1px] transition-transform" />
                Export Data
              </button>
              <div className="relative">
                <input
                  type="file"
                  accept=".sql"
                  onChange={handleRestore}
                  className="hidden"
                  ref={fileInputRef}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isRestoring}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-800/50 rounded-xl font-semibold text-sm text-white transition-all flex items-center gap-2 shadow-lg shadow-teal-900/20 active:scale-95 border border-transparent"
                >
                  {isRestoring ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 transition-transform" />
                  )}
                  {isRestoring ? "Restoring..." : "Import Fix"}
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}