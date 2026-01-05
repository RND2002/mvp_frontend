
"use client";

import React, { useState } from "react";
import { ServiceDiscovery } from "@/app/book-service/components/ServiceDiscovery";
import { ServiceDetail } from "@/app/book-service/components/ServiceDetail";
import { ConfirmationSheet } from "@/app/book-service/components/ConfirmationSheet";
import { SuccessView } from "@/app/book-service/components/SuccessView";

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

    const handleConfirmBooking = () => {
        // Here we would call the API
        setStep("success");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#091A23] via-[#0D212C] to-[#000000]">

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
                />
            )}

            {step === "success" && (
                <SuccessView />
            )}

        </div>
    );
}
