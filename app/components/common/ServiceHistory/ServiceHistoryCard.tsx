import React from "react";
import { FileText, Calendar, Hash, Car, ChevronRight } from "lucide-react";
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
                return "text-amber-400 bg-amber-400/10 border-amber-400/20";
            case "Completed":
            case "Paid":
                return "text-theme-green bg-theme-green/10 border-theme-green/20";
            case "Cancelled":
                return "text-rose-500 bg-rose-500/10 border-rose-500/20";
            default:
                return "text-gray-400 bg-gray-400/10 border-gray-400/20";
        }
    };

    return (
        <div
            onClick={onCardClick}
            className="group relative bg-primaryCard border border-secondary-theme rounded-4xl p-6 shadow-2xl shadow-black/60 cursor-pointer overflow-hidden transition-all duration-500 hover:border-theme-green/40 hover:-translate-y-1"
        >
            {/* Glossy gradient accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-theme-green/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Background Glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-theme-green/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-theme-green/15 transition-all duration-500"></div>

            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-theme-green/10 group-hover:border-theme-green/20 transition-all duration-500">
                        <Car className="w-5 h-5 text-gray-400 group-hover:text-theme-green transition-colors" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em] mb-0.5">Assigned Partner</p>
                        <h3 className="text-sm font-bold text-white tracking-tight">{providerName}</h3>
                    </div>
                </div>
                <div className={cn(
                    "px-3 py-1 rounded-xl border text-[9px] font-black tracking-widest uppercase",
                    getStatusStyles(status)
                )}>
                    {status}
                </div>
            </div>

            <div className="mb-6">
                <h4 className="text-2xl font-black text-white tracking-tighter leading-tight mb-3">
                    {serviceName.toUpperCase()}
                </h4>

                <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/3 border border-white/5 group-hover:border-white/10 transition-colors">
                        <Calendar className="w-3 h-3 text-theme-green" />
                        <div className="flex flex-col">
                            <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest leading-none mb-0.5">Scheduled Slot</span>
                            <span className="text-[10px] font-bold text-gray-300 tracking-tight">{date}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/3 border border-white/5 group-hover:border-white/10 transition-colors">
                        <Hash className="w-3 h-3 text-gray-500" />
                        <div className="flex flex-col">
                            <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest leading-none mb-0.5">Registration</span>
                            <span className="text-[10px] font-bold text-gray-300 tracking-tight uppercase">{vehicleNumber}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-5 border-t border-white/5">
                <div className="flex flex-col">
                    <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest mb-0.5">Booking Ref</span>
                    <span className="text-[9px] font-bold text-gray-500 tracking-widest uppercase">{bookingId}</span>
                </div>

                <div className="flex gap-2">
                    {status !== "Cancelled" && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onInvoiceClick?.();
                            }}
                            className="h-10 px-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
                        >
                            <FileText className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black tracking-widest uppercase">Invoice</span>
                        </button>
                    )}
                    <div className="w-10 h-10 rounded-xl bg-theme-green/10 border border-theme-green/20 flex items-center justify-center text-theme-green group-hover:bg-theme-green group-hover:text-black transition-all duration-500">
                        <ChevronRight className="w-5 h-5 translate-x-px" />
                    </div>
                </div>
            </div>
        </div>
    );
};
