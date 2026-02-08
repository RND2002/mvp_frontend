import React from "react";
import { FileText, Calendar, Hash, Car } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceHistoryCardProps {
    providerName: string;
    bookingId: string;
    serviceName: string;
    vehicleNumber: string;
    date: string;
    status: "Pending" | "Paid" | "Completed" | "Cancelled";
    serviceColor?: string;
    onInvoiceClick?: () => void;
    onCardClick?: () => void;
}

export const ServiceHistoryCard: React.FC<ServiceHistoryCardProps> = ({
    providerName,
    bookingId,
    serviceName,
    vehicleNumber,
    date,
    status,
    onInvoiceClick,
    onCardClick
}) => {
    const getStatusStyles = (status: string) => {
        switch (status) {
            case "Pending":
                return "text-theme-yellow bg-theme-yellow/10 border-theme-yellow/20";
            case "Completed":
            case "Paid":
                return "text-theme-green bg-theme-green/10 border-theme-green/20";
            case "Cancelled":
                return "text-theme-red bg-theme-red/10 border-theme-red/20";
            default:
                return "text-gray-400 bg-gray-400/10 border-gray-400/20";
        }
    };

    return (
        <div
            onClick={onCardClick}
            className="group relative bg-vehicle-card-bg border border-vehicle-card-border rounded-3xl p-5 shadow-xl shadow-black/40 cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:border-theme-green/30"
        >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-theme-green/5 rounded-full blur-[50px] -mr-12 -mt-12 pointer-events-none group-hover:bg-theme-green/10 transition-colors"></div>

            <div className="flex justify-between items-start mb-4">
                <div className="space-y-0.5">
                    <p className="text-theme-green text-[9px] font-black uppercase tracking-[0.2em]">Service Provider</p>
                    <h3 className="text-lg font-bold text-white tracking-tight">{providerName}</h3>
                </div>
                <div className={cn(
                    "px-2.5 py-0.5 rounded-full border text-[9px] font-black tracking-widest uppercase",
                    getStatusStyles(status)
                )}>
                    {status}
                </div>
            </div>

            <div className="mb-4">
                <h4 className="text-xl font-black text-white tracking-tighter leading-none mb-1.5">
                    {serviceName.toUpperCase()}
                </h4>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span className="text-[10px] font-bold tracking-wider">{date}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-white/5">
                <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-gray-500">
                        <Hash className="w-2.5 h-2.5" />
                        <span className="text-[8px] font-black uppercase tracking-[0.2em]">Booking ID</span>
                    </div>
                    <p className="text-[10px] font-bold text-white tracking-widest">{bookingId}</p>
                </div>
                <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-gray-500">
                        <Car className="w-2.5 h-2.5" />
                        <span className="text-[8px] font-black uppercase tracking-[0.2em]">Vehicle</span>
                    </div>
                    <p className="text-[10px] font-bold text-white tracking-widest">{vehicleNumber}</p>
                </div>
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onInvoiceClick?.();
                }}
                className="absolute bottom-5 right-5 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-theme-green hover:border-theme-green/30 hover:bg-theme-green/10 transition-all duration-300"
            >
                <FileText className="w-4 h-4" />
            </button>
        </div>
    );
};
