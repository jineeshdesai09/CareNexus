"use client";

import { useState, useCallback, useEffect } from "react";
import { searchPatients } from "@/app/actions/patient";
import { Search, User, Phone, Hash, Calendar, ArrowRight, UserPlus } from "lucide-react";
import Link from "next/link";

interface Patient {
    PatientID: number;
    PatientName: string;
    PatientNo: number;
    MobileNo: string;
    Age: number;
    Gender: string;
}

export default function PatientDirectory() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Patient[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const performSearch = useCallback(async (q: string) => {
        setIsSearching(true);
        try {
            const data = await searchPatients(q || "");
            setResults(data as Patient[]);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setIsSearching(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            performSearch(query);
        }, 300);
        return () => clearTimeout(timer);
    }, [query, performSearch]);

    return (
        <div className="max-w-6xl mx-auto p-4 flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Patient Directory</h1>
                    <p className="text-gray-500 mt-1">Search and manage patient medical records</p>
                </div>
                <Link
                    href="/reception/patients/create"
                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-md active:scale-95"
                >
                    <UserPlus className="w-5 h-5" />
                    New Patient
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                    <div className="relative max-w-2xl">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="block w-full pl-12 pr-4 py-4 border-gray-200 rounded-2xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                            placeholder="Search by name, mobile, or patient ID..."
                        />
                        {isSearching && (
                            <div className="absolute inset-y-0 right-4 flex items-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-xs uppercase tracking-widest font-bold">
                                <th className="px-6 py-4">ID & Name</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Age / Gender</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {results.length > 0 ? (
                                results.map((p) => (
                                    <tr key={p.PatientID} className="hover:bg-blue-50/30 transition group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                                                    {p.PatientName[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 group-hover:text-blue-700 transition">{p.PatientName}</p>
                                                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                                        <Hash className="w-3 h-3" /> {p.PatientNo}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                <span className="font-medium">{p.MobileNo}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {p.Age}Y / {p.Gender}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/reception/opd/create?patientId=${p.PatientID}`}
                                                    className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
                                                >
                                                    New OPD <ArrowRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="p-4 bg-gray-50 rounded-full">
                                                <Search className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <p className="text-gray-400 font-medium">
                                                {query.length < 2 ? "Start typing to search patients..." : "No patients found matching your search."}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
