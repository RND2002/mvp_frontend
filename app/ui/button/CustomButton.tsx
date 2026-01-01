
"use client";

import React from "react";
import Link from "next/link";
import clsx from "clsx";
import { usePopup } from "@/app/components/Providers/ContactUsPopupProvider";
interface CustomButton {
    href?: string;
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    className?: string;
    innerClassName?: string;
    textClassName?: string;
    openPopup?: boolean;
}

const CustomButton: React.FC<CustomButton> = ({
    href,
    children,
    onClick,
    type = "button",
    className,
    innerClassName = "",
    textClassName = "",
    openPopup = true,
}) => {
    const outerClasses = clsx(
        "inline-flex items-center gap-4 rounded-full pl-5 pr-1 py-2 group transition-shadow duration-200 shadow-sm cursor-pointer select-none",
        "bg-[#B61607]",
        className
    );

    const textClasses = clsx(
        "text-white font-semibold text-sm leading-none truncate",
        textClassName
    );

    const circleClasses = clsx(
        "flex items-center justify-center w-9 h-9 rounded-full bg-white transition-transform duration-200 flex-shrink-0",
        innerClassName
    );

    const arrowClasses =
        "w-4 h-4 text-[#D33C35] transform -rotate-45 transition-transform duration-200 group-hover:rotate-0";

    const content = (
        <>
            <span className={textClasses}>{children}</span>

            {/* <span className={circleClasses} aria-hidden>
                <svg
                    className={arrowClasses}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    focusable="false"
                >
                    <path
                        d="M5 12h11"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M12 5l7 7-7 7"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </span> */}
        </>
    );
    const { showPopup } = usePopup();
    const handleOnClick = () => {
        if (openPopup) showPopup();
        onClick?.();
    };

    if (href) {
        return (
            <Link href={href} className={outerClasses} aria-label={String(children)}>
                {content}
            </Link>
        );
    }

    return (
        <button
            type={type}
            onClick={handleOnClick}
            className={outerClasses}
            aria-label={String(children)}
        >
            {content}
        </button>
    );
};

export default CustomButton;
