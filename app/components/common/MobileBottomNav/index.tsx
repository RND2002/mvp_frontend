"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FaCalendarCheck, FaHistory } from "react-icons/fa";
import { MdTune, MdEmergency, MdDashboard, MdShoppingCart } from "react-icons/md";

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
        title: "Cart",
        icon: MdShoppingCart,
        link: "/cart"
    },
    {
        title: "GearUp",
        icon: MdTune,
        link: "/gear-up"
    },
    {
        title: "History",
        icon: FaHistory,
        link: "/service-history"
    }
];

import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/app/store/slices/authSlice";
import { RootState } from "@/app/store/store";

const MobileBottomNav: React.FC = () => {
    const { detailedReportOpen } = useSelector((state: RootState) => state.ui);
    const pathname = usePathname();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    // Hide if not on main screens or if needed (optional)
    // For now showing on all screens as requested

    if (!isAuthenticated) return null;

    return (
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] bg-vehicle-card-bg/80 backdrop-blur-xl border border-white/10 z-50 rounded-full shadow-2xl shadow-black/40 px-2 overflow-hidden">
            <div className="flex justify-around items-center h-16">
                {actions.map((action, idx) => {
                    const isActive = pathname === action.link || (action.link === "/dashboard" && pathname === "/");
                    const Icon = action.icon;
                    return (
                        <Link
                            key={idx}
                            href={action.link}
                            className="flex flex-col items-center justify-center w-full h-full gap-1 active:bg-white/10 transition-colors group"
                        >
                            <Icon
                                className={cn(
                                    "w-6 h-6 transition-colors",
                                    isActive ? "text-theme-green" : "text-gray-400 group-hover:text-gray-200"
                                )}
                            />
                            <span className={cn(
                                "text-[10px] font-medium leading-none",
                                isActive ? "text-theme-green" : "text-gray-400 group-hover:text-gray-200"
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
