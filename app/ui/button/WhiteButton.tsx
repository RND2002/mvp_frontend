"use client";

import React from "react";
import Link from "next/link";
import clsx from "clsx";
import { usePopup } from "@/app/components/Providers/ContactUsPopupProvider";

interface WhiteButtonProps {
    href?: string;
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    className?: string;
    hasHoverEffect?: boolean;
    openPopup?: boolean;
}

const WhiteButton: React.FC<WhiteButtonProps> = ({
    href,
    children,
    onClick,
    type = "button",
    className,
    hasHoverEffect = true,
    openPopup = true,
}) => {
    const baseClasses = clsx(
        "bg-white text-primary-dark flex items-center gap-2 rounded-full cursor-pointer px-6 py-3",
        "bg-[length:200%_100%] bg-left transition-all duration-1000",
        hasHoverEffect &&
        "hover:bg-gradient-to-r hover:from-white hover:via-primary hover:to-white",
        className
    );
    const { showPopup } = usePopup();
    const handleOnClick = () => {
        if (openPopup) showPopup();
        onClick?.();
    };
    if (href) {
        return (
            <Link href={href} className={baseClasses}>
                {children}
            </Link>
        );
    }

    return (
        <button type={type} onClick={handleOnClick} className={baseClasses}>
            {children}
        </button>
    );
};

export default WhiteButton;
