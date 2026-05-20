"use client";

import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { formatDate } from "@/lib/utils";
import { PillFilters, FilterItem } from "../components/common/PillFilters";
import { CalendarClock, CheckCircle2, CircleAlert, Clock, History as HistoryIcon, Wrench } from "lucide-react";
import { PageHeader } from "@/app/components/common/PageHeader";
import { Loader } from "@/components/ui/loader";
import { VehicleTimelineItem, useGetVehicleTimelineQuery } from "@/app/beService/health-service";

const FILTER_ITEMS: FilterItem[] = [
    { id: "all", label: "View All" },
    { id: "service_record", label: "Services" },
    { id: "booking", label: "Bookings" },
    { id: "issue", label: "Issues" }
];

const getTimelineDate = (item: VehicleTimelineItem) => item.date || item.service_date || item.scheduled_at || item.created_at || "";

const getTimelineTitle = (item: VehicleTimelineItem) => {
    if (item.title) return item.title;
    if (item.type === "service_record") return item.service_type ? String(item.service_type).replaceAll("_", " ") : "Service record";
    if (item.type === "booking") return "Service booking";
    if (item.type === "issue") return item.issue_type ? String(item.issue_type).replaceAll("_", " ") : "Reported issue";
    return "Vehicle event";
};

const getTimelineIcon = (type: string) => {
    if (type === "service_record") return <Wrench className="w-5 h-5 text-theme-green" />;
    if (type === "booking") return <CalendarClock className="w-5 h-5 text-sky-400" />;
    if (type === "issue") return <CircleAlert className="w-5 h-5 text-amber-400" />;
    return <Clock className="w-5 h-5 text-gray-400" />;
};

export default function ServiceHistoryPage() {
    const { selectedVehicle } = useSelector((state: RootState) => state.vehicle);
    const [selectedFilter, setSelectedFilter] = useState("all");

    const { data, isLoading } = useGetVehicleTimelineQuery(
        selectedVehicle?.id || "",
        { skip: !selectedVehicle?.id }
    );

    const timeline = useMemo(() => {
        const rows = data?.timeline || [];
        return [...rows].sort((a, b) => new Date(getTimelineDate(b)).getTime() - new Date(getTimelineDate(a)).getTime());
    }, [data?.timeline]);

    const filteredTimeline = selectedFilter === "all" ? timeline : timeline.filter((item) => item.type === selectedFilter);

    if (!selectedVehicle) {
        return (
            <div className="min-h-screen bg-primary-theme flex items-center justify-center text-white">
                <div className="text-center">
                    <HistoryIcon className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Please select a vehicle to view history.</p>
                </div>
            </div>
        );
    }



    return (
        <div className="min-h-screen bg-primary-theme pb-24 lg:pb-12 animate-slide-up overflow-x-hidden">
            <div className="max-w-3xl lg:max-w-7xl lg:mx-0 lg:px-12 mx-auto px-4 pt-8">

                {/* Common Header */}
                <PageHeader
                    title={<>Garage <span className="text-theme-green">Log</span></>}
                    subtitle="Merged timeline of service records, bookings, and reported issues."
                    backUrl="/dashboard"
                />

                {/* Pill Filters */}
                <div className="mb-12">
                    <PillFilters
                        items={FILTER_ITEMS}
                        selectedId={selectedFilter}
                        onSelect={setSelectedFilter}
                        className="mb-8"
                    />
                </div>

                <div className="space-y-6">
                    {isLoading && (
                        <div className="flex justify-center py-8">
                            <Loader size="md" />
                        </div>
                    )}

                    {!isLoading && filteredTimeline.length > 0 && (
                        <div className="relative space-y-4">
                            {filteredTimeline.map((item) => {
                                const date = getTimelineDate(item);
                                return (
                                    <article key={`${item.type}-${item.id}`} className="bg-primaryCard border border-secondary-theme rounded-2xl p-5">
                                        <div className="flex gap-4">
                                            <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                                {getTimelineIcon(item.type)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-theme-green">{item.type.replaceAll("_", " ")}</p>
                                                        <h2 className="text-white text-lg font-bold capitalize mt-1">{getTimelineTitle(item)}</h2>
                                                    </div>
                                                    {item.status && (
                                                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-300 w-fit">
                                                            {item.status}
                                                        </span>
                                                    )}
                                                </div>
                                                {item.description && <p className="text-sm text-gray-400 mt-3 leading-relaxed">{item.description}</p>}
                                                <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-xs text-gray-500">
                                                    {date && <span>{formatDate(date)}</span>}
                                                    {(item.odometer_at_service || item.odometer_reading) && <span>{item.odometer_at_service || item.odometer_reading} km</span>}
                                                    {(item.cost || item.final_price) && <span>Rs. {item.cost || item.final_price}</span>}
                                                    {item.garage_name && <span>{item.garage_name}</span>}
                                                </div>
                                                {item.components_serviced && item.components_serviced.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-4">
                                                        {item.components_serviced.map((component) => (
                                                            <span key={component} className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[10px] text-gray-300 uppercase tracking-wider">
                                                                {component.replaceAll("_", " ")}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}

                    {!isLoading && filteredTimeline.length === 0 && (
                        <div className="bg-primaryCard/50 border border-dashed border-secondary-theme rounded-4xl p-16 text-center">
                            <HistoryIcon className="w-12 h-12 text-gray-800 mx-auto mb-4 opacity-20" />
                            <p className="text-gray-600 text-sm font-bold uppercase tracking-widest italic">
                                No garage log records found
                            </p>
                        </div>
                    )}

                    {!isLoading && timeline.length > 0 && (
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                            <CheckCircle2 className="w-4 h-4 text-theme-green" />
                            <span>Showing backend timeline data for {selectedVehicle.brand} {selectedVehicle.model}.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
