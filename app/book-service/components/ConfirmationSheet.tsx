
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
            <div className="relative w-full max-w-lg bg-[#1A2C35] rounded-t-[2rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 border-t border-slate-700">

                <div className="p-6 pb-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">Confirm Booking</h2>
                        <button
                            onClick={onCancel}
                            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Service Summary Card */}
                    <div className="bg-[#122026] rounded-2xl p-4 border border-slate-700 mb-6 flex gap-4">
                        <div className="w-16 h-16 rounded-xl bg-slate-800 shrink-0 overflow-hidden relative">
                            {/* Fallback icon or image */}
                            <div className={`absolute inset-0 flex items-center justify-center ${service?.color || 'bg-slate-700'}`}>
                                {/* Since we might not have the icon component directly serializable, we can use a generic fallback or pass it differently. 
                                   For now, trusting the color. */}
                                <span className="text-xs font-bold">{(service?.label || service?.name || "?")[0]}</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-white text-lg">{service?.label || service?.name}</h3>
                            <p className="text-slate-400 text-sm">{vehicle.name} · {vehicle.reg}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-xl font-bold text-white">${priceRange.min}</div>
                            <div className="text-xs text-slate-500">Est. Price</div>
                        </div>
                    </div>

                    {/* Details List */}
                    <div className="space-y-4 mb-8">
                        <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
                            <div className="flex items-center gap-3 text-slate-300">
                                <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center">
                                    <MapPin className="w-4 h-4 text-blue-400" />
                                </div>
                                <span className="font-medium text-sm">Location</span>
                            </div>
                            <span className="text-white font-semibold text-sm">
                                {mode === 'location' ? 'Home Service' : 'Pickup & Drop'}
                            </span>
                        </div>

                        {/* <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
                            <div className="flex items-center gap-3 text-slate-300">
                                <div className="w-8 h-8 rounded-full bg-orange-900/30 flex items-center justify-center">
                                    <Calendar className="w-4 h-4 text-orange-400" />
                                </div>
                                <span className="font-medium text-sm">Date & Time</span>
                            </div>
                            <span className="text-white font-semibold text-sm">
                                {new Date(bookingDetails.bookingRequest?.scheduled_at || Date.now()).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    hour12: true
                                })}
                            </span>
                        </div> */}

                        <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
                            <div className="flex items-center gap-3 text-slate-300">
                                <div className="w-8 h-8 rounded-full bg-purple-900/30 flex items-center justify-center">
                                    <CreditCard className="w-4 h-4 text-purple-400" />
                                </div>
                                <span className="font-medium text-sm">Payment</span>
                            </div>
                            <span className="text-white font-semibold text-sm">Pay after service</span>
                        </div>
                    </div>

                    {/* Mechanic Note */}
                    {/* <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl mb-6">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden">
                            <Image src={mechanic.avatar} alt="Mechanic" fill className="object-cover" />
                        </div>
                        
                    </div> */}

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onEdit}
                            className="flex-1 py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors"
                        >
                            Edit
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`flex-[2] cursor-pointer py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 group ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
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
