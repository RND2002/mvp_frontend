"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectLocation, setAddress, setCity } from "@/app/store/slices/locationSlice";
import { MapPin, ChevronDown } from "lucide-react";
import { reverseGeocode } from "@/app/lib/locationUtils";

export default function LocationHeader() {
    const { address, city, lat, lng, permissionStatus, loading } = useSelector(selectLocation);
    const dispatch = useDispatch();

    useEffect(() => {
        // If we have coords but no address/city (e.g. from fresh reload where lat/lng loaded from storage but address missing/stale), fetch it.
        // Or if permission granted recently.
        if (lat && lng && (!address || !city)) {
            // console.log("Fetching address for header...");
            reverseGeocode(lat, lng).then((result) => {
                if (result) {
                    dispatch(setAddress(result.formattedAddress));
                    dispatch(setCity(result.city));

                    // Update local storage to include the new city so we don't re-fetch next time
                    // We need to match the structure used in LocationPermissionDialog
                    const existingStorage = localStorage.getItem("user_location");
                    let storageData: any = {};
                    if (existingStorage) {
                        try {
                            storageData = JSON.parse(existingStorage);
                        } catch (e) { }
                    }

                    localStorage.setItem("user_location", JSON.stringify({
                        ...storageData,
                        lat,
                        lng, // Ensure these are fresh/current
                        address: result.formattedAddress,
                        city: result.city
                    }));
                }
            });
        }
    }, [lat, lng, address, city, dispatch]);

    const displayAddress = address || "Detecting location...";
    const title = permissionStatus === 'granted' ? "Current Location" : "Select Location";

    return (
        <div className="flex flex-col cursor-pointer group ml-4">
            <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-green-500 uppercase tracking-wider">
                    {title}
                </span>
                <ChevronDown className="w-3 h-3 text-green-500 group-hover:rotate-180 transition-transform duration-200" />
            </div>
            <div className="text-sm font-medium text-white truncate max-w-[200px] sm:max-w-[300px]">
                {loading ? (
                    <span className="animate-pulse text-[#475569]">Locating...</span>
                ) : (
                    displayAddress
                )}
            </div>
        </div>
    );
}
