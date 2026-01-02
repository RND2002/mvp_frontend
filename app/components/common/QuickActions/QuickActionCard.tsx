"use client";

import React from "react";
import InlineSVG from "@/app/components/common/InlineSVG";
import Link from "next/link";

interface QuickActionCardProps {
    title: string;
    icon: string;
    link: string;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ title, icon, link }) => {
    return (
        <Link
            href={link}
            className="flex flex-col items-center gap-2 group cursor-pointer w-full"
        >
            {/* Icon Container (Squircle) */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-[20px] sm:rounded-[24px] flex items-center justify-center shadow-sm border border-gray-100 transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1 group-hover:bg-white overflow-hidden p-3">
                <InlineSVG
                    src={icon}
                    className="w-8 h-8 sm:w-10 sm:h-10 text-[var(--color-nav-blue)] transition-transform duration-300 group-hover:scale-110"
                />
            </div>

            {/* Title */}
            <span className="text-[11px] sm:text-xs font-semibold text-center text-white leading-tight group-hover:text-[var(--color-primary)] transition-colors">
                {title}
            </span>
        </Link>
    );
};

export default QuickActionCard;
