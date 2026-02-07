"use client"

import React, { useState, useEffect } from "react";
import { ArrowLeft, Star, Info, Check, MapPin, Truck, Loader2, Car, Sparkles, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useGetServiceItemsQuery } from "@/app/beService/service-items";
import { useGetServicesQuery } from "@/app/beService/services-service";
import { VroomButton } from "../../components/common/VroomButton";
import { ServiceIncludes } from "./ServiceIncludes";
import { cn } from "@/lib/utils";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import { selectVehicle, Vehicle } from "@/app/store/slices/vehicleSlice";
import { selectLocation } from "@/app/store/slices/locationSlice";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner"
import { Button } from "@/components/ui/button";

interface ServiceDetailProps {
    service: any;
    onBack: () => void;
    onProceed: (bookingDetails: any) => void;
}

export const ServiceDetail: React.FC<ServiceDetailProps> = ({ service, onBack, onProceed }) => {
    const dispatch = useDispatch();
    const [scrolled, setScrolled] = useState(false);
    const [serviceMode, setServiceMode] = useState<"location" | "pickup" | null>(null);
    const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false);

    // Mutations


    // Redux State
    const { selectedVehicle, vehicles } = useSelector((state: RootState) => state.vehicle);
    const { lat, lng, city } = useSelector(selectLocation);

    console.log("location", lat, lng, city);

    // Queries
    const { data: serviceItemsData, isLoading: isItemsLoading } = useGetServiceItemsQuery(service.id, {
        skip: !service.id
    });

    // Fetch pricing for current vehicle
    const { data: servicesData, isLoading: isServicesLoading } = useGetServicesQuery(
        { vehicle_type: selectedVehicle?.vehicle_type || "" },
        { skip: !selectedVehicle }
    );

    // Derived State
    // Filter items client-side since API returns all items for the service
    const rawServiceItems = serviceItemsData?.items || [];
    const serviceItems = rawServiceItems.filter((item: any) =>
        !item.vehicle_type ||
        (selectedVehicle && item.vehicle_type === selectedVehicle.vehicle_type)
    );

    // Find current service in the fetched list to get price
    // We assume service.id is consistent across vehicle types
    const currentServicePricing = servicesData?.services?.find(s => s.id === service.id);
    const basePrice = currentServicePricing?.base_price || service.base_price || 350;

    const estimatedPriceMin = basePrice;
    const estimatedPriceMax = basePrice + 100;

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleVehicleSelect = (vehicle: Vehicle) => {
        dispatch(selectVehicle(vehicle.id));
        setIsVehicleDialogOpen(false);
    };

    const handleProceed = () => {
        if (!serviceMode || !selectedVehicle) return;

        // Validate Location
        if (lat === null || lng === null) {
            toast.error("Location missing. Please enable location permissions.");
            return;
        }

        const bookingData = {
            service_id: service.id,
            vehicle_id: selectedVehicle.id,
            service_mode: serviceMode === "location" ? "doorstep" : "pickup_drop", // mapping to enum
            price: basePrice,
            scheduled_at: new Date().toISOString(),
            userLocation: {
                lat,
                lng,
                city: city || "Unknown"
            }
        };

        onProceed({
            service: { ...service, base_price: basePrice },
            vehicle: selectedVehicle,
            bookingRequest: bookingData, // Pass the request data specifically
            mechanic: {
                name: "Brandon Dan CK",
                experience: "7+ years",
                rating: 4.8,
                avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=60&w=200",
            },
            priceRange: { min: estimatedPriceMin, max: estimatedPriceMax },
            mode: serviceMode,
        });
    };

    return (
        <>
            <div className="min-h-screen pb-64 md:pb-64 animate-slide-up">
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
                    <div className="bg-vehicle-card-bg rounded-3xl p-5 border border-vehicle-card-border flex justify-between items-center shadow-lg group">
                        {selectedVehicle ? (
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                                    <Car className="w-6 h-6 text-gray-400 group-hover:text-theme-green transition-colors" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Selected Vehicle</p>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-black text-white">
                                            {selectedVehicle.brand.toUpperCase()} {selectedVehicle.model.toUpperCase()}
                                        </h3>
                                        <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">{selectedVehicle.fuel_type}</span>
                                    </div>
                                    <div className="text-gray-500 text-[10px] font-medium mt-0.5">{selectedVehicle.registration_number || "NO REG DATA"}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                                    <Car className="w-6 h-6 text-gray-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-gray-400">No Vehicle Selected</h3>
                                    <p className="text-xs text-gray-600">Please select a vehicle in profile</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section 3: Price Transparency */}
                    <div className="bg-vehicle-card-bg rounded-3xl p-6 border border-vehicle-card-border shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-gray-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                                    Estimated Price <Info className="w-3.5 h-3.5 text-gray-700" />
                                </span>
                                {isServicesLoading && <Loader2 className="w-4 h-4 animate-spin text-theme-green" />}
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-white">₹{estimatedPriceMin}</span>
                                <span className="text-gray-500 font-bold text-lg"> – ₹{estimatedPriceMax}</span>
                            </div>
                            <p className="text-gray-600 text-[10px] font-medium mt-3 leading-relaxed">
                                Final price confirmed after inspection. Base price for {selectedVehicle?.vehicle_type?.replace("_", " ") || "vehicle"}.
                            </p>
                        </div>
                        {/* Subtle glow */}
                        <div className="absolute bottom-0 right-0 w-24 h-24 bg-theme-green/5 rounded-full blur-2xl -mr-12 -mb-12"></div>
                    </div>

                    {/* Section 5: Service Includes */}
                    <ServiceIncludes
                        items={serviceItems}
                        isLoading={isItemsLoading}
                    />

                    {/* Section 6: User Choice (Service Mode) */}
                    <div>
                        <h3 className="text-white font-black text-lg mb-4 flex items-center gap-2">
                            <Truck className="w-5 h-5 text-theme-green" />
                            Service Mode
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setServiceMode("location")}
                                className={cn(
                                    "p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all duration-300",
                                    serviceMode === "location"
                                        ? "bg-theme-green/10 border-theme-green text-white shadow-[0_0_20px_rgba(34,197,94,0.1)] scale-[1.02]"
                                        : "bg-vehicle-card-bg border-vehicle-card-border text-gray-500 hover:border-gray-700"
                                )}
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                                    serviceMode === "location" ? "bg-theme-green/20" : "bg-white/5"
                                )}>
                                    <MapPin className={cn("w-6 h-6", serviceMode === "location" ? "text-theme-green" : "text-gray-600")} />
                                </div>
                                <span className="text-sm font-black uppercase tracking-wider text-center">At my location</span>
                            </button>

                            <button
                                onClick={() => setServiceMode("pickup")}
                                className={cn(
                                    "p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all duration-300",
                                    serviceMode === "pickup"
                                        ? "bg-theme-green/10 border-theme-green text-white shadow-[0_0_20px_rgba(34,197,94,0.1)] scale-[1.02]"
                                        : "bg-vehicle-card-bg border-vehicle-card-border text-gray-500 hover:border-gray-700"
                                )}
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                                    serviceMode === "pickup" ? "bg-theme-green/20" : "bg-white/5"
                                )}>
                                    <Truck className={cn("w-6 h-6", serviceMode === "pickup" ? "text-theme-green" : "text-gray-600")} />
                                </div>
                                <span className="text-sm font-black uppercase tracking-wider text-center">Pickup & Drop</span>
                            </button>
                        </div>
                    </div>

                </div>

            </div>

            {/* Section 7: Sticky Bottom CTA */}
            <div className="fixed bottom-[80px] md:bottom-24 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent z-[50] md:max-w-4xl md:mx-auto">
                <div className="max-w-4xl mx-auto">
                    <VroomButton
                        onClick={handleProceed}
                        disabled={!serviceMode || !selectedVehicle}
                        size="lg"
                        className="w-full h-16 rounded-3xl text-xl shadow-[0_8px_30px_rgba(34,197,94,0.3)]"
                        icon={<ChevronRight className="w-6 h-6" />}
                    >
                        {serviceMode ? (
                            <div className="flex items-center gap-2">
                                <span>Proceed</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-black/30"></span>
                                <span className="opacity-80 font-medium whitespace-nowrap">Est. ₹{estimatedPriceMin}</span>
                            </div>
                        ) : "Select Service Mode"}
                    </VroomButton>
                </div>
            </div>
        </>
    );
};
