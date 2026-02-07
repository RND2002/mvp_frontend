"use client"

import { VehicleHealthReport } from "@/app/beService/health-service"
import { HealthMetricCard } from "./HealthMetricCard"
import { Activity, Circle, CircleDot, Zap, ChevronLeft } from "lucide-react"
import { FUEL_TYPE } from "@/app/beService/vehicle-service"
import { useSelector } from "react-redux"
import { RootState } from "@/app/store/store"

interface HealthReportProps {
    data: VehicleHealthReport;
}

export const HealthReport = ({ data }: HealthReportProps) => {
    const { selectedVehicle } = useSelector((state: RootState) => state.vehicle)

    const getOverallColor = (score: number) => {
        if (score >= 67) return "var(--theme-green)"
        if (score >= 34) return "#FFFFFF"
        return "var(--theme-red)"
    }

    const overallColor = getOverallColor(data.overall_score)

    return (
        <div className="space-y-6">
            {/* Overall Condition Card */}
            <div className="bg-vehicle-card-bg border border-vehicle-card-border rounded-2xl p-6 relative overflow-hidden shadow-xl shadow-black/20">
                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <h4 className="text-gray-400 text-xs uppercase tracking-widest mb-2">Overall Condition</h4>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold" style={{ color: overallColor }}>{data.overall_score}%</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span
                            className="bg-theme-green/20 text-theme-green text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-theme-green/30"
                            style={{ color: overallColor, borderColor: `${overallColor}50`, backgroundColor: `${overallColor}10` }}
                        >
                            {data.overall_status}
                        </span>
                        <p className="text-[10px] text-gray-500 mt-2 italic">Updated {data.last_updated}</p>
                    </div>
                </div>
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-theme-green/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            </div>

            {/* Engine & Powertrain */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-theme-green">
                    <Activity className="w-5 h-5" />
                    <h3 className="font-bold uppercase tracking-wider text-sm">Engine & Powertrain</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <HealthMetricCard
                        label="Temperature"
                        value={`${data.engine.temperature.value}°C`}
                        status={data.engine.temperature.status}
                        percentage={data.engine.temperature.percentage}
                        subLabel="Optimal Range: 80-105°C"
                    />
                    <HealthMetricCard
                        label="Engine Oil Level"
                        value={data.engine.oil_level.value}
                        status={data.engine.oil_level.status}
                        percentage={data.engine.oil_level.percentage}
                        subLabel="Scheduled Top-up in 450 km"
                    />
                </div>
            </section>

            {/* Tyres & Traction */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-theme-green">
                    <Circle className="w-5 h-5" />
                    <h3 className="font-bold uppercase tracking-wider text-sm">Tyres & Traction</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <HealthMetricCard
                        label="Front"
                        value={`${data.tyres.front_psi.value} PSI`}
                        status={data.tyres.front_psi.status}
                        showProgress={false}
                    />
                    <HealthMetricCard
                        label="Rear"
                        value={`${data.tyres.rear_psi.value} PSI`}
                        status={data.tyres.rear_psi.status}
                        showProgress={false}
                    />
                </div>
                <HealthMetricCard
                    label="Tread Depth"
                    value={`${data.tyres.tread_depth.value} mm`}
                    percentage={data.tyres.tread_depth.percentage}
                />
            </section>

            {/* Braking System */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-theme-green">
                    <CircleDot className="w-5 h-5" />
                    <h3 className="font-bold uppercase tracking-wider text-sm">Braking System</h3>
                </div>
                <HealthMetricCard
                    label="Brake Pad Wear"
                    value={`${data.braking.brake_pad_wear.value}% Life`}
                    status={data.braking.brake_pad_wear.status}
                    percentage={data.braking.brake_pad_wear.percentage}
                />
                <div className="bg-vehicle-card-bg border border-vehicle-card-border rounded-xl p-4 flex justify-between items-center">
                    <h4 className="text-gray-400 text-xs uppercase tracking-wider">Brake Fluid Status</h4>
                    <span className="text-theme-green font-bold uppercase text-sm">{data.braking.brake_fluid_status.value}</span>
                </div>
            </section>

            {/* Electricals */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-theme-green">
                    <Zap className="w-5 h-5" />
                    <h3 className="font-bold uppercase tracking-wider text-sm">Electricals</h3>
                </div>
                <div className="bg-vehicle-card-bg border border-vehicle-card-border rounded-xl p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-theme-green/20 p-2 rounded-lg">
                            <Zap className="w-4 h-4 text-theme-green" />
                        </div>
                        <div>
                            <h4 className="text-white text-[13px] font-bold">Battery Voltage</h4>
                            <p className="text-[10px] text-gray-500 uppercase">Normal Range Detected</p>
                        </div>
                    </div>
                    <span className="text-white font-bold text-lg">{data.electricals.battery_voltage.value}V</span>
                </div>
            </section>

            <div className="pt-6">
                <button className="w-full bg-theme-green text-white font-bold h-14 rounded-xl text-lg hover:bg-theme-green/90 transition-all flex items-center justify-center gap-2">
                    Book Service Now <Zap className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}
