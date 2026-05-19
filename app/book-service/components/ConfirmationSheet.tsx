
"use client";

import React from "react";
import { X, MapPin, Calendar, CreditCard, ChevronRight } from "lucide-react";
import Image from "next/image";

interface ConfirmationSheetProps {
    bookingDetails: any;
    onConfirm: () => void;
    onCancel: () => void;
    onEdit: () => void;
    isLoading?: boolean;
}
export const ConfirmationSheet: React.FC<ConfirmationSheetProps> = ({
    bookingDetails,
    onConfirm,
    onCancel,
    onEdit,
    isLoading
}) => {
    if (!bookingDetails) return null;
    console.log(bookingDetails)

    const { service, vehicle, mechanic, priceRange, mode } = bookingDetails;
    const estimatedTotal = bookingDetails.priceRange.min + 50; // Mock calculation

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                onClick={onCancel}
            ></div>

            {/* Sheet Content */}
            <div className="relative w-full max-w-lg bg-bg-secondary rounded-t-[2rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 border-t border-border-default">

                <div className="p-6 pb-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-text-primary">Confirm Booking</h2>
                        <button
                            onClick={onCancel}
                            className="w-8 h-8 rounded-full bg-bg-tertiary flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Service Summary Card */}
                    <div className="bg-bg-primary rounded-2xl p-4 border border-border-default mb-6 flex gap-4">
                        <div className="w-16 h-16 rounded-xl bg-bg-tertiary shrink-0 overflow-hidden relative">
                            {/* Fallback icon or image */}
                            <div className={`absolute inset-0 flex items-center justify-center ${service?.color || 'bg-bg-tertiary'}`}>
                                <span className="text-xs font-bold">{(service?.label || service?.name || "?")[0]}</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-text-primary text-lg">{service?.label || service?.name}</h3>
                            <p className="text-text-secondary text-sm">{vehicle.name} · {vehicle.reg}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-xl font-bold text-text-primary">${priceRange.min}</div>
                            <div className="text-xs text-text-secondary">Est. Price</div>
                        </div>
                    </div>

                    {/* Details List */}
                    <div className="space-y-4 mb-8">
                        <div className="flex items-center justify-between py-2 border-b border-border-default">
                            <div className="flex items-center gap-3 text-text-primary">
                                <div className="w-8 h-8 rounded-full bg-bg-tertiary flex items-center justify-center">
                                    <MapPin className="w-4 h-4 text-theme-amber" />
                                </div>
                                <span className="font-medium text-sm">Location</span>
                            </div>
                            <span className="text-text-primary font-semibold text-sm">
                                {mode === 'location' ? 'Home Service' : 'Pickup & Drop'}
                            </span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-border-default">
                            <div className="flex items-center gap-3 text-text-primary">
                                <div className="w-8 h-8 rounded-full bg-bg-tertiary flex items-center justify-center">
                                    <CreditCard className="w-4 h-4 text-theme-amber" />
                                </div>
                                <span className="font-medium text-sm">Payment</span>
                            </div>
                            <span className="text-text-primary font-semibold text-sm">Pay after service</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onEdit}
                            className="flex-1 py-4 bg-bg-tertiary text-text-primary font-semibold rounded-[6px] border border-border-default hover:bg-bg-tertiary/80 transition-colors"
                        >
                            Edit
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`flex-[2] cursor-pointer py-4 bg-theme-amber text-black font-semibold rounded-[6px] hover:bg-theme-amber-hover transition-colors flex items-center justify-center gap-2 group ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <>Processing...</>
                            ) : (
                                <>
                                    Confirm Booking
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};
