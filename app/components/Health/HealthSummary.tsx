"use client"

import { Card, CardContent } from "@/components/ui/card"
import { VehicleHealthReport } from "@/app/beService/health-service"

import { SystemParameters } from "./SystemParameters"

interface HealthSummaryProps {
    data: VehicleHealthReport;
    onClick?: () => void;
    registrationNumber?: string;
    vehicleName?: string;
}

export const HealthSummary = ({ data, onClick, registrationNumber, vehicleName }: HealthSummaryProps) => {
    const health = data.health;
    const systems = health.components || health.systems || {};

    const score = health.overall_score ?? health.overall?.score ?? 0;
    const status = health.overall_status || health.overall?.status || "INSUFFICIENT DATA";

    return (
        <div className="space-y-4 cursor-pointer" onClick={onClick}>
            {/* Main Health Card */}
            <Card className="bg-primaryCard border-secondary-theme overflow-hidden relative rounded-3xl group shadow-2xl shadow-black/40">
                <CardContent className="p-7">
                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <p className="text-theme-green text-[10px] font-black uppercase tracking-[0.2em] mb-2">Vehicle Health</p>
                            <h3 className="text-3xl font-bold text-white leading-tight tracking-tight max-w-[200px] mb-1">{vehicleName?.toUpperCase() || "Your Vehicle"}</h3>
                            <p className="text-gray-500 text-sm font-bold tracking-widest opacity-80">{registrationNumber || ""}</p>
                        </div>
                        <div className="bg-theme-green/10 text-theme-green border border-theme-green/30 rounded-full px-4 py-1.5 text-[10px] font-black tracking-widest h-fit uppercase">
                            {status === "OPTIMAL" ? "EXCELLENT" : status.replace(/_/g, " ")}
                        </div>
                    </div>

                    {/* Gauge Section */}
                    <div className="relative flex flex-col items-center justify-center py-6 mb-4">
                        <div className="relative w-64 h-32 overflow-hidden">
                            {/* Semi-circle background */}
                            <svg className="w-64 h-64 -rotate-180" viewBox="0 0 100 100">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="44"
                                    fill="none"
                                    stroke="#1E293B"
                                    strokeWidth="12"
                                    strokeDasharray="138.23 276.46"
                                    strokeLinecap="round"
                                />
                                {/* Progress semi-circle */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="44"
                                    fill="none"
                                    stroke="url(#gauge-gradient)"
                                    strokeWidth="12"
                                    strokeDasharray={`${(score / 100) * 138.23} 276.46`}
                                    className="transition-all duration-1000 ease-out"
                                    strokeLinecap="round"
                                />
                                <defs>
                                    <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#00DF82" />
                                        <stop offset="100%" stopColor="#00DF82" />
                                    </linearGradient>
                                    <filter id="glow">
                                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                        <feMerge>
                                            <feMergeNode in="coloredBlur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>
                            </svg>
                        </div>

                        {/* Gauge Label Overlay */}
                        <div className="absolute top-[62%] flex flex-col items-center">
                            <span className="text-5xl font-black text-white tracking-tighter drop-shadow-sm">{score}%</span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1">Health Score</span>
                        </div>
                    </div>

                    {/* Legend Section */}
                    <div className="flex justify-between items-center mt-10 px-2 pt-6 border-t border-white/5">
                        <div className="text-center flex-1">
                            <p className="text-[10px] text-gray-500 font-bold mb-1.5 opacity-60">0-33</p>
                            <p className="text-[10px] text-theme-red font-black uppercase tracking-widest">Bad</p>
                        </div>
                        <div className="h-6 w-px bg-white/5"></div>
                        <div className="text-center flex-1">
                            <p className="text-[10px] text-gray-500 font-bold mb-1.5 opacity-60">34-66</p>
                            <p className="text-[10px] text-theme-yellow font-black uppercase tracking-widest">Average</p>
                        </div>
                        <div className="h-6 w-px bg-white/5"></div>
                        <div className="text-center flex-1">
                            <p className="text-[10px] text-gray-500 font-bold mb-1.5 opacity-60">67-100</p>
                            <p className="text-[10px] text-theme-green font-black uppercase tracking-widest">Good</p>
                        </div>
                    </div>
                </CardContent>

                {/* Subtle Glow Effects */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-theme-green/5 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none group-hover:bg-theme-green/10 transition-colors"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[80px] -ml-16 -mb-16 pointer-events-none"></div>
            </Card>

            {/* System Parameters List */}
            <SystemParameters
                systems={Object.keys(systems).length > 0 ? systems : {
                    engine: { score: 98, status: "OPTIMAL" },
                    engine_oil: { score: 96, status: "OPTIMAL" },
                    tyre_pressure: { score: 32, status: "OPTIMAL" },
                    battery: { score: 12.4, status: "CHARGING" }
                }}
            />
        </div>
    )
}
