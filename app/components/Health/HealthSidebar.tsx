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
import { useUpdateVehicleMutation } from "@/app/beService/health-service"

interface HealthSidebarProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export const HealthSidebar = ({ open, onOpenChange, onSuccess }: HealthSidebarProps) => {
    const { selectedVehicle } = useSelector((state: RootState) => state.vehicle)
    const [updateVehicle, { isLoading }] = useUpdateVehicleMutation()

    const handleSubmit = async (data: { kilometers_driven: number, last_service_date: string }) => {
        if (!selectedVehicle) {
            toast.error("No vehicle selected")
            return
        }

        try {
            await updateVehicle({
                id: selectedVehicle.id,
                baseline_odometer_reading: data.kilometers_driven,
                baseline_last_service_date: data.last_service_date
            }).unwrap()

            toast.success("Vehicle health data updated!")
            onOpenChange(false)
            if (onSuccess) onSuccess()
        } catch (err: any) {
            toast.error(err.data?.error || "Failed to update health data")
        }
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-md bg-primaryCard border-l-secondary-theme p-0 overflow-y-auto">
                <div className="p-6">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Vehicle History Details</span>
                    </button>

                    <HealthInputForm onSubmit={handleSubmit} isLoading={isLoading} />
                </div>
            </SheetContent>
        </Sheet>
    )
}
