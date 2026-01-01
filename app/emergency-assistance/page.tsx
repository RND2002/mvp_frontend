"use client";

import React, { useEffect } from "react";
import { useGeoLocation } from "@/app/hooks/useGeoLocation";
import PrimaryButton from "@/app/components/common/PrimaryButton";
import { PhoneCall, AlertTriangle, Navigation, MapPin } from "lucide-react";

export default function EmergencyHelpPage() {
    const { loaded, error, coordinates } = useGeoLocation();

    const handleBookEmergency = () => {
        if (error) {
            alert("Please enable location services to book emergency help.");
            return;
        }
        // Logic to book service
        console.log("Booking emergency service at", coordinates);
        alert("Emergency Service Requested! Help is on the way.");
    };

    const handleCallPolice = () => {
        window.location.href = "tel:911"; // Or local equivalent
    };

    // Simulated Map Background (Pattern or filtered image)
    // Using a gradient/pattern to simulate a map view for now
    const mapBackgroundClass = "bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=40.714728,-73.998672&zoom=14&size=800x800&key=YOUR_API_KEY_PLACEHOLDER')] bg-cover bg-center bg-no-repeat bg-slate-200";
    // Since we don't have a real API key, let's use a nice illustrated map placeholder or just a CSS pattern that looks like a map
    // or a gray geometric pattern.
    // Actually, let's use a simple SVG pattern or just a solid color with a message for MVP if specific asset isn't available.
    // But user wants "this kind of screen", so I will try to make it look like a map.

    return (
        <div className="relative h-screen w-full bg-slate-200 overflow-hidden flex flex-col">
            {/* Map Background Layer */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Using an iframe to simulate a map effectively without API key restrictions for display 
              Or better, a static image from Unsplash that looks like a map view.
          */}
                <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000"
                    alt="Map Background"
                    className="w-full h-full object-cover opacity-60 grayscale contrast-125 brightness-110"
                />

                {/* Map Grid Overlay simulating streets if needed (optional) */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            </div>

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 p-5 pt-8 flex items-center justify-between bg-gradient-to-b from-white/80 to-transparent md:from-transparent md:p-8">
                <button className="p-2 rounded-full bg-white shadow-md hover:bg-slate-50 transition-colors" onClick={() => window.history.back()}>
                    {/* Back Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-slate-700"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <h1 className="text-lg font-bold text-slate-800 tracking-wide uppercase bg-white/50 backdrop-blur-md px-4 py-1 rounded-full shadow-sm">
                    Location
                </h1>
                <button className="p-2 rounded-full bg-white shadow-md hover:bg-slate-50 transition-colors">
                    <span className="sr-only">Menu</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-slate-700"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></svg>
                    {/* Simple kebab menu icon */}
                    <div className="flex flex-col gap-1 items-center justify-center w-5 h-5">
                        <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
                        <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
                        <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
                    </div>
                </button>
            </div>

            {/* User Location Marker (Center) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 flex flex-col items-center justify-center">
                {/* Pulse Effect */}
                <div className="relative">
                    <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping opacity-75"></div>
                    <div className="relative w-16 h-16 md:w-20 md:h-20 bg-white p-1 rounded-full shadow-xl overflow-hidden border-4 border-cyan-100">
                        <div className="w-full h-full bg-slate-200 rounded-full flex items-center justify-center text-slate-400 font-bold overflow-hidden">
                            {/* Placeholder Avatar */}
                            <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=60" alt="User" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Permission Alert (if needed or just checking hooks) */}
            {!loaded && (
                <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 bg-black/70 text-white px-4 py-2 rounded-full backdrop-blur-md text-xs font-medium animate-pulse">
                    Getting Location...
                </div>
            )}
            {error && (
                <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg text-xs font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Please enable location access
                </div>
            )}


            {/* Bottom Sheet / Interaction Area */}
            {/* On Phone: Bottom Sheet. On Laptop: Centered floating card or Left side panel. 
          User requested "ensure good look for laptop".
          I'll stick to a bottom-center floating card style which looks good on both.
      */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-4 md:p-8 flex justify-center">
                <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl p-6 md:p-8 border border-slate-100 dark:border-slate-800 animate-slide-up">

                    {/* Drag Handle (Visual only) */}
                    <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6"></div>

                    {/* User Info Row */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 shrink-0">
                            <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=60" alt="User" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-none mb-1">Eleanor Fant</h3>
                            <span className="inline-block bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Need Help
                            </span>
                        </div>
                        <button className="text-slate-400 hover:text-slate-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>
                        </button>
                    </div>

                    {/* Location Info */}
                    <div className="text-center mb-8">
                        <h4 className="text-red-500 font-bold text-lg mb-2">Need Help</h4>
                        <p className="text-slate-600 dark:text-slate-300 font-medium text-sm md:text-base px-8 leading-relaxed">
                            {loaded && coordinates
                                ? `${coordinates.latitude.toFixed(4)} N, ${coordinates.longitude.toFixed(4)} E (Approx)`
                                : "Detecting Location..."
                            }
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            {error ? "Location access denied" : "Monday, 20 December 01:50:34 PM"}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="w-full">
                        <PrimaryButton
                            onClick={handleBookEmergency}
                            className="w-full !rounded-full py-4 text-base font-bold uppercase tracking-wider !bg-red-500 hover:!bg-red-600 shadow-lg shadow-red-200"
                            openPopup={false}
                        >
                            Call for Help
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
