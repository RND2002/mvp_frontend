"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock, MapPin, Phone, MessageSquare, XCircle } from "lucide-react";
import { useGetBookingByIdQuery } from "@/app/beService/booking-service";

export default function BookingTrackingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const router = useRouter();

    const { data, isLoading, error } = useGetBookingByIdQuery(id, { skip: !id });
    const booking = data?.booking;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-vehicle-card-bg flex items-center justify-center text-white">
                <p>Loading tracking info...</p>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="min-h-screen bg-vehicle-card-bg flex items-center justify-center text-white flex-col">
                <p className="mb-4">Booking not found or error loading data.</p>
                <button onClick={() => router.back()} className="ml-4 underline text-primary">Go Back</button>
            </div>
        );
    }

    const isCancelled = ['cancelled', 'cancelled_by_user', 'cancelled_by_garage'].includes(booking.status);
    const bookingStatusDisplay = booking.status.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

    // Helper to get event time
    const getEventTime = (eventTypes: string[]) => {
        const event = booking.events?.find((e: any) => eventTypes.includes(e.event_type));
        return event ? new Date(event.created_at).toLocaleString() : "-";
    };

    // Helper to check if step is completed
    const isStepCompleted = (eventTypes: string[]) => {
        return booking.events?.some((e: any) => eventTypes.includes(e.event_type));
    };

    // Define timeline definition
    const timelineSteps = [
        { label: "Booking Requested", events: ["booking_created"] },
        { label: "Garage Assigned", events: ["garage_assigned", "garage_accepted"] },
        { label: "Inspection Done", events: ["inspection_completed"] },
        { label: "Work in Progress", events: ["work_in_progress", "service_started"] },
        { label: "Ready for Delivery", events: ["service_completed", "payment_completed"] },
    ];

    // Find current active step index for highlighting
    let currentStepIndex = -1;
    for (let i = timelineSteps.length - 1; i >= 0; i--) {
        if (isStepCompleted(timelineSteps[i].events)) {
            currentStepIndex = i;
            break;
        }
    }

    const trackingData = {
        status: bookingStatusDisplay,
        timeline: timelineSteps.map((step, index) => ({
            status: step.label,
            time: getEventTime(step.events),
            completed: isStepCompleted(step.events),
            current: index === currentStepIndex
        })),
        garage: {
            name: booking.service_center_id ? "Authorized Center" : "Pending Assignment",
            rating: 4.8,
            address: "Garaged Location Info",
            phone: "+91 98765 43210"
        },
        order: {
            id: booking.id,
            date: new Date(booking.created_at).toLocaleDateString(),
            total: `₹${booking.estimated_price}`
        },
        vehicle: {
            name: `${booking.vehicle?.brand} ${booking.vehicle?.model}` || "Vehicle",
            reg: booking.vehicle?.registration_number || ""
        },
        // Display booking items if available, else master service items, else service name
        services: (booking.items && booking.items.length > 0)
            ? booking.items.map((item: any) => item.title)
            : (booking.service?.service_items && booking.service.service_items.length > 0)
                ? booking.service.service_items.map((item: any) => item.title)
                : [booking.service?.name || "Service"],
        totalEstimation: `₹${booking.estimated_price}`
    };

    return (
        <div className="min-h-screen bg-vehicle-card-bg pb-20" >
            {/* Header */}
            < div className="bg-vehicle-card-bg shadow-sm border-b border-vehicle-card-border sticky top-0 z-10" >
                <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-white">Track Booking</h1>
                        <p className="text-xs text-gray-400">ID: {id}</p>
                    </div>
                </div>
            </div >

            <div className="max-w-md mx-auto px-4 py-6 space-y-6">

                {/* Status Card */}
                <div className="bg-vehicle-card-bg/30 rounded-3xl p-6 border border-vehicle-card-border/30 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-sm text-gray-400 font-medium mb-1">Current Status</p>
                            <h2 className={`text-2xl font-bold ${isCancelled ? "text-red-500" : "text-primary"}`}>
                                {trackingData.status}
                            </h2>
                        </div>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isCancelled ? "bg-red-500/20" : "bg-primary/20 animate-pulse"}`}>
                            {isCancelled ? (
                                <XCircle className="w-6 h-6 text-red-500" />
                            ) : (
                                <Clock className="w-6 h-6 text-primary" />
                            )}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-6 relative pl-2">
                        {/* Connecting Line */}
                        <div className="absolute top-2 bottom-2 left-[19px] w-0.5 bg-gray-700 -z-10"></div>

                        {trackingData.timeline.map((step, idx) => (
                            <div key={idx} className="flex gap-4 items-start relative z-0">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 border-vehicle-card-bg/30 ${step.completed ? "bg-primary text-primary-foreground" :
                                    step.current ? "bg-primary text-primary-foreground" : "bg-gray-800 text-gray-500"
                                    }`}>
                                    {step.completed ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-3 h-3 rounded-full bg-current" />}
                                </div>
                                <div className="pt-2">
                                    <h4 className={`text-sm font-bold ${step.completed || step.current ? "text-white" : "text-gray-500"}`}>
                                        {step.status}
                                    </h4>
                                    <p className="text-xs text-gray-500">{step.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Garage Info */}
                <div className="bg-vehicle-card-bg/30 rounded-3xl p-6 border border-vehicle-card-border/30 shadow-sm">
                    <h3 className="text-lg font-bold text-white mb-4">Garage Assigned</h3>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center text-lg font-bold text-white border border-vehicle-card-border/30">
                            {trackingData.garage.name[0]}
                        </div>
                        <div>
                            <h4 className="font-bold text-white">{trackingData.garage.name}</h4>
                            <p className="text-xs text-gray-400">Rating: {trackingData.garage.rating} ★</p>
                        </div>
                    </div>

                    <div className="flex gap-3 mb-4">
                        <button className="flex-1 py-3 rounded-xl bg-black/20 hover:bg-black/30 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors border border-vehicle-card-border/30">
                            <Phone className="w-4 h-4" /> Call
                        </button>
                        <button className="flex-1 py-3 rounded-xl bg-black/20 hover:bg-black/30 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors border border-vehicle-card-border/30">
                            <MessageSquare className="w-4 h-4" /> Chat
                        </button>
                    </div>

                    <div className="flex items-start gap-2 text-sm text-gray-400 bg-black/20 p-3 rounded-xl border border-vehicle-card-border/30">
                        <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                        {trackingData.garage.address}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-vehicle-card-bg/30 rounded-3xl p-6 border border-vehicle-card-border/30 shadow-sm">
                    <h3 className="text-lg font-bold text-white mb-4">Order Details</h3>
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-vehicle-card-border">
                        <span className="text-gray-400 text-sm">Vehicle</span>
                        <div className="text-right">
                            <div className="font-bold text-white">{trackingData.vehicle.name}</div>
                            <div className="text-xs text-gray-400">{trackingData.vehicle.reg}</div>
                        </div>
                    </div>

                    <div className="space-y-3 mb-4">
                        {trackingData.services.map((service: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div>
                                <span className="text-sm text-gray-300">{service}</span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-vehicle-card-border flex justify-between items-center">
                        <span className="font-semibold text-white">Estimated Total</span>
                        <span className="font-bold text-xl text-primary">{trackingData.totalEstimation}</span>
                    </div>
                </div>

            </div>
        </div >
    );
}
