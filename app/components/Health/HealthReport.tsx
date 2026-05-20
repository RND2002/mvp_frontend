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
        if (score === null) return "var(--theme-gray)"
        if (score >= 67) return "var(--theme-green)"
        if (score >= 34) return "#EAB308" // Yellow
        return "var(--theme-red)"
    }

    const overallColor = getOverallColor(overallScore)

    return (
        <div className="space-y-4">
            {/* Overall Condition Card */}
            <div className="bg-primaryCard border border-secondary-theme rounded-2xl p-4 relative overflow-hidden shadow-xl shadow-black/20">
                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <h4 className="text-gray-400 text-xs uppercase tracking-widest mb-2">Overall Condition</h4>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold" style={{ color: overallColor }}>{overallScore !== null ? `${overallScore}%` : "N/A"}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span
                            className="bg-theme-green/20 text-theme-green text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-theme-green/30"
                            style={{ color: overallColor, borderColor: `${overallColor}50`, backgroundColor: `${overallColor}10` }}
                        >
                            {overallStatus.replace(/_/g, " ")}
                        </span>
                        {lastServiceDate && (
                            <p className="text-[10px] text-gray-500 mt-2 italic">Last Service: {new Date(lastServiceDate).toLocaleDateString()}</p>
                        )}
                        {health.confidence && (
                            <p className="text-[10px] text-gray-500 mt-1 uppercase">Confidence: {health.confidence}</p>
                        )}
                    </div>
                </div>
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-theme-green/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            </div>

            {/* Health Systems */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-theme-green">
                    <Activity className="w-5 h-5" />
                    <h3 className="font-bold uppercase tracking-wider text-sm">Vital Systems</h3>
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
                    <div className="flex items-center gap-2 text-theme-green">
                        <CircleDot className="w-5 h-5" />
                        <h3 className="font-bold uppercase tracking-wider text-sm">AI Recommendations</h3>
                    </div>
                    <div className="space-y-3">
                        {recommendations.map((rec, index) => (
                            <div key={index} className="bg-primaryCard border border-secondary-theme rounded-xl p-4 flex gap-3 items-start">
                                <Zap className="w-5 h-5 text-theme-green shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-gray-300 text-sm leading-relaxed">{rec.message}</p>
                                    <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">
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
                    <button className="w-full cursor-pointer bg-theme-green text-white font-bold h-14 rounded-xl text-lg hover:bg-theme-green/90 transition-all flex items-center justify-center gap-2">
                        Book Service Now <Zap className="w-5 h-5" />
                    </button>
                </Link>
            </div>
        </div>
    )
}
