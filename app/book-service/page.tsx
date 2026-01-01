"use client";

import React from "react";
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
} from "lucide-react";
import { ServiceItem, ServiceDetailModal } from "@/app/components/common/Services";
import Image from "next/image";

export default function BookServicePage() {
    const services = [
        {
            icon: Settings,
            label: "General Service",
            color: "bg-pink-100",
            iconColor: "text-pink-500",
        },
        {
            icon: PaintBucket,
            label: "Full Body Painting",
            color: "bg-yellow-100",
            iconColor: "text-yellow-500",
        },
        {
            icon: Car,
            label: "Complete Car Spa",
            color: "bg-blue-100",
            iconColor: "text-blue-500",
        },
        {
            icon: Wind,
            label: "AC Service",
            color: "bg-red-100",
            iconColor: "text-red-500",
        },
        {
            icon: Disc,
            label: "Wheel Alignment",
            color: "bg-green-100",
            iconColor: "text-green-500",
        },
        {
            icon: Eraser,
            label: "Scratch Removal",
            color: "bg-teal-100",
            iconColor: "text-teal-500",
        },
        {
            icon: Armchair,
            label: "Interior Detailing",
            color: "bg-gray-100",
            iconColor: "text-gray-500",
        },
        {
            icon: Wrench,
            label: "Engine Checkup",
            color: "bg-orange-100",
            iconColor: "text-orange-500",
        },
        {
            icon: Droplets,
            label: "Water Wash",
            color: "bg-lime-100",
            iconColor: "text-lime-500",
        },
        {
            icon: PhoneCall,
            label: "Emergency Service",
            color: "bg-purple-100",
            iconColor: "text-purple-500",
        },
    ];

    const [selectedService, setSelectedService] = React.useState<null | (typeof services)[0]>(null);

    const handleServiceClick = (service: typeof services[0]) => {
        setSelectedService(service);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 md:pb-10">

            <ServiceDetailModal
                isOpen={!!selectedService}
                onClose={() => setSelectedService(null)}
                service={selectedService}
            />

            <div className="max-w-4xl mx-auto px-4 pt-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            Hello User
                        </h1>
                        <h2 className="text-xl font-bold   text-slate-800 dark:text-white">
                            Select Your Service to Continue
                        </h2>
                    </div>
                </div>

                {/* Promo Banner */}
                <div className="relative w-full h-48 md:h-64 rounded-3xl overflow-hidden mb-8 shadow-lg group cursor-pointer">
                    {/* Fallback pattern/gradient if no image */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900 z-0"></div>

                    {/* Valid Image src needed. Using a placeholder div for now or an external placeholder if allowed? 
               Better to use a nice gradient overlay + text if no specific asset.
               But user uploaded an image. I can't easily grab that 'uploaded_image' to use directly as src 
               unless I put it in public/assets. I will assume a gradient for now or a standard Unsplash placeholder. 
           */}
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {services.map((service, index) => (
                        <ServiceItem
                            key={index}
                            icon={service.icon}
                            label={service.label}
                            color={service.color}
                            iconClassName={service.iconColor}
                            onClick={() => handleServiceClick(service)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
