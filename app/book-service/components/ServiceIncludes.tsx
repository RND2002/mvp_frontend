"use client"

import React from "react"
import { CheckCircle2, Sparkles, Zap, ShieldCheck, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface ServiceItem {
    id: string;
    title: string;
    description?: string;
}

interface ServiceIncludesProps {
    items: ServiceItem[];
    isLoading?: boolean;
}

export const ServiceIncludes = ({ items, isLoading }: ServiceIncludesProps) => {
    if (isLoading) {
        return (
            <div className="bg-vehicle-card-bg border border-vehicle-card-border rounded-3xl p-8 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-green"></div>
            </div>
        )
    }

    return (
        <div className="bg-vehicle-card-bg border border-vehicle-card-border rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <h3 className="text-white font-black text-lg mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-theme-green" />
                Service Includes
            </h3>

            {items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((item, idx) => (
                        <div
                            key={item.id || idx}
                            className="flex items-start gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-theme-green/20 transition-all group/item"
                        >
                            <div className="w-10 h-10 rounded-xl bg-theme-green/10 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-theme-green/20 transition-colors">
                                <CheckCircle2 className="w-5 h-5 text-theme-green" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm leading-tight mb-1">{item.title}</h4>
                                {item.description && (
                                    <p className="text-gray-500 text-xs font-medium">{item.description}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Settings className="w-8 h-8 text-gray-600" />
                    </div>
                    <p className="text-gray-400 font-medium italic text-sm">
                        No specific items listed for this service.
                    </p>
                    <p className="text-gray-600 text-xs mt-2 max-w-[200px]">
                        Our experts will perform a comprehensive inspection upon arrival.
                    </p>
                </div>
            )}

            {/* Subtle decorative background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-theme-green/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-theme-green/10 transition-colors"></div>
        </div>
    )
}
