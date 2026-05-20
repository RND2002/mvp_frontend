"use client"

import { VehicleHealthReport } from "@/app/beService/health-service"
import { HealthMetricCard } from "./HealthMetricCard"
import { Activity, CircleDot, Zap } from "lucide-react"
import { useSelector } from "react-redux"
import { RootState } from "@/app/store/store"
import Link from "next/link"

interface HealthReportProps {
    data: VehicleHealthReport;
}

export const HealthReport = ({ data }: HealthReportProps) => {
    const { selectedVehicle } = useSelector((state: RootState) => state.vehicle)
    const health = data.health;
    const systems = health.components || health.systems || {};
    const recommendations = health.recommendations || [];
    const overallScore = health.overall_score ?? health.overall?.score ?? null;
    const overallStatus = health.overall_status || health.overall?.status || "pending";
    const lastServiceDate = Object.values(systems)
        .map((system) => system.last_serviced_date)
        .filter(Boolean)
        .sort()[0];

    const getOverallColor = (score: number | null) => {
        if (score === null) return "#64748B"
        if (score >= 67) return "#6B2FA0"
        if (score >= 34) return "#D97706" // Yellow
        return "#DC2626"
    }

    const overallColor = getOverallColor(overallScore)

    return (
        <div className="space-y-4">
            {/* Overall Condition Card */}
            <div className="bg-white border border-[#E4E7EC] rounded-2xl p-4 relative overflow-hidden shadow-sm">
                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <h4 className="text-[#475569] text-xs uppercase tracking-widest mb-2 font-bold">Overall Condition</h4>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold" style={{ color: overallColor }}>{overallScore !== null ? `${overallScore}%` : "N/A"}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span
                            className="bg-[#DCFCE7] text-[#6B2FA0] text-[10px] font-bold uppercase px-3 py-1 rounded-full border"
                            style={{ color: overallColor, borderColor: `${overallColor}50`, backgroundColor: `${overallColor}10` }}
                        >
                            {overallStatus.replace(/_/g, " ")}
                        </span>
                        {lastServiceDate && (
                            <p className="text-[10px] text-[#94A3B8] mt-2 italic">Last Service: {new Date(lastServiceDate).toLocaleDateString()}</p>
                        )}
                        {health.confidence && (
                            <p className="text-[10px] text-[#94A3B8] mt-1 uppercase">Confidence: {health.confidence}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Health Systems */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-[#6B2FA0]">
                    <Activity className="w-5 h-5" />
                    <h3 className="font-bold uppercase tracking-wider text-sm text-[#0F172A]">Vital Systems</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(systems).map(([key, system]) => (
                        <HealthMetricCard
                            key={key}
                            label={key.charAt(0).toUpperCase() + key.slice(1)}
                            value={`${system.score}%`}
                            status={system.status}
                            percentage={system.score}
                            subLabel={
                                system.due_in_km != null
                                    ? `${Math.round(system.due_in_km)} km left`
                                    : system.due_in_days != null
                                        ? `${Math.round(system.due_in_days)} days left`
                                        : system.basis
                            }
                        />
                    ))}
                </div>
            </section>

            {/* Recommendations */}
            {recommendations.length > 0 && (
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-[#6B2FA0]">
                        <CircleDot className="w-5 h-5" />
                        <h3 className="font-bold uppercase tracking-wider text-sm text-[#0F172A]">AI Recommendations</h3>
                    </div>
                    <div className="space-y-3">
                        {recommendations.map((rec, index) => (
                            <div key={index} className="bg-[#F8F9FB] border border-[#E4E7EC] rounded-xl p-4 flex gap-3 items-start">
                                <Zap className="w-5 h-5 text-[#6B2FA0] shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[#0F172A] text-sm leading-relaxed font-semibold">{rec.message}</p>
                                    <p className="text-[10px] uppercase tracking-widest text-[#94A3B8] mt-1">
                                        {rec.component.replace(/_/g, " ")} • {rec.urgency}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="pt-6">
                <Link href="/book-service" className="block">
                    <button className="w-full cursor-pointer bg-[#6B2FA0] text-white font-bold h-14 rounded-xl text-lg hover:bg-[#6B2FA0] transition-all flex items-center justify-center gap-2 shadow-none">
                        Book Service Now <Zap className="w-5 h-5 animate-pulse" />
                    </button>
                </Link>
            </div>
        </div>
    )
}
