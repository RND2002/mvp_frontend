"use client";

import React from "react";
import { useSelector } from 'react-redux';
import { cn } from "@/lib/utils";
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
    Loader2,
    Bell,
    CheckCircle2,
    Zap,
    Flame,
    Sparkles
} from "lucide-react";
import { VroomButton } from "../../components/common/VroomButton";
import { ServiceCard } from "./ServiceCard";
import { PillFilters, FilterItem } from "../../components/common/PillFilters";
import { RootState } from "@/app/store/store"; // Assuming store path
import { useGetServicesQuery } from "@/app/beService/services-service";
import { VEHICLE_TYPE } from "@/app/beService/vehicle-service";

interface ServiceDiscoveryProps {
    onServiceSelect: (service: any) => void;
}

const SERVICE_ASSETS: Record<string, any> = {
    "General Service": {
        icon: Settings,
        category: "MAINTENANCE",
        description: "Complete checkup & oil change",
        color: "bg-blue-500/10",
        iconColor: "text-blue-500",
    },
    "Emergency Service": {
        icon: Zap,
        category: "EMERGENCY",
        description: "20-30 min arrival",
        color: "bg-red-500/10",
        iconColor: "text-red-500",
    },
    "Brake Service": {
        icon: Disc,
        category: "MAINTENANCE",
        description: "Disc & pad inspection",
        color: "bg-blue-500/10",
        iconColor: "text-blue-500",
    },
    "Complete Bike Spa": {
        icon: Sparkles,
        category: "CLEANING",
        description: "Deep wash & wax",
        color: "bg-purple-500/10",
        iconColor: "text-purple-500",
    },
    "Chain Sprocket Kit": {
        icon: Wrench,
        category: "REPAIR",
        description: "Replacement & lubing",
        color: "bg-orange-500/10",
        iconColor: "text-orange-500",
    },
};

const CATEGORIES: FilterItem[] = [
    { id: "General", label: "General" },
    { id: "Maintenance", label: "Maintenance" },
    { id: "Cleaning", label: "Cleaning" }
];

export const ServiceDiscovery: React.FC<ServiceDiscoveryProps> = ({ onServiceSelect }) => {
    const selectedVehicle = useSelector((state: RootState) => state.vehicle.selectedVehicle);
    const [selectedCategory, setSelectedCategory] = React.useState("General");

    const { data, isLoading } = useGetServicesQuery(
        { vehicle_type: selectedVehicle?.vehicle_type || VEHICLE_TYPE.FOUR_WHEELER },
        { skip: !selectedVehicle }
    );

    const services = data?.services || [];

    return (
        <div className="max-w-xl mx-auto px-6 pt-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* High-Fidelity Header */}
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-theme-green/10 rounded-2xl flex items-center justify-center border border-theme-green/20">
                        <Car className="w-6 h-6 text-theme-green" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Vehicle</p>
                        <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-black text-white">{selectedVehicle?.brand.toUpperCase()} {selectedVehicle?.model.toUpperCase()}</h3>
                            <CheckCircle2 className="w-3.4 h-3.5 text-theme-green fill-theme-green/20" />
                        </div>
                    </div>
                </div>
                {/* <div className="flex gap-3">
                    <button className="w-10 h-10 bg-vehicle-card-bg border border-vehicle-card-border rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-theme-green rounded-full border-2 border-vehicle-card-bg"></span>
                    </button>
                    <div className="w-10 h-10 bg-[#E8C0A0] rounded-full overflow-hidden border-2 border-vehicle-card-border">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
                    </div>
                </div> */}
            </div>

            {/* Title Section */}
            <div className="mb-8">
                <h1 className="text-4xl font-black text-white mb-2">Book a <span className="text-theme-green">Service</span></h1>
                <p className="text-gray-500 font-medium">Select a category to find specialized care.</p>
            </div>

            {/* Category Pills */}
            <PillFilters
                items={CATEGORIES}
                selectedId={selectedCategory}
                onSelect={setSelectedCategory}
                className="mb-8"
            />

            {/* Emergency Action Card */}
            <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-5 mb-10 flex items-center justify-between relative overflow-hidden group">
                <div className="relative z-10 flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center">
                        <Flame className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <h4 className="text-red-500 font-black text-sm uppercase tracking-wider">Emergency Assist</h4>
                        <p className="text-gray-500 text-xs font-medium">Battery Jumpstart available now</p>
                    </div>
                </div>
                <VroomButton
                    className="bg-red-500 hover:bg-red-600 text-white border-none h-11 px-6 shadow-[0_4px_15px_rgba(239,68,68,0.3)]"
                >
                    CALL NOW
                </VroomButton>

                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            </div>

            {/* Recommended Services Title */}
            <div className="mb-6">
                <h2 className="text-xl font-black text-white">Recommended Services</h2>
            </div>

            {/* Services Vertical List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-theme-green" />
                    </div>
                ) : services.length > 0 ? (
                    services.map((service, index) => {
                        const asset = SERVICE_ASSETS[service.name] || {
                            icon: Settings,
                            category: "MAINTENANCE",
                            description: "Professional care for your ride",
                            color: "bg-gray-800/10",
                            iconColor: "text-gray-400"
                        };

                        return (
                            <ServiceCard
                                key={service.id || index}
                                name={service.name}
                                category={asset.category}
                                description={asset.description}
                                icon={asset.icon}
                                color={asset.color}
                                iconColor={asset.iconColor}
                                onClick={() => onServiceSelect(service)}
                            />
                        );
                    })
                ) : (
                    <div className="text-center text-slate-400 py-10 bg-vehicle-card-bg border border-dashed border-vehicle-card-border rounded-3xl">
                        No services available for this category yet.
                    </div>
                )}
            </div>
        </div>
    );
};
