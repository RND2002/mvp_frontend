"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectLocation } from "@/app/store/slices/locationSlice";
import {
    MapPin,
    Plus,
    Home,
    Briefcase,
    Navigation,
    Check,
    Loader2,
    Search,
    ChevronRight,
    Map as MapIcon,
    Trash2
} from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetDescription
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetUserLocationsQuery, useCreateUserLocationMutation, useDeleteUserLocationMutation, UserLocation } from "@/app/beService/user-location-service";
import { useGeoLocation } from "@/app/hooks/useGeoLocation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";

interface LocationSelectorProps {
    onLocationSelect: (location: UserLocation) => void;
    selectedLocationId?: string;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
    onLocationSelect,
    selectedLocationId
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    // API Hooks
    const { data: locationsData, isLoading: isFetching } = useGetUserLocationsQuery();
    const [createLocation, { isLoading: isCreating }] = useCreateUserLocationMutation();
    const [deleteLocation] = useDeleteUserLocationMutation();

    // GeoLocation Hook for adding new
    const geo = useGeoLocation();
    const { city: reduxCity } = useSelector(selectLocation);

    // Form State for new location
    const [newLocation, setNewLocation] = useState({
        label: "Other",
        houseNo: "",
        building: "",
        landmark: "",
        latitude: 0,
        longitude: 0,
        is_default: false
    });


    const locations = locationsData?.data || locationsData?.locations || [];
    const selectedLocation = locations.find(l => l.id === selectedLocationId) || locations.find(l => l.is_default);

    useEffect(() => {
        if (isAdding && geo.loaded && geo.coordinates) {
            setNewLocation(prev => ({
                ...prev,
                latitude: geo.coordinates?.latitude || 0,
                longitude: geo.coordinates?.longitude || 0
            }));
        }
    }, [isAdding, geo.loaded, geo.coordinates]);

    const handleAddClick = () => {
        setIsAdding(true);
    };

    const handleSaveLocation = async () => {
        if (!newLocation.houseNo || !newLocation.building) {
            toast.error("Please provide both House No and Building/Area.");
            return;
        }

        if (!newLocation.latitude || !newLocation.longitude) {
            toast.error("Location coordinates not found. Please enable GPS.");
            return;
        }

        try {
            // Combine address parts
            const combinedAddress = [
                newLocation.houseNo,
                newLocation.building,
                newLocation.landmark ? `(Landmark: ${newLocation.landmark})` : ""
            ].filter(Boolean).join(", ");

            const result = await createLocation({
                label: newLocation.label || "Other",
                address: combinedAddress,
                delivery_address: combinedAddress,
                city: reduxCity || undefined,
                latitude: newLocation.latitude,
                longitude: newLocation.longitude,
                is_default: newLocation.is_default
            }).unwrap();

            if (result.success) {
                toast.success("Location saved successfully");
                setIsAdding(false);
                setNewLocation({
                    label: "Other",
                    houseNo: "",
                    building: "",
                    landmark: "",
                    latitude: 0,
                    longitude: 0,
                    is_default: false
                });
                if (result.data) onLocationSelect(result.data);
            }

        } catch (error) {
            toast.error("Failed to save location");
        }
    };


    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        try {
            await deleteLocation(id).unwrap();
            toast.success("Location deleted");
        } catch (err) {
            toast.error("Failed to delete location");
        }
    };

    const getIcon = (label?: string) => {
        const l = label?.toLowerCase() || "";
        if (l.includes("home")) return <Home className="w-4 h-4" />;
        if (l.includes("work") || l.includes("office")) return <Briefcase className="w-4 h-4" />;
        return <MapPin className="w-4 h-4" />;
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <div className="bg-white border border-[#E4E7EC] rounded-3xl p-6 cursor-pointer hover:border-[#6B2FA0]/30 transition-all group relative overflow-hidden">
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 bg-[#6B2FA0]/10 rounded-2xl flex items-center justify-center border border-[#6B2FA0]/20 group-hover:scale-110 transition-transform">
                            <MapPin className="w-6 h-6 text-[#6B2FA0]" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-[#475569] uppercase tracking-widest mb-1">Service Location</p>
                            <h3 className="text-[#0F172A] font-bold text-sm uppercase tracking-tight line-clamp-1">
                                {selectedLocation ? selectedLocation.label || selectedLocation.address : "Select Location"}
                            </h3>
                            <p className="text-[#475569] text-[10px] font-medium uppercase tracking-wider line-clamp-1">
                                {selectedLocation ? selectedLocation.address : "Tap to pick a location"}
                            </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6B2FA0] transition-colors" />
                    </div>
                </div>
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-white border-t border-[#E4E7EC] h-[80vh] rounded-t-[3rem] p-0 overflow-hidden">
                <div className="h-full flex flex-col">
                    <div className="p-8 pb-4">
                        <SheetHeader className="text-left mb-6">
                            <SheetTitle className="text-2xl font-black text-[#0F172A] uppercase italic tracking-tighter">
                                {isAdding ? "Add New Location" : "Select Location"}
                            </SheetTitle>
                            <SheetDescription className="text-[#475569] font-bold uppercase text-[10px] tracking-[0.2em]">
                                {isAdding ? "Set your service address" : "Where should we provide the service?"}
                            </SheetDescription>
                        </SheetHeader>

                        {!isAdding && (
                            <Button
                                onClick={handleAddClick}
                                className="w-full h-14 bg-[#F8F9FB] border border-[#E4E7EC] hover:bg-[#F5EDFC] text-[#0F172A] rounded-2xl flex items-center justify-between px-6 mb-6 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-[#6B2FA0]/20 rounded-lg flex items-center justify-center">
                                        <Plus className="w-4 h-4 text-[#6B2FA0]" />
                                    </div>
                                    <span className="font-black uppercase text-xs tracking-widest">Add New Address</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:translate-x-1 transition-transform" />
                            </Button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto px-8 pb-12">
                        {isAdding ? (
                            <div className="space-y-6 animate-in slide-in-from-right duration-300">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-[#475569] uppercase tracking-widest px-1">Location Label</Label>
                                        <div className="flex gap-2">
                                            {["Home", "Work", "Other"].map(label => (
                                                <button
                                                    key={label}
                                                    onClick={() => setNewLocation(prev => ({ ...prev, label }))}
                                                    className={cn(
                                                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                                        newLocation.label === label
                                                            ? "bg-[#6B2FA0] border-[#6B2FA0] text-white"
                                                            : "bg-[#F8F9FB] border-[#E4E7EC] text-[#475569] hover:border-[#6B2FA0]/50"
                                                    )}
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black text-[#475569] uppercase tracking-widest px-1">House / Flat No.</Label>
                                            <Input
                                                placeholder="e.g. 402, 4th Floor"
                                                className="h-14 bg-white border-[#E4E7EC] rounded-2xl text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#6B2FA0]/50 transition-all"
                                                value={newLocation.houseNo}
                                                onChange={(e) => setNewLocation(prev => ({ ...prev, houseNo: e.target.value }))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black text-[#475569] uppercase tracking-widest px-1">Building/Area</Label>
                                            <Input
                                                placeholder="e.g. Green Towers"
                                                className="h-14 bg-white border-[#E4E7EC] rounded-2xl text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#6B2FA0]/50 transition-all"
                                                value={newLocation.building}
                                                onChange={(e) => setNewLocation(prev => ({ ...prev, building: e.target.value }))}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-[#475569] uppercase tracking-widest px-1">Landmark (Optional)</Label>
                                        <Input
                                            placeholder="e.g. Near City Mall"
                                            className="h-14 bg-white border-[#E4E7EC] rounded-2xl text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#6B2FA0]/50 transition-all"
                                            value={newLocation.landmark}
                                            onChange={(e) => setNewLocation(prev => ({ ...prev, landmark: e.target.value }))}
                                        />
                                    </div>


                                    {/* GPS status indicator without coordinates */}
                                    <div className="p-4 rounded-2xl bg-[#F8F9FB] border border-[#E4E7EC] flex items-center gap-3">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            geo.loaded ? "bg-[#6B2FA0] animate-pulse" : "bg-[#94A3B8]"
                                        )}></div>
                                        <p className="text-[9px] font-black text-[#475569] uppercase tracking-widest">
                                            {geo.loaded ? "Location Pinpointed via GPS" : "Detecting Location..."}
                                        </p>
                                    </div>

                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsAdding(false)}
                                        className="flex-1 h-14 rounded-2xl border-[#E4E7EC] bg-white text-[#0F172A] font-black uppercase tracking-widest hover:bg-[#F8F9FB]"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSaveLocation}
                                        disabled={isCreating}
                                        className="flex-1 h-14 rounded-2xl bg-[#6B2FA0] hover:bg-[#582186] text-white font-black uppercase tracking-widest"
                                    >
                                        {isCreating ? <Loader size="sm" /> : "Save Address"}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {isFetching ? (
                                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                                        <Loader size="lg" text="Loading Addresses..." />
                                        <p className="text-[#475569] text-[10px] font-black uppercase tracking-widest">Loading Addresses...</p>
                                    </div>
                                ) : locations.length === 0 ? (
                                    <div className="text-center py-20 space-y-4">
                                        <div className="w-16 h-16 bg-[#F8F9FB] rounded-full flex items-center justify-center mx-auto">
                                            <MapIcon className="w-8 h-8 text-[#94A3B8]" />
                                        </div>
                                        <p className="text-[#475569] font-bold uppercase text-[10px] tracking-widest">No saved addresses found</p>
                                    </div>
                                ) : (
                                    locations.map(loc => (
                                        <div
                                            key={loc.id}
                                            onClick={() => {
                                                onLocationSelect(loc);
                                                setIsOpen(false);
                                            }}
                                            className={cn(
                                                "p-6 rounded-3xl border transition-all cursor-pointer group flex items-start gap-4",
                                                selectedLocationId === loc.id
                                                    ? "bg-[#6B2FA0]/5 border-[#6B2FA0]"
                                                    : "bg-white border-[#E4E7EC] hover:border-[#6B2FA0]/30"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                                selectedLocationId === loc.id ? "bg-[#6B2FA0] text-white" : "bg-[#F8F9FB] text-[#94A3B8] group-hover:text-[#6B2FA0]"
                                            )}>
                                                {getIcon(loc.label)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-[#0F172A] font-black uppercase text-xs tracking-widest truncate">{loc.label}</span>
                                                    {selectedLocationId === loc.id && (
                                                        <div className="w-5 h-5 bg-[#6B2FA0] rounded-full flex items-center justify-center">
                                                            <Check className="w-3 h-3 text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-[#475569] text-[10px] font-bold uppercase tracking-wider line-clamp-2 leading-relaxed">
                                                    {loc.address || "No address provided"}
                                                </p>
                                            </div>
                                            <button
                                                onClick={(e) => handleDelete(e, loc.id)}
                                                className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-500 hover:text-white"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};
