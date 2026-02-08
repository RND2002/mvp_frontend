"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock, MapPin, Phone, MessageSquare, XCircle, Hash, Car, ReceiptText, Sparkles } from "lucide-react";
import { useGetBookingByIdQuery } from "@/app/beService/booking-service";
import { cn } from "@/lib/utils";

export default function BookingTrackingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const router = useRouter();

    const { data, isLoading, error } = useGetBookingByIdQuery(id, { skip: !id });
    const booking = data?.booking;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-vehicle-card-bg flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-theme-green/20 border-t-theme-green rounded-full animate-spin"></div>
                    <p className="font-bold tracking-widest text-xs uppercase">Loading Tracking Info...</p>
                </div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="min-h-screen bg-vehicle-card-bg flex items-center justify-center text-white flex-col p-6 text-center">
                <div className="w-20 h-20 bg-theme-red/10 rounded-full flex items-center justify-center mb-6">
                    <XCircle className="w-10 h-10 text-theme-red" />
                </div>
                <h2 className="text-xl font-bold mb-2">Booking Not Found</h2>
                <p className="text-gray-400 text-sm mb-8 max-w-xs">We couldn't find the booking details you're looking for.</p>
                <button
                    onClick={() => router.back()}
                    className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-sm hover:bg-white/10 transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const isCancelled = ['cancelled', 'cancelled_by_user', 'cancelled_by_garage'].includes(booking.status);
    const bookingStatusDisplay = booking.status.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

    const getEventTime = (eventTypes: string[]) => {
        const event = booking.events?.find((e: any) => eventTypes.includes(e.event_type));
        return event ? new Date(event.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-";
    };

    const isStepCompleted = (eventTypes: string[]) => {
        return booking.events?.some((e: any) => eventTypes.includes(e.event_type));
    };

    const timelineSteps = [
        { label: "Booking Requested", events: ["booking_created"] },
        { label: "Garage Assigned", events: ["garage_assigned", "garage_accepted"] },
        { label: "Inspection Done", events: ["inspection_completed"] },
        { label: "Work in Progress", events: ["work_in_progress", "service_started"] },
        { label: "Ready for Delivery", events: ["service_completed", "payment_completed"] },
    ];

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
            name: booking.garage?.name || (booking.service_center_id ? "Authorized Center" : "Pending Assignment"),
            rating: booking.garage?.rating || 4.8,
            address: booking.garage?.address || "Location will be shared once assigned",
            phone: booking.garage?.contact || ""
        },
        vehicle: {
            name: `${booking.vehicle?.brand} ${booking.vehicle?.model}` || "Vehicle",
            reg: booking.vehicle?.registration_number || ""
        },
        services: (booking.items && booking.items.length > 0)
            ? booking.items.map((item: any) => item.title)
            : (booking.service?.service_items && booking.service.service_items.length > 0)
                ? booking.service.service_items.map((item: any) => item.title)
                : [booking.service?.name || "Service"],
        totalEstimation: `₹${booking.estimated_price}`
    };

    return (
        <div className="min-h-screen bg-vehicle-card-bg pb-24">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-vehicle-card-bg/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-6">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                    </button>
                    <div>
                        <p className="text-theme-green text-[9px] font-black uppercase tracking-[0.2em] mb-0.5">Track Your Service</p>
                        <h1 className="text-lg font-bold text-white tracking-tight">Booking Details</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-xl mx-auto px-6 py-6 space-y-5">

                {/* Status Card */}
                <div className="relative bg-vehicle-card-bg border border-vehicle-card-border rounded-4xl p-6 shadow-xl shadow-black/40 overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-theme-green/5 rounded-full blur-[80px] -mr-24 -mt-24 pointer-events-none"></div>

                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div>
                            <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Current Progress</p>
                            <h2 className={cn(
                                "text-2xl font-black tracking-tighter uppercase",
                                isCancelled ? "text-theme-red" : "text-theme-green"
                            )}>
                                {trackingData.status}
                            </h2>
                        </div>
                        <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-1000",
                            isCancelled ? "bg-theme-red/10 border-theme-red/20" : "bg-theme-green/10 border-theme-green/20 animate-pulse"
                        )}>
                            {isCancelled ? (
                                <XCircle className="w-6 h-6 text-theme-red" />
                            ) : (
                                <Clock className="w-6 h-6 text-theme-green" />
                            )}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-6 relative pl-4 z-10">
                        {/* Connecting Line */}
                        <div className="absolute top-0 bottom-0 left-[23px] w-0.5 bg-white/5"></div>

                        {trackingData.timeline.map((step, idx) => (
                            <div key={idx} className="flex gap-5 items-start relative group">
                                <div className={cn(
                                    "w-3.5 h-3.5 rounded-full mt-1.5 relative z-10 border-4 border-vehicle-card-bg transition-all duration-500 shadow-lg shadow-black/50",
                                    step.completed || step.current ? "bg-theme-green scale-110" : "bg-gray-800"
                                )}>
                                    {(step.completed || step.current) && (
                                        <div className="absolute inset-0 bg-theme-green rounded-full animate-ping opacity-20"></div>
                                    )}
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className={cn(
                                        "text-[12px] font-black uppercase tracking-widest transition-colors duration-500",
                                        step.completed || step.current ? "text-white" : "text-gray-600"
                                    )}>
                                        {step.status}
                                    </h4>
                                    <p className="text-[9px] font-bold text-gray-500 tracking-wider">
                                        {step.completed ? step.time : "Pending"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Garage Info */}
                    <div className="bg-vehicle-card-bg border border-vehicle-card-border rounded-4xl p-5 shadow-xl shadow-black/40">
                        <div className="flex items-center gap-2 text-theme-green mb-4">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Partner Garage</span>
                        </div>

                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg font-black text-white">
                                {trackingData.garage.name[0]}
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white tracking-tight">{trackingData.garage.name}</h4>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <span className="text-theme-green text-[10px]">★</span>
                                    <span className="text-[10px] font-bold text-gray-400">{trackingData.garage.rating}</span>
                                </div>
                            </div>
                        </div>

                        {trackingData.garage.phone && (
                            <div className="grid grid-cols-2 gap-2 mb-5">
                                <button
                                    onClick={() => window.location.href = `tel:${trackingData.garage.phone}`}
                                    className="h-9 rounded-lg bg-white/5 border border-white/10 text-white font-bold text-[10px] flex items-center justify-center gap-1.5 hover:bg-white/10 transition-colors"
                                >
                                    <Phone className="w-3 h-3" /> CALL
                                </button>
                                <button
                                    onClick={() => window.open(`https://wa.me/${trackingData.garage.phone.replace(/[^0-9]/g, '')}`, '_blank')}
                                    className="h-9 rounded-lg bg-theme-green/10 border border-theme-green/20 text-theme-green font-bold text-[10px] flex items-center justify-center gap-1.5 hover:bg-theme-green/20 transition-colors"
                                >
                                    <MessageSquare className="w-3 h-3" /> CHAT
                                </button>
                            </div>
                        )}

                        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-black/20 border border-white/5 italic">
                            <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                                {trackingData.garage.address}
                            </p>
                        </div>
                    </div>

                    {/* Vehicle & Services */}
                    <div className="bg-vehicle-card-bg border border-vehicle-card-border rounded-4xl p-5 shadow-xl shadow-black/40 space-y-5">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-theme-green">
                                <Car className="w-3.5 h-3.5" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Service Details</span>
                            </div>
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                <p className="text-white font-black tracking-tighter text-base mb-0.5">{trackingData.vehicle.name.toUpperCase()}</p>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Hash className="w-2.5 h-2.5 text-gray-500" />
                                    <span className="text-[9px] font-bold tracking-widest uppercase">{trackingData.vehicle.reg}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {trackingData.services.map((service: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-2.5 px-0.5">
                                    <div className="w-1 h-1 rounded-full bg-theme-green/40"></div>
                                    <span className="text-[11px] font-bold text-gray-300 tracking-tight">{service}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                            <div className="flex items-center gap-2 text-gray-500">
                                <ReceiptText className="w-3.5 h-3.5" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Estimation</span>
                            </div>
                            <span className="text-xl font-black text-theme-green tracking-tighter">{trackingData.totalEstimation}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                        <Hash className="w-3.5 h-3.5 text-gray-500" />
                        <div>
                            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Booking ID</p>
                            <p className="text-[10px] font-bold text-white tracking-widest uppercase">{id.substring(0, 12)}...</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                        <div>
                            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Est. Pickup</p>
                            <p className="text-[10px] font-bold text-white tracking-widest">TBD</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
