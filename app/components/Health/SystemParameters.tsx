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
        "flex items-center justify-between py-3 px-5 group transition-colors hover:bg-white/5",
        !isLast && "border-b border-white/5"
    )}>
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-theme-green/30 transition-colors">
                <div className="text-theme-green/80">
                    {React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
                        className: "w-4.5 h-4.5"
                    })}
                </div>
            </div>
            <div>
                <h4 className="text-white font-semibold text-sm leading-tight tracking-tight">{label}</h4>
                <p className={cn("text-[9px] font-bold uppercase tracking-[0.15em] mt-0.5 opacity-70", statusColor)}>
                    {status}
                </p>
            </div>
        </div>
        <div className="text-right">
            <span className="text-white font-bold text-lg tracking-tight">{value}</span>
        </div>
    </div>
)

interface SystemParametersProps {
    systems: Record<string, { score: number; status: string }>;
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
    if (lower === 'optimal' || lower === 'healthy' || lower === 'charging') return 'text-theme-green';
    if (lower === 'fair' || lower === 'medium') return 'text-theme-yellow';
    return 'text-theme-red';
}

export const SystemParameters = ({ systems }: SystemParametersProps) => {
    const systemEntries = Object.entries(systems);

    return (
        <div className="bg-primaryCard border border-secondary-theme rounded-3xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-white/5">
                <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                    System Parameters
                </h3>
            </div>

            <div className="divide-y divide-white/5">
                {systemEntries.length > 0 ? (
                    systemEntries.map(([key, system], index) => (
                        <SystemParameterItem
                            key={key}
                            icon={getSystemIcon(key)}
                            label={key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            status={system.status}
                            value={String(system.score) + (key.toLowerCase().includes('battery') ? 'V' : key.toLowerCase().includes('pressure') ? ' PSI' : '%')}
                            statusColor={getStatusColorClass(system.status)}
                            isLast={index === systemEntries.length - 1}
                        />
                    ))
                ) : (
                    <div className="p-8 text-center">
                        <p className="text-gray-500 text-sm font-medium">No system parameters available</p>
                    </div>
                )}
            </div>
        </div>
    )
}
