import React from "react";
import { FileText } from "lucide-react";

interface ServiceHistoryCardProps {
    providerName: string;
    bookingId: string;
    serviceName: string;
    vehicleNumber: string;
    date: string;
    status: "Pending" | "Paid" | "Completed";
    serviceColor?: string; // e.g. "text-yellow-500"
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
    serviceColor, // We can keep this if it maps to a theme color, or map it inside
    onInvoiceClick,
    onCardClick
}) => {
    // Map status to theme colors if needed, or rely on passed classes
    const statusColor = status === "Pending" ? "text-theme-green" : "text-theme-green";
    const activeServiceColor = serviceColor || "text-primary";

    return (
        <div
            onClick={onCardClick}
            className="group bg-vehicle-card-bg/30 hover:bg-vehicle-card-bg/50 transition-colors rounded-3xl p-5 shadow-sm border border-vehicle-card-border/30 w-full mb-4 cursor-pointer"
        >
            <div className="flex justify-between items-start mb-1">
                <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors">
                    {providerName}
                </h3>
                <span className="text-xs font-semibold text-gray-400">
                    {date}
                </span>
            </div>

            <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-gray-400 font-medium">
                    Booking ID - {bookingId}
                </p>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onInvoiceClick?.();
                    }}
                    className="w-8 h-8 rounded-full bg-theme-green/10 flex items-center justify-center text-theme-green hover:bg-theme-green/20 transition-colors"
                >
                    <FileText className="w-4 h-4" />
                </button>
            </div>

            <h4 className={`text-sm font-bold mb-2 ${activeServiceColor}`}>{serviceName}</h4>

            <div className="flex justify-between items-end">
                <p className="text-xs font-bold text-white/80">
                    Vehicle Number - {vehicleNumber}
                </p>
                <span className={`text-xs font-bold ${statusColor}`}>{status}</span>
            </div>
        </div>
    );
};
