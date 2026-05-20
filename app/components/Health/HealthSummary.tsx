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
            <Card className="bg-white border border-[#E4E7EC] overflow-hidden relative rounded-3xl group shadow-sm">
                <CardContent className="p-5">
                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-5">
                        <div>
                            <p className="text-[#6B2FA0] text-[9px] font-black uppercase tracking-[0.2em] mb-1">Vehicle Health</p>
                            <h3 className="text-xl font-bold text-[#0F172A] leading-tight tracking-tight max-w-[180px] mb-0.5">{vehicleName?.toUpperCase() || "Your Vehicle"}</h3>
                            <p className="text-[#94A3B8] text-xs font-bold tracking-widest">{registrationNumber || ""}</p>
                        </div>
                        <div className="bg-[#DCFCE7] text-[#6B2FA0] border border-[#DCFCE7] rounded-full px-3 py-1 text-[9px] font-black tracking-widest h-fit uppercase">
                            {status === "OPTIMAL" ? "EXCELLENT" : status.replace(/_/g, " ")}
                        </div>
                    </div>

                    {/* Gauge Section */}
                    <div className="relative flex flex-col items-center justify-center py-2 mb-2">
                        <div className="relative w-48 h-24 overflow-hidden">
                            {/* Semi-circle background */}
                            <svg className="w-48 h-48 -rotate-180" viewBox="0 0 100 100">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="44"
                                    fill="none"
                                    stroke="#E4E7EC"
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
                                        <stop offset="0%" stopColor="#6B2FA0" />
                                        <stop offset="100%" stopColor="#6B2FA0" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>

                        {/* Gauge Label Overlay */}
                        <div className="absolute top-[55%] flex flex-col items-center">
                            <span className="text-3xl font-black text-[#0F172A] tracking-tighter">{score}%</span>
                            <span className="text-[9px] font-bold text-[#475569] uppercase tracking-[0.2em] mt-0.5">Health Score</span>
                        </div>
                    </div>

                    {/* Legend Section */}
                    <div className="flex justify-between items-center mt-4 px-2 pt-4 border-t border-[#E4E7EC]">
                        <div className="text-center flex-1">
                            <p className="text-[9px] text-[#94A3B8] font-bold mb-1 opacity-60">0-33</p>
                            <p className="text-[9px] text-[#DC2626] font-bold uppercase tracking-widest">Bad</p>
                        </div>
                        <div className="h-5 w-px bg-[#E4E7EC]"></div>
                        <div className="text-center flex-1">
                            <p className="text-[9px] text-[#94A3B8] font-bold mb-1 opacity-60">34-66</p>
                            <p className="text-[9px] text-[#D97706] font-bold uppercase tracking-widest">Average</p>
                        </div>
                        <div className="h-5 w-px bg-[#E4E7EC]"></div>
                        <div className="text-center flex-1">
                            <p className="text-[9px] text-[#94A3B8] font-bold mb-1 opacity-60">67-100</p>
                            <p className="text-[9px] text-[#6B2FA0] font-bold uppercase tracking-widest">Good</p>
                        </div>
                    </div>
                </CardContent>
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
