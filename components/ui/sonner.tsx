"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-vehicle-card-bg group-[.toaster]:text-white group-[.toaster]:border-vehicle-card-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-gray-400",
          actionButton:
            "group-[.toast]:bg-green-500 group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          error: "!border-red-500 !text-red-500",
          success: "!border-green-500 !text-green-500",
          warning: "!border-yellow-500 !text-yellow-500",
          info: "!border-blue-500 !text-blue-500",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-4 text-green-500" />,
        info: <InfoIcon className="size-4 text-blue-500" />,
        warning: <TriangleAlertIcon className="size-4 text-yellow-500" />,
        error: <OctagonXIcon className="size-4 text-red-500" />,
        loading: <Loader2Icon className="size-4 animate-spin text-gray-400" />,
      }}
      style={
        {
          "--normal-bg": "var(--vehicle-card-bg)",
          "--normal-text": "white",
          "--normal-border": "var(--vehicle-card-border)",
          "--success-bg": "var(--vehicle-card-bg)",
          "--success-text": "#22c55e",
          "--success-border": "#22c55e",
          "--error-bg": "var(--vehicle-card-bg)",
          "--error-text": "#ef4444",
          "--error-border": "#ef4444",
        } as React.CSSProperties
      }
      {...props}
    />

  )
}

export { Toaster }
