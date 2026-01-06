
"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Star, Info, Check, MapPin, Truck, Loader2 } from "lucide-react";
import Image from "next/image";
import { useGetServiceItemsQuery } from "@/app/beService/service-items";


interface ServiceDetailProps {
    service: any;
    onBack: () => void;
    onProceed: (bookingDetails: any) => void;
}

export const ServiceDetail: React.FC<ServiceDetailProps> = ({ service, onBack, onProceed }) => {
    const [scrolled, setScrolled] = useState(false);
    const [serviceMode, setServiceMode] = useState<"location" | "pickup" | null>(null);

    const { data, isLoading } = useGetServiceItemsQuery(service.id, {
        skip: !service.id
    });
    const serviceItems = data?.serviceItems || [];

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const vehicleInfo = {
        name: "Honda City",
        type: "Petrol",
        reg: "KA-01-MJ-1234",
    };

    const mechanic = {
        name: "Brandon Dan CK",
        experience: "7+ years",
        rating: 4.8,
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=60&w=200",
    };

    const estimatedPriceMin = service.base_price || 350;
    const estimatedPriceMax = (service.base_price || 350) + 100;

    const handleProceed = () => {
        if (!serviceMode) return;

        onProceed({
            service,
            vehicle: vehicleInfo,
            mechanic,
            priceRange: { min: estimatedPriceMin, max: estimatedPriceMax },
            mode: serviceMode,
        });
    };

    return (
        <>
            <div className="min-h-screen pb-32 animate-slide-up">
                {/* Section 1: Service Header */}
                <div className="relative w-full h-64 md:h-80">
                    <Image
                        src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=1000"
                        alt="Service Header"
                        fill
                        className="object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#091A23]/50 to-[#091A23]"></div>

                    <div className="absolute top-0 left-0 right-0 p-6 flex items-center">
                        <button
                            onClick={onBack}
                            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <span className="ml-4 text-white font-semibold text-lg opacity-0 transition-opacity duration-300" style={{ opacity: scrolled ? 1 : 0 }}>
                            {service.label || service.name}
                        </span>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{service.label || service.name}</h1>
                        <p className="text-gray-300 font-medium">Doorstep car & bike servicing</p>
                    </div>
                </div>

                <div className="px-4 max-w-4xl mx-auto space-y-8 -mt-4 relative z-10">

                    {/* Section 2: Vehicle Context */}
                    <div className="bg-[#1A2C35] rounded-xl p-4 border border-slate-700 flex justify-between items-center shadow-lg">
                        <div>
                            <div className="text-white font-bold text-lg">{vehicleInfo.name} <span className="text-slate-400 font-normal">· {vehicleInfo.type}</span></div>
                            <div className="text-slate-400 text-sm mt-0.5">{vehicleInfo.reg}</div>
                        </div>
                        <button className="text-green-500 text-sm font-semibold hover:text-green-400">
                            Change
                        </button>
                    </div>

                    {/* Section 3: Price Transparency */}
                    <div className="bg-[#1A2C35] rounded-xl p-6 border border-slate-700">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-slate-400 font-medium text-sm flex items-center gap-1">
                                Estimated Price <Info className="w-4 h-4 text-slate-500" />
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">
                            ${estimatedPriceMin} – ${estimatedPriceMax}
                        </div>
                        <p className="text-slate-400 text-xs">Final price confirmed after inspection</p>
                    </div>

                    {/* Section 4: Mechanic (Recommendation) */}
                    <div className="bg-[#1A2C35] rounded-xl p-6 border border-slate-700">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-slate-300 font-semibold">Recommended Mechanic</span>
                            <button className="text-green-500 text-xs font-semibold hover:underline">View all</button>
                        </div>
                        <div className="flex items-center gap-4 bg-[#122026] p-4 rounded-lg border border-slate-800">
                            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-slate-600">
                                <Image src={mechanic.avatar} alt={mechanic.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1">
                                <div className="text-white font-bold">{mechanic.name}</div>
                                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                                    <span>{mechanic.experience}</span>
                                    <span>•</span>
                                    <span className="flex items-center text-yellow-400 gap-0.5">
                                        {mechanic.rating} <Star className="w-3 h-3 fill-current" />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <p className="text-slate-500 text-xs mt-3 text-center">You can change mechanic after booking</p>
                    </div>

                    {/* Section 5: Service Includes */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Service Includes</h3>
                        <div className="bg-[#1A2C35] rounded-xl p-6 border border-slate-700">
                            {isLoading ? (
                                <div className="flex justify-center py-6">
                                    <Loader2 className="h-6 w-6 animate-spin text-green-500" />
                                </div>
                            ) : serviceItems.length > 0 ? (
                                <ul className="space-y-4">
                                    {serviceItems.map((item, idx) => (
                                        <li key={item.id || idx} className="flex items-start gap-3">
                                            <div className="w-5 h-5 rounded-full bg-green-900/40 flex items-center justify-center shrink-0 mt-0.5">
                                                <Check className="w-3.5 h-3.5 text-green-400" />
                                            </div>
                                            <span className="text-slate-300 text-sm font-medium">{item.title}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-slate-400 text-sm">No specific items listed for this service.</p>
                            )}
                        </div>
                    </div>

                    {/* Section 6: User Choice (Mandatory) */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Service Mode</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setServiceMode("location")}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${serviceMode === "location"
                                    ? "bg-green-600/20 border-green-500 text-white"
                                    : "bg-[#1A2C35] border-transparent text-slate-400 hover:bg-[#233842]"
                                    }`}
                            >
                                <MapPin className={`w-6 h-6 ${serviceMode === "location" ? "text-green-500" : "text-slate-500"}`} />
                                <span className="text-sm font-bold">At my location</span>
                            </button>

                            <button
                                onClick={() => setServiceMode("pickup")}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${serviceMode === "pickup"
                                    ? "bg-green-600/20 border-green-500 text-white"
                                    : "bg-[#1A2C35] border-transparent text-slate-400 hover:bg-[#233842]"
                                    }`}
                            >
                                <Truck className={`w-6 h-6 ${serviceMode === "pickup" ? "text-green-500" : "text-slate-500"}`} />
                                <span className="text-sm font-bold">Pickup & Drop</span>
                            </button>
                        </div>
                    </div>

                </div>

            </div>

            {/* Section 7: Sticky Bottom CTA */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#091A23] via-[#091A23] to-transparent z-[5000]">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={handleProceed}
                        disabled={!serviceMode}
                        className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all ${serviceMode
                            ? "bg-green-600 text-white hover:bg-green-700 shadow-green-900/20"
                            : "bg-slate-700 text-slate-400 cursor-not-allowed"
                            }`}
                    >
                        {serviceMode ? `Proceed · Est. $${estimatedPriceMin}` : "Select Service Mode"}
                    </button>
                </div>
            </div>
        </>
    );
};
