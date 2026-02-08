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
        <div
            className="bg-vehicle-card-bg border border-vehicle-card-border rounded-3xl p-5 flex items-center justify-between group hover:border-theme-green/30 transition-colors cursor-pointer"
            onClick={onClick}
        >
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
    )
}
