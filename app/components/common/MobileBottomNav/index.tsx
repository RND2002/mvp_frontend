"use client";

import React from "react";
import Link from "next/link";
import InlineSVG from "@/app/components/common/InlineSVG";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const actions = [
    {
        title: "Book",
        icon: "/icons/vehicle/booking-service.svg",
        link: "/book-service"
    },
    {
        title: "Modify",
        icon: "/icons/vehicle/modification.svg",
        link: "/modify-ride"
    },
    {
        title: "Emergency",
        icon: "/icons/vehicle/components.svg",
        link: "/emergency-assistance"
    },
    {
        title: "History",
        icon: "/icons/vehicle/user-experience.svg",
        link: "/service-history"
    }
];

const MobileBottomNav: React.FC = () => {
    const pathname = usePathname();

    // Hide if not on main screens or if needed (optional)
    // For now showing on all screens as requested

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
            <div className="flex justify-around items-center h-16">
                {actions.map((action, idx) => {
                    const isActive = pathname === action.link;
                    return (
                        <Link
                            key={idx}
                            href={action.link}
                            className="flex flex-col items-center justify-center w-full h-full gap-1 active:bg-gray-50"
                        >
                            <InlineSVG
                                src={action.icon}
                                className={cn(
                                    "w-6 h-6 transition-colors",
                                    isActive ? "text-[var(--color-primary)]" : "text-gray-500"
                                )}
                            />
                            <span className={cn(
                                "text-[10px] font-medium leading-none",
                                isActive ? "text-[var(--color-primary)]" : "text-gray-500"
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
