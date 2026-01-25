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
            <DialogContent className="sm:max-w-[425px] [&>button]:hidden bg-slate-900 text-white border-slate-800">
                {/* [&>button]:hidden hides the close X button */}
                <DialogHeader>
                    <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 bg-blue-500/20 rounded-full flex items-center justify-center animate-bounce">
                            <MapPin className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>
                    <DialogTitle className="text-center text-xl">Location Access Required</DialogTitle>
                    <DialogDescription className="text-center text-gray-400 pt-2">
                        To provide you with the best mechanics nearby and accurate service times, we need access to your device's location.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center pt-4">
                    <Button
                        onClick={handleAllowLocation}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {loading ? "Detecting..." : "Allow Location Access"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
