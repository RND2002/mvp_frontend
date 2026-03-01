"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { VroomButton } from "../../components/common/VroomButton"
import Link from "next/link"

interface ServiceCardProps {
    name: string;
    category: string;
    description: string;
    icon: LucideIcon;
    color: string;
    iconColor: string;
    onClick: () => void;
}

export const ServiceCard = ({
    name,
    category,
    description,
    icon: Icon,
    color,
    iconColor,
    onClick
}: ServiceCardProps) => {
    return (
        <div onClick={onClick}>
            {/* Mobile Layout: Simple Horizontal (Original) */}
            <div className="md:hidden bg-vehicle-card-bg border border-vehicle-card-border rounded-3xl p-5 flex items-center justify-between group hover:border-theme-green/30 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", color)}>
                        <Icon className={cn("w-7 h-7", iconColor)} />
                    </div>
                    <div>
                        <span className="bg-white/5 text-[9px] font-black text-gray-400 px-2 py-0.5 rounded uppercase tracking-widest mb-1.5 inline-block">
                            {category}
                        </span>
                        <h3 className="text-lg font-black text-white leading-none mb-1">{name}</h3>
                        <p className="text-gray-500 text-xs font-medium">{description}</p>
                    </div>
                </div>
                <Link href="/book-service" className="block">
                    <VroomButton
                        size="sm"
                        className="h-10 px-5 rounded-xl text-xs active:scale-95 transition-transform"
                    >
                        Book Now
                    </VroomButton>
                </Link>
            </div>

            {/* Desktop Layout: Premium Vertical Grid Card */}
            <div className="hidden md:flex flex-col bg-vehicle-card-bg border border-vehicle-card-border rounded-4xl p-6 gap-6 group hover:border-theme-green/40 transition-all hover:scale-[1.03] duration-300 shadow-2xl shadow-black/50 cursor-pointer h-full min-h-[280px]">
                <div className="flex justify-between items-start">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-white/5", color)}>
                        <Icon className={cn("w-7 h-7", iconColor)} />
                    </div>
                    <span className="bg-white/5 text-[10px] font-black text-gray-500 px-3 py-1.5 rounded-lg uppercase tracking-[0.2em]">
                        {category}
                    </span>
                </div>

                <div className="flex-1 flex flex-col">
                    <h3 className="text-2xl font-black text-white leading-tight uppercase tracking-tight mb-2 group-hover:text-theme-green transition-colors">{name}</h3>
                    <p className="text-gray-400 text-sm font-medium leading-relaxed mb-6 flex-1 line-clamp-3">{description}</p>

                    <VroomButton
                        size="sm"
                        className="w-full h-12 rounded-xl text-xs uppercase font-black tracking-widest bg-theme-green text-black border-none shadow-[0_4px_20px_rgba(34,197,94,0.2)]"
                    >
                        Book Now
                    </VroomButton>
                </div>
            </div>
        </div>
    )
}
