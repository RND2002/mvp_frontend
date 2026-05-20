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
        <div className="md:hidden fixed bottom-0 left-0 right-0 w-full bg-white border-t border-[#E4E7EC] z-50 px-2 shadow-sm">
            <div className="flex justify-around items-center h-16">
                {actions.map((action, idx) => {
                    const isActive = pathname === action.link || (action.link === "/dashboard" && pathname === "/");
                    const Icon = action.icon;
                    return (
                        <Link
                            key={idx}
                            href={action.link}
                            className="flex flex-col items-center justify-center w-full h-full gap-1 active:bg-[#F8F9FB] transition-colors group"
                        >
                            <Icon
                                className={cn(
                                    "w-5 h-5 transition-colors",
                                    isActive ? "text-[#6B2FA0]" : "text-[#94A3B8] group-hover:text-[#475569]"
                                )}
                            />
                            <span className={cn(
                                "text-[10px] font-bold tracking-tight",
                                isActive ? "text-[#6B2FA0]" : "text-[#94A3B8] group-hover:text-[#475569]"
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
