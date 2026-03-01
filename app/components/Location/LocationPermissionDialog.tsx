"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import {
    selectLocation,
    setCoordinates,
    setAddress,
    setCity,
    setLocationError,
    setPermissionStatus,
    setLocationLoading,
} from "@/app/store/slices/locationSlice";
import { reverseGeocode } from "@/app/lib/locationUtils";

export default function LocationPermissionDialog() {
    const dispatch = useDispatch();
    const { lat, permissionStatus, loading } = useSelector(selectLocation);
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        // Check local storage on mount
        const savedLocation = localStorage.getItem("user_location");
        if (savedLocation) {
            try {
                const { lat, lng, address, city } = JSON.parse(savedLocation);
                if (lat && lng) {
                    dispatch(setCoordinates({ lat, lng }));
                    dispatch(setPermissionStatus("granted"));
                    if (address) dispatch(setAddress(address));
                    if (city) dispatch(setCity(city));
                    return; // Already have location
                }
            } catch (e) {
                console.error("Failed to parse saved location", e);
            }
        }

        // If no location in state or storage, check permission/prompt
        if (!lat && permissionStatus !== "granted") {
            // We can try to fetch immediately to see if permission was already granted?
            // Or just open the dialog to be safe and "explain" first as requested ("give him reason").
            // The user requested: "give him reason... only allow if he allow". 
            // So showing dialog FIRST is better UX for this requirement.
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [lat, permissionStatus, dispatch]);

    const handleAllowLocation = () => {
        dispatch(setLocationLoading(true));
        if (!navigator.geolocation) {
            dispatch(setLocationError("Geolocation is not supported by your browser"));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                dispatch(setCoordinates({ lat: latitude, lng: longitude }));
                dispatch(setPermissionStatus("granted"));
                setOpen(false); // Close dialog immediately on success

                // Fetch address
                const result = await reverseGeocode(latitude, longitude);
                if (result) {
                    dispatch(setAddress(result.formattedAddress));
                    dispatch(setCity(result.city));
                    // Save complete data to localStorage (storing address as string for consistency)
                    localStorage.setItem("user_location", JSON.stringify({
                        lat: latitude,
                        lng: longitude,
                        address: result.formattedAddress,
                        city: result.city
                    }));
                } else {
                    // Save even without address if geocoding fails, at least we have coords
                    localStorage.setItem("user_location", JSON.stringify({
                        lat: latitude,
                        lng: longitude
                    }));
                }
                dispatch(setLocationLoading(false));
            },
            (error) => {
                console.error("Geolocation error:", error);
                dispatch(setLocationError(error.message));
                dispatch(setPermissionStatus("denied"));
                dispatch(setLocationLoading(false));
                // We might want to keep the dialog open or show an error state inside it if denied
                // For now, if denied, the dialog stays open effectively enforcing the requirement? 
                // Or strictly requires a retry.
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={() => { }}>
            {/* prevent closing by clicking outside/esc by passing empty handler or controlled open without setOpen exposed */}
            <DialogContent className="sm:max-w-[425px] [&>button]:hidden bg-vehicle-card-bg text-foreground border-vehicle-card-border rounded-[2.5rem] shadow-2xl shadow-black/60 p-0 overflow-hidden">
                <div className="relative p-8 pt-10">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-theme-green/5 rounded-full blur-[80px] -mr-24 -mt-24 pointer-events-none"></div>

                    <DialogHeader className="relative z-10">
                        <div className="flex justify-center mb-6">
                            <div className="h-20 w-20 bg-theme-green/10 border border-theme-green/20 rounded-2xl flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(0,223,130,0.1)]">
                                <MapPin className="w-10 h-10 text-theme-green" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-theme-green text-center text-[10px] font-black uppercase tracking-[0.3em] mb-1">Authorization Required</p>
                            <DialogTitle className="text-center text-2xl font-black tracking-tighter uppercase text-white">Location Access</DialogTitle>
                        </div>
                        <DialogDescription className="text-center text-gray-400 font-medium leading-relaxed pt-2 px-2">
                            To find the best mechanics near you and provide accurate service times, we need access to your device's location.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex justify-center pt-8 relative z-10">
                        <Button
                            onClick={handleAllowLocation}
                            disabled={loading}
                            className="w-full h-14 bg-theme-green hover:bg-theme-green/90 text-[#020617] font-black uppercase tracking-widest text-xs rounded-2xl transition-all duration-300 shadow-lg shadow-theme-green/20"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-[#020617]/20 border-t-[#020617] rounded-full animate-spin"></div>
                                    Detecting...
                                </div>
                            ) : "Allow Access"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
