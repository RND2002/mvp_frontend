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
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] bg-bg-secondary/95 backdrop-blur-[16px] border border-border-subtle z-50 rounded-full shadow-2xl shadow-black/40 px-2 overflow-hidden">
            <div className="flex justify-around items-center h-16">
                {actions.map((action, idx) => {
                    const isActive = pathname === action.link || (action.link === "/dashboard" && pathname === "/");
                    const Icon = action.icon;
                    return (
                        <Link
                            key={idx}
                            href={action.link}
                            className="relative flex flex-col items-center justify-center w-full h-full gap-1 active:bg-bg-tertiary/50 transition-colors group"
                        >
                            {isActive && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-theme-amber" />
                            )}
                            <Icon
                                className={cn(
                                    "w-6 h-6 transition-colors",
                                    isActive ? "text-theme-amber" : "text-text-secondary group-hover:text-text-primary"
                                )}
                            />
                            <span className={cn(
                                "text-[10px] font-medium leading-none",
                                isActive ? "text-theme-amber" : "text-text-secondary group-hover:text-text-primary"
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
