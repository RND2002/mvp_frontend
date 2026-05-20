"use client"

import React from "react"
import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Loader } from "@/components/ui/loader"

interface VroomButtonProps extends ButtonProps {
    loading?: boolean
    icon?: React.ReactNode
    iconPosition?: "left" | "right"
}

export const VroomButton = React.forwardRef<HTMLButtonElement, VroomButtonProps>(
    ({ className, variant, size, loading, icon, iconPosition = "right", children, ...props }, ref) => {
        const isPrimary = variant === "default" || !variant
        const isSecondary = variant === "outline" || variant === "secondary"

        return (
            <Button
                ref={ref}
                disabled={loading || props.disabled}
                variant={variant}
                size={size}
                className={cn(
                    "relative cursor-pointer overflow-hidden transition-all active:scale-95 font-bold tracking-tight",
                    // Primary: violet bg, white text, violet shadow
                    isPrimary && "bg-theme-green text-white hover:bg-theme-green/90 shadow-[0_0_20px_rgba(107,47,160,0.25)]",
                    // Secondary: light card bg, dark text
                    isSecondary && "border-[#E4E7EC] bg-white text-[#0F172A] hover:bg-[#F8F9FB]",
                    "rounded-xl",
                    className
                )}
                {...props}
            >
                {loading ? (
                    <Loader size="sm" />
                ) : (
                    <div className="flex items-center justify-center gap-2">
                        {icon && iconPosition === "left" && icon}
                        {children}
                        {icon && iconPosition === "right" && icon}
                    </div>
                )}

                {/* Subtle highlight effect */}
                <span className="absolute inset-0 bg-[#F5EDFC] opacity-0 hover:opacity-10 transition-opacity pointer-events-none" />
            </Button>
        )
    }
)

VroomButton.displayName = "VroomButton"
