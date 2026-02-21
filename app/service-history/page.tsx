"use client";

import React from "react";
import { ServiceHistoryCard } from "@/app/components/common/ServiceHistory";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { useGetBookingsQuery, Booking } from "@/app/beService/booking-service";
import { formatDate } from "@/lib/utils";

export default function ServiceHistoryPage() {
    const router = useRouter();
    const { selectedVehicle } = useSelector((state: RootState) => state.vehicle);

    // Fetch bookings for the selected vehicle
    const { data, isLoading } = useGetBookingsQuery(
        { vehicle_id: selectedVehicle?.id || "" },
        { skip: !selectedVehicle?.id }
    );

    const bookings = data?.bookings || [];

    // Filter bookings
    const ongoingServices = bookings.filter((b: Booking) =>
        ["requested", "garage_assigned", "in_progress"].includes(b.status)
    ).map((b: Booking) => ({
        providerName: "Garage Assigned", // Placeholder until garage name is available
        bookingId: b.id.substring(0, 8).toUpperCase(),
        serviceName: b.service?.name || "Car Service",
        vehicleNumber: b.vehicles?.registration_number || selectedVehicle?.registration_number || "",
        date: formatDate(b.scheduled_at),
        status: "Pending" as any,
        serviceColor: "text-theme-green",
        rawStatus: b.status,
        bookingIdFull: b.id
    }));


    const lastServices = bookings.filter((b: Booking) =>
        ["completed", "cancelled"].includes(b.status)
    ).map((b: Booking) => ({
        providerName: "Service Completed",
        bookingId: b.id.substring(0, 8).toUpperCase(),
        serviceName: b.service?.name || "Car Service",
        vehicleNumber: b.vehicles?.registration_number || selectedVehicle?.registration_number || "", // Fallback
        date: formatDate(b.scheduled_at),
        status: (['cancelled', 'cancelled_by_user', 'cancelled_by_garage'].includes(b.status) ? "Cancelled" : (b.status === "completed" || b.status === "payment_completed" ? "Completed" : "Paid")) as any,
        serviceColor: "text-muted-foreground",
        rawStatus: b.status,
        bookingIdFull: b.id
    }));

    const handleCardClick = (bookingId: string) => {
        if (!bookingId) return;
        router.push(`/booking/track/${bookingId}`);
    };

    if (!selectedVehicle) {
        return (
            <div className="min-h-screen bg-vehicle-card-bg flex items-center justify-center text-white">
                <p>Please select a vehicle to view history.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-vehicle-card-bg flex items-center justify-center text-white">
                <p>Loading history...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-vehicle-card-bg pb-24 md:pb-10">
            <div className="max-w-4xl mx-auto px-6 pt-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    {/* <p className="text-theme-green text-[9px] font-black uppercase tracking-[0.3em] mb-1.5">Activities</p> */}
                    <h1 className="text-2xl font-bold text-white tracking-tighter uppercase">
                        Service History
                    </h1>
                </div>

                {/* Ongoing Service Section */}
                <div className="mb-10">
                    <div className="flex items-center gap-2.5 mb-5">
                        <div className="h-px flex-1 bg-white/5"></div>
                        <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.25em] whitespace-nowrap">
                            Ongoing Services
                        </h2>
                        <div className="h-px flex-1 bg-white/5"></div>
                    </div>
                    {ongoingServices.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {ongoingServices.map((service: any, index: number) => (
                                <ServiceHistoryCard
                                    key={index}
                                    {...service}
                                    onCardClick={() => handleCardClick(service.bookingIdFull)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-8 text-center">
                            <p className="text-gray-500 text-xs font-bold tracking-tight">No active services at the moment</p>
                        </div>
                    )}
                </div>

                {/* Last Services Section */}
                <div>
                    <div className="flex items-center gap-2.5 mb-5">
                        <div className="h-px flex-1 bg-white/5"></div>
                        <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.25em] whitespace-nowrap">
                            Past Services
                        </h2>
                        <div className="h-px flex-1 bg-white/5"></div>
                    </div>
                    {lastServices.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {lastServices.map((service: any, index: number) => (
                                <ServiceHistoryCard
                                    key={index}
                                    {...service}
                                    onCardClick={() => handleCardClick(service.bookingIdFull)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-8 text-center">
                            <p className="text-gray-500 text-xs font-bold tracking-tight">Your service history will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
