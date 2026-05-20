"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Activity, BatteryFull, Circle, Droplets, LucideIcon, Settings, ShieldCheck } from "lucide-react"

interface SystemParameterItemProps {
    icon: React.ReactNode;
    label: string;
    status: string;
    value: string;
    statusColor: string;
    isLast?: boolean;
}

const SystemParameterItem = ({ icon, label, status, value, statusColor, isLast }: SystemParameterItemProps) => (
    <div className={cn(
        "flex items-center justify-between py-2 px-4 group transition-colors hover:bg-[#F8F9FB]",
        !isLast && "border-b border-[#E4E7EC]"
    )}>
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#F8F9FB] rounded-lg flex items-center justify-center border border-[#E4E7EC] group-hover:border-[#6B2FA0]/50 transition-colors">
                <div className="text-[#6B2FA0]">
                    {React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
                        className: "w-3.5 h-3.5"
                    })}
                </div>
            </div>
            <div>
                <h4 className="text-[#0F172A] font-semibold text-xs leading-tight tracking-tight">{label}</h4>
                <p className={cn("text-[8px] font-bold uppercase tracking-[0.15em] mt-0.5 opacity-90", statusColor)}>
                    {status}
                </p>
            </div>
        </div>
        <div className="text-right">
            <span className="text-[#0F172A] font-bold text-sm tracking-tight">{value}</span>
        </div>
    </div>
)

interface SystemParametersProps {
    systems: Record<string, { score: number; status: string; due_in_km?: number | null; due_in_days?: number | null }>;
}

const getSystemIcon = (key: string) => {
    const k = key.toLowerCase();
    if (k.includes('engine_oil')) return <Droplets className="w-5 h-5" />;
    if (k.includes('engine') || k.includes('drive')) return <Activity className="w-5 h-5" />;
    if (k.includes('brake')) return <Circle className="w-5 h-5" />;
    if (k.includes('battery') || k.includes('electric')) return <BatteryFull className="w-5 h-5" />;
    if (k.includes('tyre') || k.includes('tire')) return <Settings className="w-5 h-5" />;
    return <ShieldCheck className="w-5 h-5" />;
}

const getStatusColorClass = (s: string) => {
    const lower = s.toLowerCase();
    if (lower === 'optimal' || lower === 'healthy' || lower === 'charging' || lower === 'good') return 'text-[#6B2FA0]';
    if (lower === 'fair' || lower === 'medium' || lower === 'attention' || lower === 'service_due') return 'text-[#D97706]';
    return 'text-[#DC2626]';
}

export const SystemParameters = ({ systems }: SystemParametersProps) => {
    const systemEntries = Object.entries(systems);

    return (
        <div className="bg-white border border-[#E4E7EC] rounded-3xl overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-[#E4E7EC]">
                <h3 className="text-[#475569] text-[10px] font-black uppercase tracking-[0.2em]">
                    System Parameters
                </h3>
            </div>

            <div className="divide-y divide-[#E4E7EC]">
                {systemEntries.length > 0 ? (
                    systemEntries.map(([key, system], index) => (
                        <SystemParameterItem
                            key={key}
                            icon={getSystemIcon(key)}
                            label={key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            status={system.status.replace(/_/g, " ")}
                            value={`${system.score}%`}
                            statusColor={getStatusColorClass(system.status)}
                            isLast={index === systemEntries.length - 1}
                        />
                    ))
                ) : (
                    <div className="p-8 text-center">
                        <p className="text-[#94A3B8] text-sm font-medium">No system parameters available</p>
                    </div>
                )}
            </div>
        </div>
    )
}
