"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Settings, Droplets, BatteryFull, Activity, Circle, ShieldCheck } from "lucide-react"
import { VehicleHealthReport } from "@/app/beService/health-service"

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

    const getStatusColorClass = (s: string) => {
        const lower = s.toLowerCase();
        if (lower === 'healthy' || lower === 'optimal' || lower === 'good' || lower === 'excellent') return 'text-theme-green';
        if (lower === 'medium' || lower === 'average' || lower === 'fair') return 'text-orange-500';
        if (lower === 'bad' || lower === 'critical' || lower === 'poor') return 'text-red-500';
        return 'text-gray-400';
    }

    return (
        <div className="space-y-4 cursor-pointer" onClick={onClick}>
            {/* Main Health Card */}
            <Card className="bg-vehicle-card-bg border-vehicle-card-border overflow-hidden relative">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <p className="text-theme-green text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Vehicle Health</p>
                            <h3 className="text-2xl font-bold text-white leading-tight">{vehicleName || "Your Vehicle"}</h3>
                            <p className="text-gray-500 text-xs font-medium tracking-wider">{registrationNumber || ""}</p>
                        </div>
                        <div className="bg-green-500/10 text-theme-green border border-green-500/20 rounded-full px-3 py-1 text-[10px] font-bold tracking-widest h-fit uppercase">
                            {status}
                        </div>
                    </div>

                    {/* Gauge Section */}
                    <div className="relative flex flex-col items-center justify-center py-4">
                        <div className="relative w-48 h-24 overflow-hidden">
                            {/* Semi-circle background */}
                            <svg className="w-48 h-48 -rotate-180" viewBox="0 0 100 100">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    strokeDasharray="141.37 282.74"
                                    className="text-gray-800"
                                />
                                {/* Progress semi-circle */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    strokeDasharray={`${(score / 100) * 141.37} 282.74`}
                                    className="text-theme-green"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>

                        <div className="absolute top-[60%] flex flex-col items-center">
                            <span className="text-5xl font-black text-white">{score}%</span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Health Score</span>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex justify-between items-center mt-12 px-4">
                        <div className="text-center">
                            <p className="text-[10px] text-gray-500 font-bold mb-1">0-33</p>
                            <p className="text-[10px] text-red-500 font-black uppercase tracking-wider">Bad</p>
                        </div>
                        <div className="h-4 w-px bg-gray-800"></div>
                        <div className="text-center">
                            <p className="text-[10px] text-gray-500 font-bold mb-1">34-66</p>
                            <p className="text-[10px] text-yellow-500 font-black uppercase tracking-wider">Average</p>
                        </div>
                        <div className="h-4 w-px bg-gray-800"></div>
                        <div className="text-center">
                            <p className="text-[10px] text-gray-500 font-bold mb-1">67-100</p>
                            <p className="text-[10px] text-theme-green font-black uppercase tracking-wider">Good</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Sub Status Cards */}
            <div className="grid grid-cols-2 gap-4">
                {Object.entries(systems).map(([key, system]) => (
                    <StatusSmallCard
                        key={key}
                        icon={getSystemIcon(key)}
                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                        status={system.status}
                        percentage={`${system.score}%`}
                        statusColor={getStatusColorClass(system.status)}
                    />
                ))}
                {Object.keys(systems).length === 0 && (
                    <>
                        <StatusSmallCard
                            icon={<Activity className="w-5 h-5 text-gray-500" />}
                            label="Engine"
                            status="PENDING"
                            percentage="--"
                            statusColor="text-gray-500"
                        />
                        <StatusSmallCard
                            icon={<Settings className="w-5 h-5 text-gray-500" />}
                            label="Maintenance"
                            status="PENDING"
                            percentage="--"
                            statusColor="text-gray-500"
                        />
                    </>
                )}
            </div>
        </div>
    )
}

const getSystemIcon = (key: string) => {
    const k = key.toLowerCase();
    if (k.includes('engine') || k.includes('drive')) return <Activity className="w-5 h-5 text-theme-green" />;
    if (k.includes('brake')) return <Circle className="w-5 h-5 text-theme-green" />;
    if (k.includes('battery') || k.includes('electric')) return <BatteryFull className="w-5 h-5 text-theme-green" />;
    if (k.includes('tyre') || k.includes('tire')) return <Settings className="w-5 h-5 text-theme-green" />;
    return <ShieldCheck className="w-5 h-5 text-theme-green" />;
}

const StatusSmallCard = ({ icon, label, status, percentage, statusColor }: any) => (
    <div className="bg-vehicle-card-bg border border-vehicle-card-border rounded-2xl p-4 flex flex-col justify-between h-32">
        <div className="flex justify-between items-start">
            <div className="bg-gray-800/50 p-2 rounded-xl">
                {icon}
            </div>
            <span className={`text-[10px] font-black ${statusColor}`}>{percentage}</span>
        </div>
        <div>
            <h4 className="text-white font-bold text-sm mb-0.5">{label}</h4>
            <p className={`text-[10px] font-black uppercase tracking-wider opacity-60`}>{status}</p>
        </div>
    </div>
)
