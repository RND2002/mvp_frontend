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
        const isDanger = variant === "destructive"

        return (
            <Button
                ref={ref}
                disabled={loading || props.disabled}
                variant={variant}
                size={size}
                className={cn(
                    "relative cursor-pointer overflow-hidden font-semibold transition-all duration-150 outline-none",
                    // Primary CTA styles
                    isPrimary && "bg-theme-amber text-black hover:bg-theme-amber-hover active:bg-amber-600 active:scale-[0.98] border-none rounded-[6px]",
                    // Secondary styles
                    isSecondary && "bg-transparent text-[#F5F5F0] border border-white/12 rounded-[6px] hover:bg-white/5 hover:border-white/20 active:scale-[0.98]",
                    // Danger styles
                    isDanger && "bg-[#EF4444]/12 text-[#EF4444] border border-[#EF4444]/25 rounded-[6px] hover:bg-[#EF4444]/20 active:scale-[0.98]",
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
            </Button>
        )
    }
)

VroomButton.displayName = "VroomButton"
