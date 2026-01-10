import React, { useState, useEffect } from "react";
import { ArrowLeft, Star, Info, Check, MapPin, Truck, Loader2, Car } from "lucide-react";
import Image from "next/image";
import { useGetServiceItemsQuery } from "@/app/beService/service-items";
import { useGetServicesQuery } from "@/app/beService/services-service";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import { selectVehicle, Vehicle } from "@/app/store/slices/vehicleSlice";
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
    const rawServiceItems = serviceItemsData?.serviceItems || [];
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

        const bookingData = {
            service_id: service.id,
            vehicle_id: selectedVehicle.id,
            service_mode: serviceMode === "location" ? "doorstep" : "pickup_drop", // mapping to enum
            price: basePrice,
            scheduled_at: new Date().toISOString(),
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
            <div className="min-h-screen pb-32 md:pb-48 animate-slide-up">
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
                        {selectedVehicle ? (
                            <div>
                                <div className="text-white font-bold text-lg">
                                    {selectedVehicle.brand} {selectedVehicle.model}
                                    <span className="text-slate-400 font-normal ml-2 text-sm">· {selectedVehicle.fuel_type}</span>
                                </div>
                                <div className="text-slate-400 text-sm mt-0.5">{selectedVehicle.registration_number || "No Reg Data"}</div>
                            </div>
                        ) : (
                            <div>
                                <div className="text-white font-bold text-lg">No Vehicle Selected</div>
                                <div className="text-slate-400 text-sm mt-0.5">Please select a vehicle</div>
                            </div>
                        )}

                        {/* <Dialog open={isVehicleDialogOpen} onOpenChange={setIsVehicleDialogOpen}>
                            <DialogTrigger asChild>
                                <button className="text-green-500 text-sm font-semibold hover:text-green-400">
                                    Change
                                </button>
                            </DialogTrigger>
                            <DialogContent className="bg-[#0D212C] border-slate-700 text-white w-[90%] rounded-2xl">
                                <DialogHeader>
                                    <DialogTitle>Select Vehicle</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-3 mt-4">
                                    {vehicles.map((v) => (
                                        <div
                                            key={v.id}
                                            onClick={() => handleVehicleSelect(v)}
                                            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${selectedVehicle?.id === v.id
                                                ? "bg-green-900/20 border-green-500"
                                                : "bg-[#1A2C35] border-transparent hover:bg-[#233842]"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                                                    <Car className="w-5 h-5 text-slate-400" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm text-white">{v.brand} {v.model}</div>
                                                    <div className="text-xs text-slate-400">{v.registration_number}</div>
                                                </div>
                                            </div>
                                            {selectedVehicle?.id === v.id && <Check className="w-5 h-5 text-green-500" />}
                                        </div>
                                    ))}
                                    {vehicles.length === 0 && (
                                        <p className="text-slate-400 text-center py-4">No vehicles found. Please add a vehicle in your profile.</p>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog> */}
                    </div>

                    {/* Section 3: Price Transparency */}
                    <div className="bg-[#1A2C35] rounded-xl p-6 border border-slate-700">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-slate-400 font-medium text-sm flex items-center gap-1">
                                Estimated Price <Info className="w-4 h-4 text-slate-500" />
                            </span>
                            {isServicesLoading && <Loader2 className="w-4 h-4 animate-spin text-green-500" />}
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">
                            ₹{estimatedPriceMin} – ₹{estimatedPriceMax}
                        </div>
                        <p className="text-slate-400 text-xs text-wrap break-words">Final price confirmed after inspection. Base price for {selectedVehicle?.vehicle_type?.replace("_", " ") || "vehicle"}.</p>
                    </div>

                    {/* Section 5: Service Includes */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Service Includes</h3>
                        <div className="bg-[#1A2C35] rounded-xl p-6 border border-slate-700">
                            {isItemsLoading ? (
                                <div className="flex justify-center py-6">
                                    <Loader2 className="h-6 w-6 animate-spin text-green-500" />
                                </div>
                            ) : serviceItems.length > 0 ? (
                                <ul className="space-y-4">
                                    {serviceItems.map((item: any, idx: number) => (
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
            <div className="fixed bottom-[80px] md:bottom-24 left-0 right-0 p-4 bg-gradient-to-t from-[#091A23] via-[#091A23] to-transparent z-[50] md:bg-[#091A23] md:border-t md:border-slate-800 md:rounded-t-2xl md:max-w-4xl md:mx-auto">
                <div className="max-w-4xl mx-auto">
                    <Button
                        onClick={handleProceed}
                        disabled={!serviceMode || !selectedVehicle}
                        className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-2 ${serviceMode && selectedVehicle
                            ? "bg-green-600 text-white hover:bg-green-700 shadow-green-900/20"
                            : "bg-slate-700 text-slate-400 cursor-not-allowed"
                            }`}
                    >
                        {serviceMode ? `Proceed · Est. ₹${estimatedPriceMin}` : "Select Service Mode"}
                    </Button>
                </div>
            </div>
        </>
    );
};
