"use client"

import React, { useState, useEffect } from "react";
import { ArrowLeft, Star, Info, Check, MapPin, Truck, Car, Bike, Sparkles, ChevronRight } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import Image from "next/image";
import { useGetServiceItemsQuery } from "@/app/beService/service-items";
import { useGetServicesQuery } from "@/app/beService/services-service";
import { VEHICLE_TYPE } from "@/app/beService/vehicle-service";
import { VroomButton } from "../../components/common/VroomButton";
import { ServiceIncludes } from "./ServiceIncludes";
import { cn } from "@/lib/utils";
import { LocationSelector } from "@/app/components/Location/LocationSelector";
import { UserLocation } from "@/app/beService/user-location-service";


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
    const [selectedLocation, setSelectedLocation] = useState<UserLocation | null>(null);


    // Mutations


    // Redux State
    const { selectedVehicle, vehicles } = useSelector((state: RootState) => state.vehicle);
    const { lat, lng, city, address } = useSelector(selectLocation);

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
        if (!selectedLocation && (lat === null || lng === null)) {
            toast.error("Please select a service location.");
            return;
        }

        const finalLat = selectedLocation ? selectedLocation.latitude : lat;
        const finalLng = selectedLocation ? selectedLocation.longitude : lng;
        const finalAddress = selectedLocation ? selectedLocation.address : address || "Unknown";
        const finalCity = selectedLocation?.city || city || "Unknown";

        console.log("!!! ATTENTION: GENERATING BOOKING DATA V3 !!!");
        const bookingData = {
            service_id: String(service.id),
            vehicle_id: String(selectedVehicle.id),
            service_mode: String(serviceMode === "location" ? "doorstep" : "pickup_drop"),
            price: Number(basePrice || 0),
            scheduled_at: new Date().toISOString(),
            delivery_address: String(finalAddress || ""),
            userLocation: {
                lat: Number(finalLat || 0),
                lng: Number(finalLng || 0),
                city: String(finalCity || "Unknown City")
            },
            _v: "v3" // Version flag to detect if new code is running
        };

        console.log("DEBUG: finalCity =", finalCity);
        console.log("DEBUG: finalAddress =", finalAddress);
        console.log("DEBUG: bookingData to proceed:", bookingData);

        onProceed({
            service: { ...service, base_price: basePrice },
            vehicle: selectedVehicle,
            bookingRequest: bookingData,
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
            <div className="min-h-screen pb-40 lg:pb-24 animate-slide-up bg-background overflow-x-hidden">
                {/* Header Section: Dramatically improved for desktop */}
                <div className="relative w-full h-[200px] md:h-[300px]">
                    {/* <Image
                        src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=1000"
                        alt="Service Header"
                        fill
                        className="object-cover opacity-60"
                        priority
                    /> */}
                    {/* <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div> */}
                    {/* <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-transparent"></div> */}

                    {/* Navigation - Premium Desktop Refinement */}
                    <div className="absolute top-0 left-0 right-0 p-6 lg:px-12 lg:py-8 flex items-center justify-between z-20">
                        <button
                            onClick={onBack}
                            className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all hover:border-white/20 active:scale-95 group"
                        >
                            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Hero Text - Left-aligned for Desktop */}
                    <div className="absolute bottom-12 left-6 right-6 lg:left-12 lg:bottom-16 max-w-7xl">
                        <h1 className="text-2xl md:text-4xl font-black text-white mb-2 md:mb-4 uppercase italic tracking-tighter leading-none">
                            {service.label || service.name} <span className="text-[10px] opacity-20">v3</span>
                        </h1>
                        <div className="flex items-center gap-3">
                            <p className="text-theme-green font-black text-xs md:text-xl uppercase tracking-[0.3em] flex items-center gap-2">
                                <Sparkles className="w-4 h-4 md:w-6 md:h-6" />
                                Professional care
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content: Responsive 2-Column Grid */}
                <div className="px-4 lg:px-12 max-w-4xl lg:max-w-7xl mx-auto lg:mx-0 space-y-8 -mt-10 lg:-mt-12 relative z-10 lg:grid lg:grid-cols-12 lg:gap-12 lg:space-y-0">

                    {/* Left Column: Information */}
                    <div className="lg:col-span-7 space-y-10">
                        {/* Service Description Card - Just for desktop */}
                        <div className="hidden lg:block bg-vehicle-card-bg border border-vehicle-card-border rounded-3xl p-8 shadow-xl">
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4 italic">Service Overview</h2>
                            <p className="text-gray-400 font-medium leading-relaxed text-lg italic">
                                Our comprehensive automotive service is designed to keep your vehicle running like new.
                                We perform detailed inspections and use high-grade parts to ensure maximum performance and safety.
                            </p>
                        </div>

                        {/* Service Includes Section */}
                        <ServiceIncludes
                            items={serviceItems}
                            isLoading={isItemsLoading}
                        />
                    </div>

                    {/* Right Column: Sticky Selection Sidebar */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="lg:sticky lg:top-12 space-y-6">

                            {/* Selected Vehicle Card */}
                            <div className="bg-vehicle-card-bg rounded-3xl p-6 border border-vehicle-card-border flex justify-between items-center shadow-2xl relative overflow-hidden group">
                                {selectedVehicle ? (
                                    <div className="flex items-center gap-5 relative z-10">
                                        <div className="w-14 h-14 bg-theme-green/10 rounded-2xl flex items-center justify-center border border-theme-green/20">
                                            {selectedVehicle.vehicle_type === VEHICLE_TYPE.TWO_WHEELER ? (
                                                <Bike className="w-7 h-7 text-theme-green" />
                                            ) : (
                                                <Car className="w-7 h-7 text-theme-green" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Selected Vehicle</p>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-base font-black text-white uppercase tracking-tight">
                                                    {selectedVehicle.brand} {selectedVehicle.model}
                                                </h3>
                                                <div className="w-1 h-1 rounded-full bg-theme-green/50"></div>
                                                <span className="text-[10px] font-bold text-theme-green uppercase tracking-wider">{selectedVehicle.fuel_type}</span>
                                            </div>
                                            <div className="text-gray-500 text-[10px] font-bold tracking-widest uppercase">{selectedVehicle.registration_number || "NO REG DATA"}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                                            <Car className="w-6 h-6 text-gray-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">No Vehicle Selected</h3>
                                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest leading-none mt-1">Select from profile</p>
                                        </div>
                                    </div>
                                )}
                                {/* Corner Glow */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-theme-green/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-theme-green/10 transition-colors"></div>
                            </div>

                            {/* Location Selection */}
                            <LocationSelector
                                onLocationSelect={setSelectedLocation}
                                selectedLocationId={selectedLocation?.id}
                            />


                            {/* Price Card */}
                            <div className="bg-vehicle-card-bg rounded-3xl p-8 border border-vehicle-card-border shadow-2xl relative overflow-hidden group">
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-gray-500 font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-2">
                                            Total Estimated Price <Info className="w-4 h-4 text-gray-700" />
                                        </span>
                                        {isServicesLoading && <Loader size="sm" />}
                                    </div>
                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-5xl font-black text-white tracking-tighter italic">₹{estimatedPriceMin}</span>
                                        <span className="text-gray-500 font-bold text-xl tracking-tighter italic">— ₹{estimatedPriceMax}</span>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <p className="text-gray-500 text-[10px] font-medium leading-relaxed uppercase tracking-wider">
                                            Final price confirmed after inspection. Base price for <span className="text-theme-green">{selectedVehicle?.vehicle_type?.replace("_", " ") || "vehicle"}</span>.
                                        </p>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 right-0 w-32 h-32 bg-theme-green/5 rounded-full blur-3xl -mr-16 -mb-16 group-hover:bg-theme-green/10 transition-colors"></div>
                            </div>

                            {/* Service Mode Selection */}
                            <div className="space-y-4">
                                <h3 className="text-white font-black text-lg uppercase italic tracking-tighter flex items-center gap-2 px-1">
                                    <Truck className="w-5 h-5 text-theme-green" />
                                    Choose Service Mode
                                </h3>
                                <div className="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setServiceMode("location")}
                                        className={cn(
                                            "p-6 rounded-3xl border-2 flex flex-col items-center gap-4 transition-all duration-300 relative overflow-hidden group",
                                            serviceMode === "location"
                                                ? "bg-theme-green/10 border-theme-green text-white shadow-[0_0_30px_rgba(34,197,94,0.15)] scale-[1.02]"
                                                : "bg-vehicle-card-bg border-vehicle-card-border text-gray-500 hover:border-white/20"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300",
                                            serviceMode === "location" ? "bg-theme-green/20 scale-110" : "bg-white/5"
                                        )}>
                                            <MapPin className={cn("w-6 h-6", serviceMode === "location" ? "text-theme-green shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "text-gray-600")} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-center">At my location</span>
                                    </button>

                                    <button
                                        onClick={() => setServiceMode("pickup")}
                                        className={cn(
                                            "p-6 rounded-3xl border-2 flex flex-col items-center gap-4 transition-all duration-300 relative overflow-hidden group",
                                            serviceMode === "pickup"
                                                ? "bg-theme-green/10 border-theme-green text-white shadow-[0_0_30px_rgba(34,197,94,0.15)] scale-[1.02]"
                                                : "bg-vehicle-card-bg border-vehicle-card-border text-gray-500 hover:border-white/20"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300",
                                            serviceMode === "pickup" ? "bg-theme-green/20 scale-110" : "bg-white/5"
                                        )}>
                                            <Truck className={cn("w-6 h-6", serviceMode === "pickup" ? "text-theme-green" : "text-gray-600")} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-center">Pickup & Drop</span>
                                    </button>
                                </div>
                            </div>

                            {/* Desktop Proceed Button - Hidden on mobile */}
                            <div className="hidden lg:block pt-4">
                                <VroomButton
                                    onClick={handleProceed}
                                    disabled={!serviceMode || !selectedVehicle || !selectedLocation}
                                    size="lg"

                                    className="w-full h-16 rounded-3xl text-xl font-black uppercase tracking-[0.2em] shadow-[0_12px_40px_rgba(0,223,130,0.3)] bg-theme-green text-black border-none"
                                    icon={<ChevronRight className="w-6 h-6" />}
                                >
                                    {serviceMode ? (
                                        <div className="flex items-center gap-3">
                                            <span>Proceed</span>
                                            <div className="w-1.5 h-1.5 rounded-full bg-black/40"></div>
                                            <span className="font-bold opacity-80">₹{estimatedPriceMin}</span>
                                        </div>
                                    ) : !selectedLocation ? "Select Location" : "Select Service Mode"}

                                </VroomButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky CTA - Hidden on Laptop screens */}
            <div className="fixed bottom-[80px] left-0 right-0 p-4 bg-linear-to-t from-background via-background/95 to-transparent z-50 lg:hidden">
                <div className="max-w-4xl mx-auto">
                    <VroomButton
                        onClick={handleProceed}

                        disabled={!serviceMode || !selectedVehicle || !selectedLocation}
                        size="lg"

                        className="w-full h-16 rounded-3xl text-lg font-black uppercase tracking-wider shadow-[0_12px_40px_rgba(0,223,130,0.35)] bg-theme-green text-black border-none"
                        icon={<ChevronRight className="w-6 h-6" />}
                    >
                        {serviceMode ? (
                            <div className="flex items-center gap-3">
                                <span>Proceed</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-black/40"></div>
                                <span className="font-bold">₹{estimatedPriceMin}</span>
                            </div>
                        ) : !selectedLocation ? "Select Location" : "Select Service Mode"}

                    </VroomButton>
                </div>
            </div>
        </>
    );
};
