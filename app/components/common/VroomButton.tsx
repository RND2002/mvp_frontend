"use client"

import React from "react"
import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

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
                    // Glow effect for primary buttons
                    isPrimary && "bg-theme-green text-black hover:bg-theme-green/90 shadow-[0_0_20px_rgba(34,197,94,0.2)]",
                    // Refined secondary style
                    isSecondary && "border-vehicle-card-border bg-vehicle-card-bg text-white hover:bg-white/5",
                    "rounded-xl",
                    className
                )}
                {...props}
            >
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <div className="flex items-center justify-center gap-2">
                        {icon && iconPosition === "left" && icon}
                        {children}
                        {icon && iconPosition === "right" && icon}
                    </div>
                )}

                {/* Subtle highlight effect */}
                <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-10 transition-opacity pointer-events-none" />
            </Button>
        )
    }
)

VroomButton.displayName = "VroomButton"
