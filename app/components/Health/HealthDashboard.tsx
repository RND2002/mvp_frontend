"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/app/store/store"
import { setDetailedReportOpen } from "@/app/store/slices/uiSlice"
import { HealthReport } from "./HealthReport"
import { HealthSidebar } from "./HealthSidebar"
import { HealthSummary } from "./HealthSummary"
import { NextServiceBanner } from "./NextServiceBanner"
import { VroomButton } from "../common/VroomButton"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, ShieldCheck, AlertCircle, ChevronLeft } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetVehicleHealthQuery } from "@/app/beService/health-service"
import { toast } from "sonner"

export const HealthDashboard = () => {
    const dispatch = useDispatch();
    const { selectedVehicle } = useSelector((state: RootState) => state.vehicle)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [showFullReport, setShowFullReport] = useState(false)
    const { data: healthData, isLoading: isFetchingHealth, isError } = useGetVehicleHealthQuery(selectedVehicle?.id || "", {
        skip: !selectedVehicle?.id
    })

    useEffect(() => {
        if (isError) {
            toast.error("Failed to fetch vehicle health data")
        }
    }, [isError])

    useEffect(() => {
        dispatch(setDetailedReportOpen(showFullReport));
    }, [showFullReport, dispatch]);

    const handleOpenSidebar = () => setIsSidebarOpen(true)

    const handleHealthUpdateSuccess = () => {
        setIsSidebarOpen(false)
        setShowFullReport(true)
    }

    if (!selectedVehicle) {
        return (
            <Card className="bg-white border-[#E4E7EC] text-white">
                <CardContent className="p-8 text-center space-y-4">
                    <div className="bg-gray-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="w-8 h-8 text-[#475569]" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">No Vehicle Selected</h3>
                        <p className="text-[#475569] text-sm max-w-xs mx-auto mt-2">
                            Please select or add a vehicle to view health insights and maintenance predictions.
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (isFetchingHealth) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-64 w-full bg-white rounded-2xl" />
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-32 w-full bg-white rounded-xl" />
                    <Skeleton className="h-32 w-full bg-white rounded-xl" />
                </div>
            </div>
        )
    }

    // Full Report View
    if (showFullReport && healthData?.health) {
        return (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-4 mb-4">
                    <VroomButton
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowFullReport(false)}
                        className="bg-white border border-[#E4E7EC] rounded-xl hover:bg-[#F8F9FB] h-10 w-10"
                        icon={<ChevronLeft className="w-5 h-5" />}
                        iconPosition="left"
                    >
                    </VroomButton>
                    <div>
                        <h2 className="text-xl font-bold leading-tight">Detailed Health Report</h2>
                        <p className="text-[#475569] text-[10px] font-bold uppercase tracking-widest">{selectedVehicle.brand} {selectedVehicle.model}</p>
                    </div>
                </div>

                <HealthReport data={healthData} />

                <div className="mt-8">
                    <VroomButton
                        onClick={() => setIsSidebarOpen(true)}
                        variant="outline"
                        className="w-full h-12"
                    >
                        Update Health Data
                    </VroomButton>
                </div>

                <HealthSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} onSuccess={handleHealthUpdateSuccess} />
            </div>
        )
    }

    // Default Case: No health data found or CTA
    const score = healthData?.health?.overall_score ?? healthData?.health?.overall?.score
    const needsSetup = !healthData?.health || score === null || score === undefined;

    if (needsSetup) {
        const message = healthData?.health?.overall?.message || "Analyze your vehicle's engine, brakes, and electricals using our AI-powered diagnostic engine.";
        const title = score === null ? "Add vehicle details" : "Check your vehicle health";

        return (
            <Card className="bg-white border-[#E4E7EC] text-white relative overflow-hidden group">
                <CardContent className="p-8">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-2 text-center md:text-left">
                            <div className="flex items-center gap-2 justify-center md:justify-start text-theme-green mb-1">
                                <ShieldCheck className="w-5 h-5" />
                                <span className="text-xs font-bold uppercase tracking-wider">Smart Health Check</span>
                            </div>
                            <h3 className="text-2xl font-bold">{title}</h3>
                            <p className="text-[#475569] text-sm max-w-md">
                                {message}
                            </p>
                        </div>
                        <VroomButton
                            onClick={handleOpenSidebar}
                            className="px-8 h-14 cursor-pointer rounded-xl text-lg group-hover:scale-105 transition-transform"
                            icon={<Sparkles className="w-5 h-5" />}
                        >
                            Start Analysis
                        </VroomButton>
                    </div>

                    <div className="absolute top-0 right-0 w-64 h-64 bg-theme-green/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none"></div>
                </CardContent>

                <HealthSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} onSuccess={handleHealthUpdateSuccess} />
            </Card>
        )
    }

    // Default View: Summary
    return (
        <div className="animate-in fade-in duration-500">
            <HealthSummary
                data={healthData}
                onClick={() => setShowFullReport(true)}
                vehicleName={`${selectedVehicle.brand} ${selectedVehicle.model}`}
                registrationNumber={selectedVehicle.registration_number}
            />
            <div className="md:mb-24">
                <NextServiceBanner onClick={() => { }} />
            </div>

            <HealthSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} onSuccess={handleHealthUpdateSuccess} />
        </div>
    )
}
