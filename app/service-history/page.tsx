"use client";

import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { useRouter } from "next/navigation";
import { PillFilters, FilterItem } from "../components/common/PillFilters";
import {
    History as HistoryIcon,
    CheckCircle2,
} from "lucide-react";
import { PageHeader } from "@/app/components/common/PageHeader";
import { Loader } from "@/components/ui/loader";
import { useGetBookingsQuery } from "../beService/booking-service";
import { ServiceHistoryCard } from "@/app/components/common/ServiceHistory";

const FILTER_ITEMS: FilterItem[] = [
    { id: "Pending", label: "Pending" },
    { id: "Completed", label: "Completed" },
    { id: "Cancelled", label: "Cancelled" },
];

const getBookingGroupStatus = (status: string): "Pending" | "Completed" | "Cancelled" => {
    const s = status.toLowerCase();
    if (s.includes("cancelled")) return "Cancelled";
    if (s === "completed" || s === "payment_completed") return "Completed";
    return "Pending";
};

export default function ServiceHistoryPage() {
    const { selectedVehicle } = useSelector((state: RootState) => state.vehicle);
    const router = useRouter();
    const [selectedFilter, setSelectedFilter] = useState("Pending");

    const { data, isLoading } = useGetBookingsQuery(
        { vehicle_id: selectedVehicle?.id || "" },
        { skip: !selectedVehicle?.id }
    );

    if (!selectedVehicle?.id) {
        return (
            <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
                <div className="text-center">
                    <HistoryIcon className="w-12 h-12 text-[#94A3B8] mx-auto mb-4" />
                    <p className="text-[#475569] font-bold uppercase tracking-widest text-sm">
                        Please select a vehicle to view history.
                    </p>
                </div>
            </div>
        );
    }

    const bookings = data?.bookings || [];

    const sortedBookings = useMemo(() => {
        return [...bookings].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }, [bookings]);

    const filteredBookings = useMemo(() => {
        return sortedBookings.filter((booking) => getBookingGroupStatus(booking.status) === selectedFilter);
    }, [sortedBookings, selectedFilter]);

    return (
        <div className="min-h-screen bg-[#F8F9FB] pb-24 lg:pb-12 animate-slide-up overflow-x-hidden">
            <div className="max-w-3xl lg:max-w-7xl lg:mx-0 lg:px-12 mx-auto px-4 pt-8">

                {/* Common Header */}
                <PageHeader
                    title={<>Booking <span className="text-theme-green">History</span></>}
                    subtitle="Track and review all services and customization history for your vehicle."
                    backUrl="/dashboard"
                />

                {/* Pill Filters */}
                <div className="mt-8 mb-6">
                    <PillFilters
                        items={FILTER_ITEMS}
                        selectedId={selectedFilter}
                        onSelect={setSelectedFilter}
                    />
                </div>

                <div className="space-y-6">
                    {isLoading && (
                        <div className="flex justify-center py-8">
                            <Loader size="md" />
                        </div>
                    )}

                    {!isLoading && filteredBookings.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredBookings.map((booking) => {
                                const formattedDate = new Date(booking.scheduled_at || booking.created_at).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true
                                });

                                return (
                                    <ServiceHistoryCard
                                        key={booking.id}
                                        providerName={booking.garage?.name || (booking.service_center_id ? "Authorized Service Center" : "Pending Assignment")}
                                        bookingId={booking.id.substring(0, 8).toUpperCase()}
                                        serviceName={booking.service?.name || "General Service"}
                                        vehicleNumber={selectedVehicle.registration_number || ""}
                                        date={formattedDate}
                                        status={getBookingGroupStatus(booking.status)}
                                        onCardClick={() => router.push(`/booking/track/${booking.id}`)}
                                        onInvoiceClick={() => router.push(`/booking/track/${booking.id}`)}
                                    />
                                );
                            })}
                        </div>
                    )}

                    {!isLoading && filteredBookings.length === 0 && (
                        <div className="bg-white border border-dashed border-[#E4E7EC] rounded-4xl p-16 text-center">
                            <HistoryIcon className="w-12 h-12 text-[#94A3B8] mx-auto mb-4 opacity-40 animate-pulse" />
                            <p className="text-[#475569] text-sm font-bold uppercase tracking-widest italic">
                                No bookings found for this filter
                            </p>
                        </div>
                    )}

                    {!isLoading && bookings.length > 0 && (
                        <div className="flex items-center gap-3 text-xs text-[#475569] pt-4">
                            <CheckCircle2 className="w-4 h-4 text-theme-green" />
                            <span>Showing {selectedFilter.toLowerCase()} records for {selectedVehicle.brand} {selectedVehicle.model}.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
