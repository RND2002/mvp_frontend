"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FaCalendarCheck, FaHistory } from "react-icons/fa";
import { MdTune, MdEmergency, MdDashboard, MdShoppingCart } from "react-icons/md";
import { motion } from "framer-motion";

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
        title: "Cart",
        icon: MdShoppingCart,
        link: "/cart"
    },
    {
        title: "History",
        icon: FaHistory,
        link: "/service-history"
    }
];

export default function DesktopFloatingDock() {
    const pathname = usePathname();

    // Use a simpler approach without auth check here if it's handled by parent or if it's okay to show/hide based on layout logic.
    // However, MobileBottomNav checks auth. Let's do the same for consistency.
    // Importing from redux might require this component to be inside StoreProvider (which it should be in layout).

    // START AUTH CHECK
    // If you prefer not to duplicate logic, we can rely on the fact that layout wraps this.
    // But layout renders it unconditionally. Let's check auth.
    // Dynamic imports or hooks might be needed.
    // Let's assume standard redux usage is fine.

    const isAuthenticated = true; // Placeholder if we don't want to couple to redux here instantly. 
    // Actually, looking at MobileBottomNav, it uses useSelector.
    // Let's implement it propertly.

    return <DesktopFloatingDockContent />;
}

import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/app/store/slices/authSlice";
import { RootState } from "@/app/store/store";

function DesktopFloatingDockContent() {
    const pathname = usePathname();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    if (!isAuthenticated) return null;

    return (
        <div className="hidden md:flex fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-1 p-2 bg-white/95 backdrop-blur-md border border-[#E4E7EC] rounded-full shadow-2xl shadow-black/50">
                {actions.map((action) => {
                    const isActive = pathname === action.link || (action.link === "/dashboard" && pathname === "/");
                    const Icon = action.icon;

                    return (
                        <Link
                            key={action.title}
                            href={action.link}
                            className="relative px-6 py-3 rounded-full flex items-center gap-2 group transition-colors"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="dock-active-pill"
                                    className="absolute inset-0 bg-green-500 rounded-full"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                <Icon className={cn(
                                    "w-5 h-5 transition-colors duration-200",
                                    isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
                                )} />
                                <span className={cn(
                                    "text-sm font-medium transition-colors duration-200",
                                    isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
                                )}>
                                    {action.title}
                                </span>
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
