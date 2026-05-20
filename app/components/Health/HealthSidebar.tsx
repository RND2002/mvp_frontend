"use client"

import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet"
import { useSelector } from "react-redux"
import { RootState } from "@/app/store/store"
import { toast } from "sonner"
import { ChevronLeft } from "lucide-react"
import {
    AddServiceRecordRequest,
    ReportVehicleIssueRequest,
    useAddVehicleOdometerMutation,
    useAddVehicleServiceRecordMutation,
    useReportVehicleIssueMutation,
} from "@/app/beService/health-service"
import { HealthActionForms } from "./HealthActionForms"

interface HealthSidebarProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export const HealthSidebar = ({ open, onOpenChange, onSuccess }: HealthSidebarProps) => {
    const { selectedVehicle } = useSelector((state: RootState) => state.vehicle)
    const [addOdometer, odometerState] = useAddVehicleOdometerMutation()
    const [addServiceRecord, serviceState] = useAddVehicleServiceRecordMutation()
    const [reportIssue, issueState] = useReportVehicleIssueMutation()
    const isLoading = odometerState.isLoading || serviceState.isLoading || issueState.isLoading

    const ensureVehicle = () => {
        if (!selectedVehicle) {
            toast.error("No vehicle selected")
            return null
        }
        return selectedVehicle.id
    }

    const handleSuccess = (message: string) => {
        toast.success(message)
        onOpenChange(false)
        if (onSuccess) onSuccess()
    }

    const getErrorMessage = (err: unknown, fallback: string) => {
        if (typeof err === "object" && err !== null && "data" in err) {
            const data = (err as { data?: { error?: string } }).data
            return data?.error || fallback
        }
        return fallback
    }

    const handleAddOdometer = async (data: { reading: number; source: "user_input" }) => {
        const vehicleId = ensureVehicle()
        if (!vehicleId) return
        try {
            await addOdometer({ vehicleId, ...data }).unwrap()
            handleSuccess("Odometer updated and health recalculated")
        } catch (err) {
            toast.error(getErrorMessage(err, "Failed to update odometer"))
        }
    }

    const handleAddServiceRecord = async (data: Omit<AddServiceRecordRequest, "vehicleId">) => {
        const vehicleId = ensureVehicle()
        if (!vehicleId) return
        try {
            await addServiceRecord({ vehicleId, ...data }).unwrap()
            handleSuccess("Service record saved and health recalculated")
        } catch (err) {
            toast.error(getErrorMessage(err, "Failed to save service record"))
        }
    }

    const handleReportIssue = async (data: Omit<ReportVehicleIssueRequest, "vehicleId">) => {
        const vehicleId = ensureVehicle()
        if (!vehicleId) return
        try {
            await reportIssue({ vehicleId, ...data }).unwrap()
            handleSuccess("Issue reported and health recalculated")
        } catch (err) {
            toast.error(getErrorMessage(err, "Failed to report issue"))
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

                    <HealthActionForms
                        isLoading={isLoading}
                        onAddOdometer={handleAddOdometer}
                        onAddServiceRecord={handleAddServiceRecord}
                        onReportIssue={handleReportIssue}
                    />
                </div>
            </SheetContent>
        </Sheet>
    )
}
