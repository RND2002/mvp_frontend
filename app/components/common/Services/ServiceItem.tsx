import React from "react";
import { LucideIcon } from "lucide-react";

interface ServiceItemProps {
    icon: LucideIcon;
    label: string;
    color: string; // Background color class for the circle
    iconClassName?: string; // Color class for the icon itself
    onClick?: () => void;
}

export const ServiceItem: React.FC<ServiceItemProps> = ({
    icon: Icon,
    label,
    color,
    iconClassName = "text-white",
    onClick,
}) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-3 md:gap-4 bg-white p-2 md:p-3 rounded-2xl md:rounded-full shadow-sm border border-slate-100 hover:shadow-md transition-all active:scale-95 dark:bg-slate-800 dark:border-slate-700 w-full group"
        >
            <div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 ${color} transition-transform group-hover:scale-110`}
            >
                <Icon className={`w-5 h-5 md:w-6 md:h-6 ${iconClassName}`} />
            </div>
            <span className="text-sm md:text-base font-medium text-slate-700 dark:text-slate-200 text-left line-clamp-2 leading-tight">
                {label}
            </span>
        </button>
    );
};
