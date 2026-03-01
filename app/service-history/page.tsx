"use client";

import React, { useState } from "react";
import { ServiceHistoryCard } from "@/app/components/common/ServiceHistory";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { useGetBookingsQuery, Booking } from "@/app/beService/booking-service";
import { formatDate } from "@/lib/utils";
import { PillFilters, FilterItem } from "../components/common/PillFilters";
import { Clock, History as HistoryIcon, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/app/components/common/PageHeader";

const FILTER_ITEMS: FilterItem[] = [
    { id: "all", label: "View All" },
    { id: "pending", label: "Pending" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" }
];

export default function ServiceHistoryPage() {
    const router = useRouter();
    const { selectedVehicle } = useSelector((state: RootState) => state.vehicle);
    const [selectedFilter, setSelectedFilter] = useState("all");

    // Fetch bookings for the selected vehicle
    const { data, isLoading } = useGetBookingsQuery(
        { vehicle_id: selectedVehicle?.id || "" },
        { skip: !selectedVehicle?.id }
    );

    const bookings = data?.bookings || [];

    // Filter and Transform logic
    const ongoingServices = bookings
        .filter((b: Booking) => ["requested", "garage_assigned", "in_progress"].includes(b.status))
        .map((b: Booking) => ({
            providerName: "Garage Assigned",
            bookingId: b.id.substring(0, 8).toUpperCase(),
            serviceName: b.service?.name || "Car Service",
            vehicleNumber: b.vehicles?.registration_number || selectedVehicle?.registration_number || "",
            date: formatDate(b.scheduled_at),
            status: "Pending" as any,
            serviceColor: "text-theme-green",
            rawStatus: b.status,
            bookingIdFull: b.id
        }));

    const pastServices = bookings
        .filter((b: Booking) => ["completed", "cancelled"].includes(b.status))
        .map((b: Booking) => {
            const isCancelled = ['cancelled', 'cancelled_by_user', 'cancelled_by_garage'].includes(b.status);
            return {
                providerName: isCancelled ? "Service Cancelled" : "Service Completed",
                bookingId: b.id.substring(0, 8).toUpperCase(),
                serviceName: b.service?.name || "Car Service",
                vehicleNumber: b.vehicles?.registration_number || selectedVehicle?.registration_number || "",
                date: formatDate(b.scheduled_at),
                status: (isCancelled ? "Cancelled" : "Completed") as any,
                serviceColor: "text-muted-foreground",
                rawStatus: b.status,
                bookingIdFull: b.id
            };
        });

    const handleCardClick = (bookingId: string) => {
        if (!bookingId) return;
        router.push(`/booking/track/${bookingId}`);
    };

    if (!selectedVehicle) {
        return (
            <div className="min-h-screen bg-vehicle-card-bg flex items-center justify-center text-white">
                <div className="text-center">
                    <HistoryIcon className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Please select a vehicle to view history.</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-vehicle-card-bg flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-theme-green/20 border-t-theme-green rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Syncing history...</p>
                </div>
            </div>
        );
    }

    // Filter display lists based on selected filter
    const showPending = selectedFilter === "all" || selectedFilter === "pending";
    const showCompleted = selectedFilter === "all" || selectedFilter === "completed";
    const showCancelled = selectedFilter === "all" || selectedFilter === "cancelled";

    const filteredPastRows = pastServices.filter(s => {
        if (selectedFilter === "all") return true;
        if (selectedFilter === "completed") return s.status === "Completed";
        if (selectedFilter === "cancelled") return s.status === "Cancelled";
        return false;
    });

    return (
        <div className="min-h-screen bg-background pb-24 lg:pb-12 animate-slide-up overflow-x-hidden">
            <div className="max-w-3xl lg:max-w-7xl lg:mx-0 lg:px-12 mx-auto px-4 pt-8">

                {/* Common Header */}
                <PageHeader
                    title={<>Service <span className="text-theme-green">History</span></>}
                    subtitle="Timeline of your vehicle maintenance and repairs."
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

                {/* Content Sections */}
                <div className="space-y-16">

                    {/* Pending Section */}
                    {showPending && ongoingServices.length > 0 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <h2 className="text-xl font-black text-white uppercase italic tracking-tight shrink-0 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-amber-500" />
                                    Pending Services
                                </h2>
                                <div className="h-px bg-white/5 flex-1"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {ongoingServices.map((service: any, index: number) => (
                                    <ServiceHistoryCard
                                        key={index}
                                        {...service}
                                        onCardClick={() => handleCardClick(service.bookingIdFull)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Past Section */}
                    {(showCompleted || showCancelled || selectedFilter === "all") && (
                        <div className="space-y-6">
                            {(filteredPastRows.length > 0 || selectedFilter !== "all") && (
                                <div className="flex items-center gap-4">
                                    <h2 className="text-xl font-black text-white uppercase italic tracking-tight shrink-0 flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-theme-green" />
                                        {selectedFilter === "all" ? "Past Services" : `${selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)} Services`}
                                    </h2>
                                    <div className="h-px bg-white/5 flex-1"></div>
                                </div>
                            )}

                            {filteredPastRows.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredPastRows.map((service: any, index: number) => (
                                        <ServiceHistoryCard
                                            key={index}
                                            {...service}
                                            onCardClick={() => handleCardClick(service.bookingIdFull)}
                                        />
                                    ))}
                                </div>
                            ) : (selectedFilter === "completed" || selectedFilter === "cancelled") && (
                                <div className="bg-white/3 border border-dashed border-white/5 rounded-4xl p-16 text-center">
                                    <HistoryIcon className="w-12 h-12 text-gray-800 mx-auto mb-4 opacity-20" />
                                    <p className="text-gray-600 text-sm font-bold uppercase tracking-widest italic">
                                        No {selectedFilter} records found
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Empty State for Pending when Filtered */}
                    {selectedFilter === "pending" && ongoingServices.length === 0 && (
                        <div className="bg-white/3 border border-dashed border-white/5 rounded-4xl p-16 text-center">
                            <Clock className="w-12 h-12 text-gray-800 mx-auto mb-4 opacity-20" />
                            <p className="text-gray-600 text-sm font-bold uppercase tracking-widest italic">No pending services found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
