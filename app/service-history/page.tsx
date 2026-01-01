"use client";

import React from "react";
import { ServiceHistoryCard } from "@/app/components/common/ServiceHistory";

export default function ServiceHistoryPage() {
    const ongoingServices = [
        {
            providerName: "Service Provider Name",
            bookingId: "AT345FGT",
            serviceName: "General Service",
            vehicleNumber: "XX XX YYYY",
            date: "Oct 29, 2020",
            status: "Pending" as const,
            serviceColor: "text-amber-500",
        },
    ];

    const lastServices = [
        {
            providerName: "Service Provider Name",
            bookingId: "AT978CFG",
            serviceName: "Full Body Painting",
            vehicleNumber: "XX XX YYYY",
            date: "Sep 15, 2020",
            status: "Paid" as const,
            serviceColor: "text-amber-400",
        },
        {
            providerName: "Service Provider Name",
            bookingId: "AT879ATF",
            serviceName: "Water Wash",
            vehicleNumber: "XX XX YYYY",
            date: "Aug 22, 2020",
            status: "Paid" as const,
            serviceColor: "text-amber-400",
        },
        {
            providerName: "Service Provider Name",
            bookingId: "AT348BVR",
            serviceName: "Complete Car Spa",
            vehicleNumber: "XX XX YYYY",
            date: "July 18, 2020",
            status: "Paid" as const,
            serviceColor: "text-amber-400",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 md:pb-10">
            <div className="max-w-4xl mx-auto px-4 pt-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    {/* Left Spacer to Center Title */}
                    <div className="w-10"></div>

                    <h1 className="text-lg font-bold text-slate-700 dark:text-slate-200 tracking-wide uppercase">
                        My Services
                    </h1>


                </div>

                {/* Ongoing Service Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-serif italic font-bold text-slate-800 dark:text-white mb-4">
                        Ongoing Service
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ongoingServices.map((service, index) => (
                            <ServiceHistoryCard
                                key={index}
                                {...service}
                            />
                        ))}
                    </div>
                </div>

                {/* Last Services Section */}
                <div>
                    <h2 className="text-xl font-serif italic font-bold text-slate-800 dark:text-white mb-4">
                        Last Services
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {lastServices.map((service, index) => (
                            <ServiceHistoryCard
                                key={index}
                                {...service}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
