"use client"

import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Activity, Gauge, MessageSquareWarning, Wrench } from "lucide-react"
import { cn } from "@/lib/utils"
import { VehicleIssueSeverity } from "@/app/beService/health-service"

type HealthAction = "odometer" | "service" | "issue"

const today = new Date().toISOString().split("T")[0]

const actionTabs: Array<{ id: HealthAction; label: string; icon: React.ReactNode }> = [
    { id: "odometer", label: "Odometer", icon: <Gauge className="w-4 h-4" /> },
    { id: "service", label: "Service", icon: <Wrench className="w-4 h-4" /> },
    { id: "issue", label: "Issue", icon: <MessageSquareWarning className="w-4 h-4" /> },
]

const odometerSchema = yup.object({
    reading: yup.number().required("Odometer reading is required").positive("Reading must be positive").typeError("Reading must be a number"),
})

const serviceSchema = yup.object({
    service_date: yup.string().required("Service date is required"),
    odometer_at_service: yup.number().required("Odometer is required").positive("Odometer must be positive").typeError("Odometer must be a number"),
    service_type: yup.string().required("Service type is required"),
    components_serviced: yup.string().required("Add at least one component"),
    cost: yup.number().positive("Cost must be positive").typeError("Cost must be a number").optional(),
    garage_name: yup.string().optional(),
})

const issueSchema = yup.object({
    issue_type: yup.string().required("Issue type is required"),
    description: yup.string().required("Description is required"),
    severity: yup.mixed<VehicleIssueSeverity>().oneOf(["low", "medium", "high", "critical"]).required("Severity is required"),
})

interface HealthActionFormsProps {
    isLoading?: boolean
    onAddOdometer: (data: { reading: number; source: "user_input" }) => Promise<void>
    onAddServiceRecord: (data: {
        service_date: string
        odometer_at_service: number
        service_type: string
        components_serviced: string[]
        cost?: number
        garage_name?: string
        source: "manual_entry"
    }) => Promise<void>
    onReportIssue: (data: { issue_type: string; description: string; severity: VehicleIssueSeverity }) => Promise<void>
}

const parseComponents = (value: string) => value.split(",").map((item) => item.trim()).filter(Boolean)

export const HealthActionForms = ({ isLoading, onAddOdometer, onAddServiceRecord, onReportIssue }: HealthActionFormsProps) => {
    const [activeAction, setActiveAction] = useState<HealthAction>("odometer")
    const [selectedSeverity, setSelectedSeverity] = useState<VehicleIssueSeverity>("medium")
    const odometerForm = useForm({ resolver: yupResolver(odometerSchema) })
    const serviceForm = useForm({ resolver: yupResolver(serviceSchema) })
    const issueForm = useForm({ resolver: yupResolver(issueSchema), defaultValues: { severity: "medium" as VehicleIssueSeverity } })

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">Update vehicle health</h2>
                <p className="text-gray-400 text-sm">Add real maintenance events so the dashboard can refresh from backend health reports.</p>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-xl bg-white/5 p-1 border border-secondary-theme">
                {actionTabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveAction(tab.id)}
                        className={cn(
                            "h-10 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-colors",
                            activeAction === tab.id ? "bg-theme-green text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        {tab.icon}
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {activeAction === "odometer" && (
                <form
                    className="space-y-5"
                    onSubmit={odometerForm.handleSubmit(async (data) => {
                        await onAddOdometer({ reading: data.reading, source: "user_input" })
                        odometerForm.reset()
                    })}
                >
                    <div className="space-y-2">
                        <Label htmlFor="reading" className="text-gray-300">Current odometer</Label>
                        <Input id="reading" type="number" placeholder="19000" className="h-12 bg-white/5 border-secondary-theme text-white" {...odometerForm.register("reading")} />
                        {odometerForm.formState.errors.reading && <p className="text-red-500 text-xs">{odometerForm.formState.errors.reading.message}</p>}
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full h-12 bg-theme-green text-white font-bold rounded-xl">
                        {isLoading ? "Saving..." : "Save Odometer"}
                    </Button>
                </form>
            )}

            {activeAction === "service" && (
                <form
                    className="space-y-4"
                    onSubmit={serviceForm.handleSubmit(async (data) => {
                        await onAddServiceRecord({
                            service_date: data.service_date,
                            odometer_at_service: data.odometer_at_service,
                            service_type: data.service_type,
                            components_serviced: parseComponents(data.components_serviced),
                            cost: data.cost || undefined,
                            garage_name: data.garage_name || undefined,
                            source: "manual_entry",
                        })
                        serviceForm.reset()
                    })}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="service_date" className="text-gray-300">Service date</Label>
                            <Input id="service_date" type="date" max={today} className="h-12 bg-white/5 border-secondary-theme text-white" {...serviceForm.register("service_date")} />
                            {serviceForm.formState.errors.service_date && <p className="text-red-500 text-xs">{serviceForm.formState.errors.service_date.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="odometer_at_service" className="text-gray-300">Odometer</Label>
                            <Input id="odometer_at_service" type="number" placeholder="18800" className="h-12 bg-white/5 border-secondary-theme text-white" {...serviceForm.register("odometer_at_service")} />
                            {serviceForm.formState.errors.odometer_at_service && <p className="text-red-500 text-xs">{serviceForm.formState.errors.odometer_at_service.message}</p>}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="service_type" className="text-gray-300">Service type</Label>
                        <Input id="service_type" placeholder="oil_change" className="h-12 bg-white/5 border-secondary-theme text-white" {...serviceForm.register("service_type")} />
                        {serviceForm.formState.errors.service_type && <p className="text-red-500 text-xs">{serviceForm.formState.errors.service_type.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="components_serviced" className="text-gray-300">Components serviced</Label>
                        <Input id="components_serviced" placeholder="engine_oil, air_filter, brakes" className="h-12 bg-white/5 border-secondary-theme text-white" {...serviceForm.register("components_serviced")} />
                        {serviceForm.formState.errors.components_serviced && <p className="text-red-500 text-xs">{serviceForm.formState.errors.components_serviced.message}</p>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="cost" className="text-gray-300">Cost</Label>
                            <Input id="cost" type="number" placeholder="1200" className="h-12 bg-white/5 border-secondary-theme text-white" {...serviceForm.register("cost")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="garage_name" className="text-gray-300">Garage name</Label>
                            <Input id="garage_name" placeholder="Local Garage" className="h-12 bg-white/5 border-secondary-theme text-white" {...serviceForm.register("garage_name")} />
                        </div>
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full h-12 bg-theme-green text-white font-bold rounded-xl">
                        {isLoading ? "Saving..." : "Save Service Record"}
                    </Button>
                </form>
            )}

            {activeAction === "issue" && (
                <form
                    className="space-y-4"
                    onSubmit={issueForm.handleSubmit(async (data) => {
                        await onReportIssue(data)
                        setSelectedSeverity("medium")
                        issueForm.reset({ severity: "medium" })
                    })}
                >
                    <div className="space-y-2">
                        <Label htmlFor="issue_type" className="text-gray-300">Issue type</Label>
                        <Input id="issue_type" placeholder="noise" className="h-12 bg-white/5 border-secondary-theme text-white" {...issueForm.register("issue_type")} />
                        {issueForm.formState.errors.issue_type && <p className="text-red-500 text-xs">{issueForm.formState.errors.issue_type.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-gray-300">Description</Label>
                        <Input id="description" placeholder="Brake squeaking at low speed" className="h-12 bg-white/5 border-secondary-theme text-white" {...issueForm.register("description")} />
                        {issueForm.formState.errors.description && <p className="text-red-500 text-xs">{issueForm.formState.errors.description.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label className="text-gray-300">Severity</Label>
                        <div className="grid grid-cols-4 gap-2">
                            {(["low", "medium", "high", "critical"] as VehicleIssueSeverity[]).map((severity) => (
                                <button
                                    key={severity}
                                    type="button"
                                    onClick={() => {
                                        setSelectedSeverity(severity)
                                        issueForm.setValue("severity", severity, { shouldValidate: true })
                                    }}
                                    className={cn(
                                        "h-10 rounded-lg border border-secondary-theme text-xs font-bold uppercase transition-colors",
                                        selectedSeverity === severity ? "bg-theme-green text-white" : "bg-white/5 text-gray-400 hover:text-white"
                                    )}
                                >
                                    {severity}
                                </button>
                            ))}
                        </div>
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full h-12 bg-theme-green text-white font-bold rounded-xl">
                        {isLoading ? "Saving..." : "Report Issue"}
                    </Button>
                </form>
            )}

            <div className="bg-primaryCard/50 border border-secondary-theme rounded-xl p-4 flex gap-3">
                <div className="bg-theme-green/20 p-2 rounded-lg h-fit">
                    <Activity className="w-5 h-5 text-theme-green" />
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">
                    Each update is sent to the backend action API, which recalculates health and refreshes this dashboard.
                </p>
            </div>
        </div>
    )
}
