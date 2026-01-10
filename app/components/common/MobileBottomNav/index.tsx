"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FaCalendarCheck, FaHistory } from "react-icons/fa";
import { MdTune, MdEmergency, MdDashboard } from "react-icons/md";

const actions = [
    {
        title: "Home",
        icon: MdDashboard,
        link: "/dashboard"
    },
    {
        title: "Book",
        icon: FaCalendarCheck,
        link: "/book-service"
    },
    {
        title: "GearUp",
        icon: MdTune,
        link: "/gear-up"
    },
    {
        title: "Emergency",
        icon: MdEmergency,
        link: "/emergency-assistance"
    },
    {
        title: "History",
        icon: FaHistory,
        link: "/service-history"
    }
];

import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/app/store/slices/authSlice";

const MobileBottomNav: React.FC = () => {
    const pathname = usePathname();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    // Hide if not on main screens or if needed (optional)
    // For now showing on all screens as requested

    if (!isAuthenticated) return null;

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-vehicle-card-bg border-t border-vehicle-card-border z-50 pb-safe rounded-t-2xl mx-2 mb-2 shadow-lg">
            <div className="flex justify-around items-center h-16">
                {actions.map((action, idx) => {
                    const isActive = pathname === action.link || (action.link === "/dashboard" && pathname === "/");
                    const Icon = action.icon;
                    return (
                        <Link
                            key={idx}
                            href={action.link}
                            className="flex flex-col items-center justify-center w-full h-full gap-1 active:bg-white/5 group"
                        >
                            <Icon
                                className={cn(
                                    "w-6 h-6 transition-colors",
                                    isActive ? "text-green-500" : "text-gray-400 group-hover:text-gray-200"
                                )}
                            />
                            <span className={cn(
                                "text-[10px] font-medium leading-none",
                                isActive ? "text-green-500" : "text-gray-400 group-hover:text-gray-200"
                            )}>
                                {action.title}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
};

export default MobileBottomNav;
