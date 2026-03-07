"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

import { useDispatch } from "react-redux";
import { setLoginModalOpen } from "@/app/store/slices/authSlice";

export default function HeroSection() {
    const dispatch = useDispatch();

    const handleOpenLogin = () => {
        dispatch(setLoginModalOpen(true));
    };

    return (
        <section className="relative w-full pt-20 pb-16 flex flex-col items-center justify-center overflow-hidden bg-primary-theme">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-5%] left-[15%] w-[600px] h-[600px] bg-theme-green/10 rounded-full blur-[140px] mix-blend-screen animate-pulse" />
                <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] mix-blend-screen" />
            </div>

            <div className="container mx-auto relative z-10 px-4 flex flex-col items-center text-center">
                {/* Pulse Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-theme-green/30 bg-theme-green/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-theme-green mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <span className="flex h-2 w-2 rounded-full bg-theme-green animate-pulse"></span>
                    Nearby Help Available
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 max-w-4xl leading-[1.1]">
                    Everything Your <span className="text-theme-green">Vehicle Needs.</span> <br />
                    In One Place.
                </h1>

                <p className="text-gray-400 text-sm md:text-base max-w-2xl mb-10 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-900">
                    Vroom connects drivers with garages, vehicle services, tools, and essential vehicle care solutions — instantly.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    <Button
                        size="lg"
                        onClick={handleOpenLogin}
                        className="px-8 h-12 bg-theme-green text-black font-black uppercase text-xs tracking-widest rounded-full border-0 shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all hover:scale-105 active:scale-95"
                    >
                        Sign In to Vroom
                    </Button>
                </div>

                {/* Supporting Text Row */}
                <div className="flex flex-wrap justify-center gap-6 md:gap-12 py-8 border-y border-white/5 w-full max-w-4xl animate-in fade-in duration-1000 delay-500">
                    {['Service', 'Repair', 'Tools', 'Add-ons'].map((item) => (
                        <div key={item} className="flex items-center gap-2">
                            <span className="h-1 w-1 rounded-full bg-theme-green" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{item}</span>
                        </div>
                    ))}
                    <div className="hidden md:block text-[10px] font-black uppercase tracking-[0.2em] text-theme-green ml-4">All connected.</div>
                </div>

                {/* Hero Automotive Visual - Removed as per user request */}
                {/*
            <div className="w-full max-w-6xl relative animate-in fade-in zoom-in duration-1000 delay-300">
                <div className="absolute inset-0 bg-gradient-to-t from-primary-theme via-transparent to-transparent z-10" />
                <img
                    src="/landing-car.png"
                    alt="Premium Automotive Service"
                    className="w-full h-auto rounded-3xl object-cover shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                />
            </div>
            */}
            </div>
        </section>
    );
}
