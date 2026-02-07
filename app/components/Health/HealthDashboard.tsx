"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/app/store/store"
import { HealthReport } from "./HealthReport"
import { HealthSidebar } from "./HealthSidebar"
import { HealthSummary } from "./HealthSummary"
import { NextServiceBanner } from "./NextServiceBanner"
import { VroomButton } from "../common/VroomButton"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, ShieldCheck, AlertCircle, ChevronLeft } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { VehicleHealthReport } from "@/app/beService/health-service"

export const HealthDashboard = () => {
    const { selectedVehicle } = useSelector((state: RootState) => state.vehicle)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [mockData, setMockData] = useState<VehicleHealthReport | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showFullReport, setShowFullReport] = useState(false)

    // Dummy data generator
    const generateMockData = (): VehicleHealthReport => ({
        overall_score: 84,
        overall_status: "Excellent",
        last_updated: "Just now",
        engine: {
            temperature: { value: 88, status: "healthy", percentage: 75 },
            oil_level: { value: "Medium", status: "medium", percentage: 45 }
        },
        tyres: {
            front_psi: { value: 29, status: "optimal" },
            rear_psi: { value: 33, status: "optimal" },
            tread_depth: { value: 4.2, percentage: 65, status: "healthy" }
        },
        braking: {
            brake_pad_wear: { value: 65, status: "healthy", percentage: 65 },
            brake_fluid_status: { value: "Good", status: "good" }
        },
        electricals: {
            battery_voltage: { value: 12.8, status: "optimal" }
        }
    })

    const handleOpenSidebar = () => setIsSidebarOpen(true)

    const handleMockSubmit = () => {
        setIsLoading(true)
        setTimeout(() => {
            setMockData(generateMockData())
            setIsLoading(false)
        }, 1500)
    }

    if (!selectedVehicle) {
        return (
            <Card className="bg-vehicle-card-bg border-vehicle-card-border text-white">
                <CardContent className="p-8 text-center space-y-4">
                    <div className="bg-gray-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="w-8 h-8 text-gray-500" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">No Vehicle Selected</h3>
                        <p className="text-gray-400 text-sm max-w-xs mx-auto mt-2">
                            Please select or add a vehicle to view health insights and maintenance predictions.
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-64 w-full bg-vehicle-card-bg/20 rounded-2xl" />
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-32 w-full bg-vehicle-card-bg/20 rounded-xl" />
                    <Skeleton className="h-32 w-full bg-vehicle-card-bg/20 rounded-xl" />
                </div>
            </div>
        )
    }

    // Full Report View
    if (showFullReport && mockData) {
        return (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-4 mb-6">
                    <VroomButton
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowFullReport(false)}
                        className="bg-vehicle-card-bg border border-vehicle-card-border rounded-xl hover:bg-white/5 h-10 w-10"
                        icon={<ChevronLeft className="w-5 h-5 text-white" />}
                        iconPosition="left"
                    >
                    </VroomButton>
                    <div>
                        <h2 className="text-xl font-bold text-white leading-tight">Detailed Health Report</h2>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{selectedVehicle.brand} {selectedVehicle.model}</p>
                    </div>
                </div>

                <HealthReport data={mockData} />

                <div className="mt-8">
                    <VroomButton
                        onClick={() => setIsSidebarOpen(true)}
                        variant="outline"
                        className="w-full h-12"
                    >
                        Update Health Data
                    </VroomButton>
                </div>

                <HealthSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} onMockSubmit={handleMockSubmit} />
            </div>
        )
    }

    // Default Case: No health data found or CTA
    if (!mockData) {
        return (
            <Card className="bg-vehicle-card-bg border-vehicle-card-border text-white relative overflow-hidden group">
                <CardContent className="p-8">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-2 text-center md:text-left">
                            <div className="flex items-center gap-2 justify-center md:justify-start text-theme-green mb-1">
                                <ShieldCheck className="w-5 h-5" />
                                <span className="text-xs font-bold uppercase tracking-wider">Smart Health Check</span>
                            </div>
                            <h3 className="text-2xl font-bold">Check your vehicle health</h3>
                            <p className="text-gray-400 text-sm max-w-md">
                                Analyze your vehicle's engine, brakes, and electricals using our AI-powered diagnostic engine.
                            </p>
                        </div>
                        <VroomButton
                            onClick={handleOpenSidebar}
                            className="px-8 h-14 rounded-xl text-lg group-hover:scale-105 transition-transform"
                            icon={<Sparkles className="w-5 h-5" />}
                        >
                            Start Analysis
                        </VroomButton>
                    </div>

                    <div className="absolute top-0 right-0 w-64 h-64 bg-theme-green/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none"></div>
                </CardContent>

                <HealthSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} onMockSubmit={handleMockSubmit} />
            </Card>
        )
    }

    // Default View: Summary
    return (
        <div className="animate-in fade-in duration-500">
            <HealthSummary
                data={mockData}
                onClick={() => setShowFullReport(true)}
                vehicleName={`${selectedVehicle.brand} ${selectedVehicle.model}`}
                registrationNumber={selectedVehicle.registration_number}
            />
            <NextServiceBanner onClick={() => { }} />

            <HealthSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} onMockSubmit={handleMockSubmit} />
        </div>
    )
}
