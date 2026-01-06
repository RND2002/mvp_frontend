
"use client";

import React from "react";
import { useSelector } from 'react-redux';
import {
    Settings,
    PaintBucket,
    Car,
    Wind,
    Disc,
    Eraser,
    Armchair,
    Wrench,
    Droplets,
    PhoneCall,
    ChevronRight,
    Loader2
} from "lucide-react";
import { ServiceItem } from "@/app/components/common/Services";
import { RootState } from "@/app/store/store"; // Assuming store path
import { useGetServicesQuery } from "@/app/beService/services-service";

interface ServiceDiscoveryProps {
    onServiceSelect: (service: any) => void;
}

const SERVICE_ASSETS: Record<string, any> = {
    "General Service": {
        icon: Settings,
        color: "bg-pink-100",
        iconColor: "text-pink-500",
    },
    "Full Body Painting": {
        icon: PaintBucket,
        color: "bg-yellow-100",
        iconColor: "text-yellow-500",
    },
    "Complete Car Spa": {
        icon: Car,
        color: "bg-blue-100",
        iconColor: "text-blue-500",
    },
    "AC Service": {
        icon: Wind,
        color: "bg-red-100",
        iconColor: "text-red-500",
    },
    "Wheel Alignment": {
        icon: Disc,
        color: "bg-green-100",
        iconColor: "text-green-500",
    },
    "Scratch Removal": {
        icon: Eraser,
        color: "bg-teal-100",
        iconColor: "text-teal-500",
    },
    "Interior Detailing": {
        icon: Armchair,
        color: "bg-gray-100",
        iconColor: "text-gray-500",
    },
    "Engine Checkup": {
        icon: Wrench,
        color: "bg-orange-100",
        iconColor: "text-orange-500",
    },
    "Water Wash": {
        icon: Droplets,
        color: "bg-lime-100",
        iconColor: "text-lime-500",
    },
    "Emergency Service": {
        icon: PhoneCall,
        color: "bg-purple-100",
        iconColor: "text-purple-500",
    },
};

export const ServiceDiscovery: React.FC<ServiceDiscoveryProps> = ({ onServiceSelect }) => {
    const selectedVehicle = useSelector((state: RootState) => state.vehicle.selectedVehicle);

    const { data, isLoading, error } = useGetServicesQuery(
        { vehicle_type: selectedVehicle?.vehicle_type || 'four_wheeler' }, // Fallback or strict check
        { skip: !selectedVehicle }
    );

    const services = data?.services || [];

    return (
        <div className="max-w-4xl mx-auto px-4 pt-6 animate-slide-up">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">
                        What does your {selectedVehicle?.model || "vehicle"} need today?
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">Quick booking · Certified mechanics</p>
                </div>
            </div>

            {/* Promo Banner */}
            <div className="relative w-full h-48 md:h-64 rounded-3xl overflow-hidden mb-8 shadow-lg group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900 z-0"></div>

                <img
                    src="https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&q=80&w=1000"
                    alt="Service Banner"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 flex flex-col justify-end p-6">
                    <div className="text-white">
                        <h3 className="text-xl md:text-2xl font-bold mb-1">Doorstep</h3>
                        <p className="text-lg md:text-xl font-semibold mb-2">Bike Service & Car Service</p>
                        <p className="text-sm opacity-90 mb-4">Starting at just $125 (for bikes) & $250 (for cars)</p>

                        <button className="bg-white text-slate-900 rounded-full w-10 h-10 flex items-center justify-center hover:bg-slate-100 transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Services Grid */}
            <div className="min-h-[200px]">
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
                    </div>
                ) : services.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 pb-24">
                        {services.map((service, index) => {
                            const asset = SERVICE_ASSETS[service.name] || {
                                icon: Settings,
                                color: "bg-gray-100",
                                iconColor: "text-gray-500"
                            };

                            return (
                                <ServiceItem
                                    key={service.id || index}
                                    icon={asset.icon}
                                    label={service.name}
                                    color={asset.color}
                                    iconClassName={asset.iconColor}
                                    onClick={() => onServiceSelect(service)}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center text-slate-400 py-10">
                        No services available for this vehicle type.
                    </div>
                )}
            </div>
        </div>
    );
};
