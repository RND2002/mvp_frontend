"use client";

import React from "react";
import { ServiceHistoryCard } from "@/app/components/common/ServiceHistory";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { useGetBookingsQuery, Booking } from "@/app/beService/booking-service";

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
        vehicleNumber: b.vehicle?.registration_number || selectedVehicle?.registration_number || "",
        date: new Date(b.created_at).toLocaleDateString(),
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
        vehicleNumber: b.vehicle?.registration_number || selectedVehicle?.registration_number || "", // Fallback
        date: new Date(b.created_at).toLocaleDateString(),
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
            <div className="max-w-4xl mx-auto px-4 pt-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    {/* Left Spacer to Center Title */}
                    <div className="w-10"></div>

                    <h1 className="text-lg font-bold text-center text-white uppercase">
                        My Services
                    </h1>
                </div>

                {/* Ongoing Service Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-white mb-4">
                        Ongoing Service
                    </h2>
                    {ongoingServices.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {ongoingServices.map((service: any, index: number) => (
                                <ServiceHistoryCard
                                    key={index}
                                    {...service}
                                    onCardClick={() => handleCardClick(service.bookingIdFull)}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm italic">No ongoing services.</p>
                    )}
                </div>

                {/* Last Services Section */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-4">
                        Last Services
                    </h2>
                    {lastServices.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {lastServices.map((service: any, index: number) => (
                                <ServiceHistoryCard
                                    key={index}
                                    {...service}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm italic">No past services.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
