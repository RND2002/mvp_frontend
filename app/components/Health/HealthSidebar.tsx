"use client"

import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet"
import { HealthInputForm } from "./HealthInputForm"
import { useSelector } from "react-redux"
import { RootState } from "@/app/store/store"
import { toast } from "sonner"
import { ChevronLeft } from "lucide-react"

interface HealthSidebarProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onMockSubmit?: () => void;
}

export const HealthSidebar = ({ open, onOpenChange, onMockSubmit }: HealthSidebarProps) => {
    const { selectedVehicle } = useSelector((state: RootState) => state.vehicle)

    const handleSubmit = async (data: { kilometers_driven: number, last_service_date: string }) => {
        if (!selectedVehicle) {
            toast.error("No vehicle selected")
            return
        }

        // Bypassing API for mock demo
        toast.success("Health score calculated successfully!")
        onOpenChange(false)
        if (onMockSubmit) onMockSubmit()
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-md bg-vehicle-card-bg border-l-vehicle-card-border p-0 overflow-y-auto">
                <div className="p-6">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Vehicle History Details</span>
                    </button>

                    <HealthInputForm onSubmit={handleSubmit} isLoading={false} />
                </div>
            </SheetContent>
        </Sheet>
    )
}
