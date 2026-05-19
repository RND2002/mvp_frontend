"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Settings, Droplets, BatteryFull, Activity, Circle, ShieldCheck } from "lucide-react"
import { VehicleHealthReport } from "@/app/beService/health-service"
import { cn } from "@/lib/utils"

import { SystemParameters } from "./SystemParameters"

interface HealthSummaryProps {
    data: VehicleHealthReport;
    onClick?: () => void;
    registrationNumber?: string;
    vehicleName?: string;
}

export const HealthSummary = ({ data, onClick, registrationNumber, vehicleName }: HealthSummaryProps) => {
    const health = data.health;
    const overall = health.overall;
    const systems = health.systems || {};

    const score = overall?.score || 0;
    const status = overall?.status || "INSUFFICIENT DATA";

    const getCardStyles = (score: number) => {
        if (score <= 33) {
            return {
                bg: "bg-theme-red/5",
                border: "border-theme-red/15",
                glow: "bg-theme-red/5 group-hover:bg-theme-red/10",
                pillBg: "bg-theme-red/10",
                pillBorder: "border-theme-red/20",
                pillText: "text-theme-red",
                statusLabel: "CRITICAL"
            };
        } else if (score <= 66) {
            return {
                bg: "bg-theme-yellow/5",
                border: "border-theme-yellow/15",
                glow: "bg-theme-yellow/5 group-hover:bg-theme-yellow/10",
                pillBg: "bg-theme-yellow/10",
                pillBorder: "border-theme-yellow/20",
                pillText: "text-theme-yellow",
                statusLabel: "AVERAGE"
            };
        } else {
            return {
                bg: "bg-theme-green/5",
                border: "border-theme-green/15",
                glow: "bg-theme-green/5 group-hover:bg-theme-green/10",
                pillBg: "bg-theme-green/10",
                pillBorder: "border-theme-green/20",
                pillText: "text-theme-green",
                statusLabel: "EXCELLENT"
            };
        }
    };

    const config = getCardStyles(score);

    return (
        <div className="space-y-4 cursor-pointer" onClick={onClick}>
            {/* Main Health Card */}
            <Card className={cn(
                "overflow-hidden relative rounded-3xl group shadow-2xl transition-all duration-300 border",
                config.bg,
                config.border
            )}>
                <CardContent className="p-7">
                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <p className="text-theme-amber text-[10px] font-black uppercase tracking-[0.2em] mb-2">Vehicle Health</p>
                            <h3 className="text-3xl font-bold text-text-primary leading-tight tracking-tight max-w-[200px] mb-1">{vehicleName?.toUpperCase() || "Your Vehicle"}</h3>
                            <p className="text-text-secondary text-sm font-bold tracking-widest opacity-80">{registrationNumber || ""}</p>
                        </div>
                        <div className={cn(
                            "rounded-full px-4 py-1.5 text-[10px] font-black tracking-widest h-fit uppercase border",
                            config.pillBg,
                            config.pillText,
                            config.pillBorder
                        )}>
                            {config.statusLabel}
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
                                    className="stroke-slate-200 dark:stroke-slate-800"
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
                                        <stop offset="0%" stopColor="#EF4444" />
                                        <stop offset="50%" stopColor="#F59E0B" />
                                        <stop offset="100%" stopColor="#22C55E" />
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
                            <span className="text-5xl font-black text-text-primary tracking-tighter drop-shadow-sm">{score}%</span>
                            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mt-1">Health Score</span>
                        </div>
                    </div>

                    {/* Legend Section */}
                    <div className="flex justify-between items-center mt-10 px-2 pt-6 border-t border-border-default">
                        <div className="text-center flex-1">
                            <p className="text-[10px] text-text-secondary font-bold mb-1.5 opacity-60">0-33</p>
                            <p className="text-[10px] text-theme-red font-black uppercase tracking-widest">Bad</p>
                        </div>
                        <div className="h-6 w-px bg-border-default"></div>
                        <div className="text-center flex-1">
                            <p className="text-[10px] text-text-secondary font-bold mb-1.5 opacity-60">34-66</p>
                            <p className="text-[10px] text-theme-yellow font-black uppercase tracking-widest">Average</p>
                        </div>
                        <div className="h-6 w-px bg-border-default"></div>
                        <div className="text-center flex-1">
                            <p className="text-[10px] text-text-secondary font-bold mb-1.5 opacity-60">67-100</p>
                            <p className="text-[10px] text-theme-green font-black uppercase tracking-widest">Good</p>
                        </div>
                    </div>
                </CardContent>

                {/* Subtle Glow Effects */}
                <div className={cn("absolute top-0 right-0 w-32 h-32 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none transition-colors", config.glow)}></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[80px] -ml-16 -mb-16 pointer-events-none"></div>
            </Card>

            {/* System Parameters List */}
            <SystemParameters
                className={config.border}
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
