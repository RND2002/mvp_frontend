"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock, MapPin, Phone, MessageSquare, XCircle, Hash, Car, ReceiptText, Sparkles } from "lucide-react";
import { useGetBookingByIdQuery } from "@/app/beService/booking-service";
import { cn } from "@/lib/utils";
import { socket, joinBookingRoom, leaveBookingRoom } from "@/lib/socket";
import { toast } from "sonner";
import { PageHeader } from "@/app/components/common/PageHeader";
import { Loader } from "@/components/ui/loader";

export default function BookingTrackingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const router = useRouter();

    const { data, isLoading, error, refetch } = useGetBookingByIdQuery(id, { skip: !id });
    const booking = data?.booking;

    React.useEffect(() => {
        if (!id) return;

        console.log(`[Socket] Setting up listeners for booking: ${id}`);

        // Join the booking room for real-time updates
        joinBookingRoom(id);

        // Generic update handler that uses payload description
        const handleUpdate = (update: any) => {
            console.log("[Socket] Received 'bookingUpdate':", update);
            refetch();
            if (update.description) {
                const isSuccess = update.type === "COMPLETED" || update.type === "GARAGE_ASSIGNED";
                const isError = update.type?.includes("CANCELLED");

                if (isSuccess) {
                    toast.success(update.description);
                } else if (isError) {
                    toast.error(update.description);
                } else {
                    toast.info(update.description);
                }
            }
        };

        // Standard socket events for debugging
        const onConnect = () => console.log("[Socket] Connected to backend");
        const onDisconnect = (reason: any) => console.log("[Socket] Disconnected from backend:", reason);
        const onConnectError = (err: any) => console.error("[Socket] Connection error:", err);

        socket.on("bookingUpdate", handleUpdate);
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("connect_error", onConnectError);

        // Cleanup: leave the room and stop listening when the component unmounts
        return () => {
            console.log(`[Socket] Cleaning up listeners for booking: ${id}`);
            leaveBookingRoom(id);
            socket.off("bookingUpdate", handleUpdate);
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("connect_error", onConnectError);
        };
    }, [id, refetch]);


    if (isLoading) {
        return (
            <div className="min-h-screen bg-primary-theme pb-20">
                <div className="max-w-7xl px-6 py-6 pb-2">
                    <PageHeader
                        title={<>Tracking <span className="text-theme-green">Progress</span></>}
                        subtitle="Track your vehicle service in real-time"
                        className="mb-0"
                    />
                </div>
                <main className="max-w-7xl px-6 pb-20">
                    <div className="flex justify-center py-12">
                        <Loader size="md" />
                    </div>
                </main>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="min-h-screen bg-primary-theme flex items-center justify-center text-white flex-col p-6 text-center">
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
        const event = booking.booking_events?.find((e: any) =>
            eventTypes.some(type => type.toLowerCase() === e.event_type.toLowerCase())
        );
        return event ? new Date(event.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-";
    };

    const timelineSteps = [
        { label: "Booking Requested", events: ["booking_created"] },
        { label: "Garage Assigned", events: ["garage_assigned", "garage_accepted"] },
        { label: "Inspection Done", events: ["inspection_completed"] },
        { label: "Service Started", events: ["service_started"] },
        { label: "Work in Progress", events: ["work_in_progress"] },
        { label: "Ready for Delivery", events: ["service_completed", "payment_completed"] },
    ];

    const isStepCompleted = (eventTypes: string[]) => {
        return !!booking.booking_events?.some((e: any) =>
            eventTypes.some(type => type.toLowerCase() === (e.event_type || "").toLowerCase())
        );
    };

    // Robust mapping of status to step index with fuzzy matching
    const statusToStepIndex = (status: string): number => {
        if (!status) return -1;
        const s = status.toLowerCase().trim();

        if (s === "completed" || s === "ready_for_delivery" || s === "payment_completed" || s === "service_completed") return 5;
        if (s === "work_in_progress") return 4;
        if (s === "service_started" || s === "in_progress") return 3;
        if (s === "inspection_completed" || s === "inspection") return 2;
        if (s === "garage_assigned" || s === "garage_accepted") return 1;
        if (s === "booking_created" || s === "requested") return 0;

        return -1;
    };

    const statusBaselineIndex = statusToStepIndex(booking.status);
    console.log("[Booking Tracking] Status Baseline Index:", statusBaselineIndex);

    let currentStepIndex = -1;
    for (let i = timelineSteps.length - 1; i >= 0; i--) {
        const stepHasEvents = isStepCompleted(timelineSteps[i].events);
        if (stepHasEvents || i === statusBaselineIndex) {
            currentStepIndex = i;
            break;
        }
    }

    // Always ensure at least the first step is active if the booking exists
    if (currentStepIndex === -1 && booking) {
        currentStepIndex = 0;
    }

    // If we're further along by status than events show, use the status index
    if (currentStepIndex < statusBaselineIndex) {
        currentStepIndex = statusBaselineIndex;
    }

    console.log("[Booking Tracking] Calculated Current Step Index:", currentStepIndex);

    const trackingData = {
        status: bookingStatusDisplay,
        timeline: timelineSteps.map((step, index) => ({
            status: step.label,
            time: getEventTime(step.events),
            completed: isStepCompleted(step.events) || index < currentStepIndex,
            current: index === currentStepIndex
        })),
        garage: {
            name: booking.garage?.name || (booking.service_center_id ? "Authorized Center" : "Pending Assignment"),
            rating: booking.garage?.rating || 4.8,
            address: booking.garage?.address || "Location will be shared once assigned",
            phone: booking.garage?.contact || ""
        },
        vehicle: {
            name: `${booking.vehicles?.brand} ${booking.vehicles?.model}` || "Vehicle",
            reg: booking.vehicles?.registration_number || ""
        },
        services: (booking.booking_items && booking.booking_items.length > 0)
            ? booking.booking_items.map((item: any) => item.title)
            : (booking.service?.service_items && booking.service.service_items.length > 0)
                ? booking.service.service_items.map((item: any) => item.title)
                : [booking.service?.name || "Service"],
        totalEstimation: `₹${booking.estimated_price}`
    };

    return (
        <div className="min-h-screen bg-primary-theme pb-20">
            <div className="max-w-7xl px-6 py-6 pb-2">
                <PageHeader
                    title={<>Tracking <span className="text-theme-green">Progress</span></>}
                    subtitle="Track your vehicle service in real-time"
                    className="mb-0"
                />
            </div>

            <main className="max-w-7xl px-6 pb-20">
                {/* Content */}
                {booking && (
                    <div className="flex flex-col lg:flex-row gap-8 items-start">

                        {/* LEFT COLUMN: Progress Tracking */}
                        <div className="flex-1 w-full space-y-6">
                            {/* Status Card */}
                            <div className="relative bg-primaryCard border border-secondary-theme rounded-4xl p-8 shadow-xl shadow-black/40 overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-theme-green/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>

                                <div className="flex justify-between items-start mb-10 relative z-10">
                                    <div>
                                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Current Progress</p>
                                        <h2 className={cn(
                                            "text-3xl md:text-4xl font-black tracking-tighter uppercase",
                                            isCancelled ? "text-theme-red" : "text-theme-green"
                                        )}>
                                            {trackingData.status}
                                        </h2>
                                    </div>
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-1000",
                                        isCancelled ? "bg-theme-red/10 border-theme-red/20" : "bg-theme-green/10 border-theme-green/20 animate-pulse"
                                    )}>
                                        {isCancelled ? (
                                            <XCircle className="w-7 h-7 text-theme-red" />
                                        ) : (
                                            <Clock className="w-7 h-7 text-theme-green" />
                                        )}
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div className="space-y-8 relative pl-6 z-10 py-2">
                                    {/* Connecting Line */}
                                    <div className="absolute top-0 bottom-0 left-[30px] w-0.5 bg-white/5"></div>

                                    {trackingData.timeline.map((step, idx) => (
                                        <div key={idx} className="flex gap-6 items-start relative group">
                                            <div className={cn(
                                                "w-4 h-4 rounded-full mt-1.5 relative z-10 border-4 border-primary-theme transition-all duration-500 shadow-lg shadow-black/50",
                                                step.completed || step.current ? "bg-theme-green scale-110" : "bg-gray-800"
                                            )}>
                                                {(step.completed || step.current) && (
                                                    <div className="absolute inset-0 bg-theme-green rounded-full animate-ping opacity-20"></div>
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className={cn(
                                                    "text-[13px] font-black uppercase tracking-widest transition-colors duration-500",
                                                    step.completed || step.current ? "text-white" : "text-gray-600"
                                                )}>
                                                    {step.status}
                                                </h4>
                                                <p className="text-[10px] font-bold text-gray-500 tracking-wider">
                                                    {step.completed ? step.time : "Pending"}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Contact & Details Sidebar */}
                        <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 space-y-6 lg:sticky lg:top-28">

                            {/* Garage Info */}
                            <div className="bg-primaryCard border border-secondary-theme rounded-4xl p-6 shadow-xl shadow-black/40">
                                <div className="flex items-center gap-2 text-theme-green mb-5">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Partner Garage</span>
                                </div>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-black text-white">
                                        {trackingData.garage.name[0]}
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-white tracking-tight">{trackingData.garage.name}</h4>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <span className="text-theme-green text-xs">★</span>
                                            <span className="text-xs font-bold text-gray-400">{trackingData.garage.rating}</span>
                                        </div>
                                    </div>
                                </div>

                                {trackingData.garage.phone && (
                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        <button
                                            onClick={() => window.location.href = `tel:${trackingData.garage.phone}`}
                                            className="h-11 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                                        >
                                            <Phone className="w-3.5 h-3.5" /> CALL
                                        </button>
                                        <button
                                            onClick={() => window.open(`https://wa.me/${trackingData.garage.phone.replace(/[^0-9]/g, '')}`, '_blank')}
                                            className="h-11 rounded-xl bg-theme-green/10 border border-theme-green/20 text-theme-green font-bold text-xs flex items-center justify-center gap-2 hover:bg-theme-green/20 transition-colors"
                                        >
                                            <MessageSquare className="w-3.5 h-3.5" /> CHAT
                                        </button>
                                    </div>
                                )}

                                <div className="flex items-start gap-3 p-4 rounded-2xl bg-black/20 border border-white/5 italic">
                                    <MapPin className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                                    <p className="text-xs text-gray-400 font-medium leading-relaxed">
                                        {trackingData.garage.address}
                                    </p>
                                </div>
                            </div>

                            {/* Vehicle & Services */}
                            <div className="bg-primaryCard border border-secondary-theme rounded-4xl p-6 shadow-xl shadow-black/40 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-theme-green">
                                        <Car className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Service Details</span>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                        <p className="text-white font-black tracking-tighter text-lg mb-1">{trackingData.vehicle.name.toUpperCase()}</p>
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <Hash className="w-3 h-3 text-gray-500" />
                                            <span className="text-[10px] font-bold tracking-widest uppercase">{trackingData.vehicle.reg}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 px-1">
                                    {trackingData.services.map((service: string, idx: number) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-theme-green/40"></div>
                                            <span className="text-xs font-bold text-gray-300 tracking-tight">{service}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-5 border-t border-white/5 flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <ReceiptText className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Estimation</span>
                                    </div>
                                    <span className="text-2xl font-black text-theme-green tracking-tighter">{trackingData.totalEstimation}</span>
                                </div>
                            </div>

                            {/* Booking Meta */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Hash className="w-3.5 h-3.5" />
                                        <span className="text-[8px] font-black uppercase tracking-widest">Booking ID</span>
                                    </div>
                                    <p className="text-[11px] font-bold text-white tracking-widest uppercase truncate">{id.substring(0, 14)}...</p>
                                </div>
                                <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span className="text-[8px] font-black uppercase tracking-widest">Est. Pickup</span>
                                    </div>
                                    <p className="text-[11px] font-bold text-white tracking-widest">TBD</p>
                                </div>
                            </div>
                        </div>

                    </div>
                )}

            </main>
        </div>
    );
}
