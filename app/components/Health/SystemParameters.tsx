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
        "flex items-center justify-between py-3 px-5 group transition-colors hover:bg-bg-tertiary/20",
        !isLast && "border-b border-border-default/45"
    )}>
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-bg-tertiary rounded-xl flex items-center justify-center border border-border-default group-hover:border-theme-green/30 transition-colors">
                <div className="text-theme-green/80">
                    {React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
                        className: "w-4.5 h-4.5"
                    })}
                </div>
            </div>
            <div>
                <h4 className="text-text-primary font-semibold text-sm leading-tight tracking-tight">{label}</h4>
                <p className={cn("text-[9px] font-bold uppercase tracking-[0.15em] mt-0.5 opacity-70", statusColor)}>
                    {status}
                </p>
            </div>
        </div>
        <div className="text-right">
            <span className="text-text-primary font-bold text-lg tracking-tight">{value}</span>
        </div>
    </div>
)

interface SystemParametersProps {
    systems: Record<string, { score: number; status: string }>;
    className?: string;
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

export const SystemParameters = ({ systems, className }: SystemParametersProps) => {
    const systemEntries = Object.entries(systems);

    return (
        <div className={cn("bg-bg-secondary border rounded-3xl overflow-hidden", className)}>
            <div className="px-5 py-3.5 border-b border-border-subtle">
                <h3 className="text-text-secondary text-[10px] font-black uppercase tracking-[0.2em]">
                    System Parameters
                </h3>
            </div>

            <div className="divide-y divide-border-subtle">
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
                        <p className="text-text-secondary text-sm font-medium">No system parameters available</p>
                    </div>
                )}
            </div>
        </div>
    )
}
