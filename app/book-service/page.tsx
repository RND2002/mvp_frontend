
"use client";

import React, { useState } from "react";
import { ServiceDiscovery } from "@/app/book-service/components/ServiceDiscovery";
import { ServiceDetail } from "@/app/book-service/components/ServiceDetail";
import { ConfirmationSheet } from "@/app/book-service/components/ConfirmationSheet";
import { SuccessView } from "@/app/book-service/components/SuccessView";
import { useCreateBookingMutation } from "@/app/beService/booking-service";
import { toast } from "sonner";

export default function BookServicePage() {
    const [step, setStep] = useState<"discovery" | "detail" | "confirmation" | "success">("discovery");
    const [selectedService, setSelectedService] = useState<any>(null);
    const [bookingDetails, setBookingDetails] = useState<any>(null);

    const handleServiceSelect = (service: any) => {
        setSelectedService(service);
        setStep("detail");
    };

    const handleDetailBack = () => {
        setStep("discovery");
        setSelectedService(null);
    };

    const handleProceedToConfirmation = (details: any) => {
        setBookingDetails(details);
        setStep("confirmation");
    };

    const handleConfirmationCancel = () => {
        setStep("discovery"); // Or detail, but usually fully cancelling goes back out or to detail. Let's go to discovery to be safe or detail if we want to retain state.
        // If we want to go back to detail:
        // setStep("detail");
        // But user might want to cancel everything. Let's go back to discovery for now.
    };

    const handleConfirmationEdit = () => {
        setStep("detail");
    };

    const [createBooking, { isLoading: isBookingLoading }] = useCreateBookingMutation();

    const handleConfirmBooking = async () => {
        if (!bookingDetails?.bookingRequest) return;

        console.log("DEBUG: Final Booking Payload being sent (V3):", bookingDetails.bookingRequest);
        try {
            const result = await createBooking(bookingDetails.bookingRequest).unwrap();
            setStep("success");
            toast.success("Booking created successfully");
        } catch (error) {
            console.error("Booking creation failed:", error);
            toast.error("Failed to create booking. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB] text-[#0F172A]">

            {step === "discovery" && (
                <ServiceDiscovery onServiceSelect={handleServiceSelect} />
            )}

            {step === "detail" && selectedService && (
                <ServiceDetail
                    service={selectedService}
                    onBack={handleDetailBack}
                    onProceed={handleProceedToConfirmation}
                />
            )}

            {step === "confirmation" && bookingDetails && (
                <ConfirmationSheet
                    bookingDetails={bookingDetails}
                    onConfirm={handleConfirmBooking}
                    onCancel={handleConfirmationCancel}
                    onEdit={handleConfirmationEdit}
                    isLoading={isBookingLoading}
                />
            )}

            {step === "success" && (
                <SuccessView />
            )}

        </div>
    );
}
