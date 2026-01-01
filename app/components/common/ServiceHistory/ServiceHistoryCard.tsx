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
}

export const ServiceHistoryCard: React.FC<ServiceHistoryCardProps> = ({
    providerName,
    bookingId,
    serviceName,
    vehicleNumber,
    date,
    status,
    serviceColor = "text-yellow-500",
    onInvoiceClick,
}) => {
    const statusColor = status === "Pending" ? "text-red-500" : "text-blue-600";

    return (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 w-full mb-4">
            <div className="flex justify-between items-start mb-1">
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                    {providerName}
                </h3>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {date}
                </span>
            </div>

            <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-slate-400 font-medium">
                    Booking ID - {bookingId}
                </p>
                <button
                    onClick={onInvoiceClick}
                    className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
                >
                    <FileText className="w-4 h-4" />
                </button>
            </div>

            <h4 className={`text-sm font-bold mb-2 ${serviceColor}`}>{serviceName}</h4>

            <div className="flex justify-between items-end">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-300">
                    Vehicle Number - {vehicleNumber}
                </p>
                <span className={`text-xs font-bold ${statusColor}`}>{status}</span>
            </div>
        </div>
    );
};
