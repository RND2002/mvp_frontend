"use client";

import React from "react";
import Link from "next/link";

interface QuickActionCardProps {
    title: string;
    icon: React.ElementType;
    link: string;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ title, icon: Icon, link }) => {
    return (
        <Link
            href={link}
            className="flex flex-col items-center gap-2 group cursor-pointer w-full"
        >
            {/* Icon Container (Squircle) */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-[20px] sm:rounded-[24px] flex items-center justify-center shadow-sm border border-gray-100 transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1 group-hover:bg-white overflow-hidden p-3">
                <Icon
                    className="w-8 h-8 sm:w-10 sm:h-10 text-black transition-transform duration-300 group-hover:scale-110 group-hover:text-primaryText group-active:text-primaryText"
                />
            </div>

            {/* Title */}
            <span className="text-[11px] sm:text-xs font-semibold text-center text-[#94A3B8] leading-tight group-hover:text-[var(--color-primary)] transition-colors">
                {title}
            </span>
        </Link>
    );
};

export default QuickActionCard;
