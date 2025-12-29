"use client";

import React from "react";
import { usePopup } from "@/app/components/Providers/ContactUsPopupProvider";

interface PopupTriggerProps {
    children: React.ReactNode;
    className?: string;
    as?: React.ElementType;
    onClick?: (e: React.MouseEvent) => void;
    onFocus?: (e: React.FocusEvent) => void;
    onBlur?: (e: React.FocusEvent) => void;
    onMouseEnter?: (e: React.MouseEvent) => void;
    onMouseLeave?: (e: React.MouseEvent) => void;
    onTouchStart?: (e: React.TouchEvent) => void;
    onTouchEnd?: (e: React.TouchEvent) => void;
    disabled?: boolean;
    [key: string]: any;
}

const PopupTrigger: React.FC<PopupTriggerProps> = ({
    children,
    className = "",
    as,
    onClick,
    onFocus,
    onBlur,
    onMouseEnter,
    onMouseLeave,
    onTouchStart,
    onTouchEnd,
    disabled = false,
    ...props
}) => {
    const { showPopup } = usePopup();

    const Component = as || "button";

    const handleClick = (e: React.MouseEvent) => {
        if (disabled) return;

        if (onClick) {
            onClick(e);
        }

        if (Component === "a" || props.href) {
            e.preventDefault();
        }

        showPopup();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (disabled) return;

        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            showPopup();
        }
    };

    const handleFocus = (e: React.FocusEvent) => {
        if (onFocus) {
            onFocus(e);
        }
    };

    const handleBlur = (e: React.FocusEvent) => {
        if (onBlur) {
            onBlur(e);
        }
    };

    const handleMouseEnter = (e: React.MouseEvent) => {
        if (onMouseEnter) {
            onMouseEnter(e);
        }
    };

    const handleMouseLeave = (e: React.MouseEvent) => {
        if (onMouseLeave) {
            onMouseLeave(e);
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (disabled) return;

        if (onTouchStart) {
            onTouchStart(e);
        }
        // Don't trigger popup on touch events
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (disabled) return;

        if (onTouchEnd) {
            onTouchEnd(e);
        }
        // Don't trigger popup on touch events
    };

    const isNonInteractive = Component === "div" || Component === "span";

    const componentProps = {
        onClick: handleClick,
        onKeyDown: handleKeyDown,
        onFocus: handleFocus,
        onBlur: handleBlur,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onTouchStart: handleTouchStart,
        onTouchEnd: handleTouchEnd,
        className,
        disabled: Component === "button" ? disabled : undefined,
        "aria-disabled": disabled ? "true" : undefined,
        role: isNonInteractive ? "button" : undefined,
        tabIndex: disabled ? -1 : isNonInteractive ? 0 : undefined,
        "aria-label": props["aria-label"] || "Open contact form",
        ...props,
    };

    return React.createElement(Component, componentProps, children);
};

export default PopupTrigger;
