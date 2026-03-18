import { prisma } from "@/lib/prisma";
import { Activity, Clock, UserCheck, Stethoscope, ArrowRight } from "lucide-react";
import RefreshTrigger from "./RefreshTrigger";

export const runtime = "nodejs";
export const revalidate = 5; // Faster refresh for public monitor (5 seconds)

export default async function LiveStatusPage() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // Strict Chronological Fetch: Seconds Matter
    const activeOpds = await prisma.oPD.findMany({
        where: {
            OPDDateTime: { gte: startOfDay },
            Status: { in: ["WAITING", "IN_CONSULTATION"] }
        },
        orderBy: [
            { IsEmergency: "desc" }, // Emergencies still float to top
            { OPDDateTime: "asc" }   // Then strictly by booking time
        ],
        include: {
            Patient: { select: { PatientName: true } },
            Doctor: { select: { FirstName: true, LastName: true, Department: true } }
        }
    });

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-6 md:p-10 font-sans selection:bg-blue-500">
            <RefreshTrigger />
            
            {/* Minimal High-Impact Header */}
            <div className="flex justify-between items-end mb-12 border-b border-slate-800 pb-8">
                <div>
                    <h1 className="text-5xl font-black tracking-tighter flex items-center gap-4 text-blue-500">
                        <Activity className="w-10 h-10 animate-pulse" />
                        PATIENT QUEUE
                    </h1>
                    <p className="text-slate-500 mt-2 font-black uppercase tracking-[0.2em] text-xs">
                        Hospital Live Monitoring System • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </p>
                </div>
                <div className="hidden md:block text-right">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Total Waiting</p>
                    <p className="text-4xl font-black text-white">{activeOpds.length}</p>
                </div>
            </div>

            {/* Single Stream Layout */}
            <div className="max-w-5xl mx-auto space-y-6">
                {activeOpds.length === 0 ? (
                    <div className="py-32 text-center space-y-6 bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-800">
                        <Clock className="w-16 h-16 text-slate-700 mx-auto" />
                        <p className="text-2xl font-bold text-slate-500 italic">No patients currently in queue.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {activeOpds.map((opd, index) => {
                            const isCalling = opd.Status === "IN_CONSULTATION";
                            
                            return (
                                <div 
                                    key={opd.OPDID} 
                                    className={`relative overflow-hidden rounded-[2rem] transition-all duration-500 border-2 ${
                                        isCalling 
                                        ? "bg-blue-600 border-blue-400 shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)] scale-105 z-10 py-8 px-10" 
                                        : "bg-slate-900 border-slate-800 py-6 px-8 opacity-80"
                                    }`}
                                >
                                    {/* Position Indicator */}
                                    {!isCalling && (
                                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-slate-800" />
                                    )}

                                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                        {/* Token Area */}
                                        <div className="flex items-center gap-8 w-full md:w-auto">
                                            <div className="flex flex-col items-center">
                                                <span className={`text-[10px] font-black uppercase tracking-[0.3em] mb-1 ${isCalling ? "text-blue-200" : "text-slate-500"}`}>
                                                    Token
                                                </span>
                                                <h2 className={`text-6xl font-black tabular-nums leading-none ${isCalling ? "text-white" : "text-slate-300"}`}>
                                                    {opd.TokenNo}
                                                </h2>
                                            </div>
                                            
                                            <div className="h-16 w-px bg-current opacity-10 hidden md:block" />

                                            <div>
                                                <h3 className={`text-3xl font-black tracking-tight ${isCalling ? "text-white" : "text-slate-400"}`}>
                                                    {opd.Patient.PatientName}
                                                </h3>
                                                <div className="flex items-center gap-3 mt-1">
                                                    {opd.IsEmergency && (
                                                        <span className="bg-red-500 text-[10px] font-black px-2 py-0.5 rounded text-white uppercase animate-bounce">Emergency</span>
                                                    )}
                                                    <p className={`text-sm font-bold uppercase tracking-wider ${isCalling ? "text-blue-100" : "text-slate-600"}`}>
                                                        {isCalling ? "Proceed to Cabin" : "In Waiting List"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Doctor Area */}
                                        <div className={`flex items-center gap-4 px-6 py-3 rounded-2xl ${isCalling ? "bg-white/10" : "bg-slate-800/50"} w-full md:w-auto`}>
                                            <div className={`p-2 rounded-xl ${isCalling ? "bg-white text-blue-600" : "bg-slate-700 text-slate-400"}`}>
                                                <Stethoscope className="w-5 h-5" />
                                            </div>
                                            <div className="text-left">
                                                <p className={`text-[10px] font-black uppercase tracking-widest ${isCalling ? "text-blue-200" : "text-slate-500"}`}>Consulting With</p>
                                                <p className="font-bold text-lg">Dr. {opd.Doctor.LastName}</p>
                                            </div>
                                            {isCalling && (
                                                <ArrowRight className="w-6 h-6 text-white animate-out slide-out-to-right-full repeat-infinite duration-1000 ml-4 hidden md:block" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Clean Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#0f172a]/80 backdrop-blur-md border-t border-slate-800 p-4">
                <div className="flex justify-center gap-12 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                    <span>Silence Required</span>
                    <span className="text-blue-500">•</span>
                    <span>Tokens Issued Sequentially</span>
                    <span className="text-blue-500">•</span>
                    <span>Keep Mobile on Silent</span>
                </div>
            </div>
        </div>
    );
}
