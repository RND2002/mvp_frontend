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
        <div className={cn("flex gap-3 overflow-x-auto scrollbar-none pb-2", className)}>
            {items.map((item) => (
                <button
                    key={item.id}
                    onClick={() => onSelect(item.id)}
                    className={cn(
                        "px-5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200",
                        selectedId === item.id
                            ? "bg-theme-green text-theme-white shadow-lg shadow-theme-green/25 scale-105"
                            : "bg-secondary-theme text-zinc-300 border border-transparent hover:border-theme-green/50 hover:text-theme-white"
                    )}
                >
                    {item.label}
                </button>
            ))}
        </div>
    )
}
