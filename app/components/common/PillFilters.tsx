"use client"

import React from "react"
import { cn } from "@/lib/utils"

export interface FilterItem {
    id: string;
    label: string;
}

interface PillFiltersProps {
    items: FilterItem[];
    selectedId: string;
    onSelect: (id: string) => void;
    className?: string;
}

export const PillFilters = ({ items, selectedId, onSelect, className }: PillFiltersProps) => {
    return (
        <div className={className}>
            <div className="flex gap-3 overflow-x-auto scrollbar-none px-4 py-4 -mx-4 -my-4">
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onSelect(item.id)}
                        className={cn(
                            "px-5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200",
                            selectedId === item.id
                                ? "bg-theme-green text-white shadow-lg shadow-theme-green/25 scale-105"
                                : "bg-[#F5EDFC] text-[#475569] border border-transparent hover:border-[#6B2FA0]/50 hover:text-[#6B2FA0]"
                        )}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    )
}
