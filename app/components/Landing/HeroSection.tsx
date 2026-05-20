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
        <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-white py-20">
            <div className="container mx-auto relative z-10 px-4 flex flex-col items-center">
                {/* Floating Badge */}
                <div className="group relative mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="relative inline-flex items-center gap-3 rounded-full border border-[#E4E7EC] bg-[#F8F9FB] px-6 py-2">
                        <span className="relative flex h-2 w-2">
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6B2FA0]"></span>
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6B2FA0]">
                            Real-time Network Active
                        </span>
                    </div>
                </div>

                {/* Hero Title */}
                <div className="max-w-5xl text-center space-y-8 mb-12">
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-[#0F172A] leading-[0.9] animate-in fade-in slide-in-from-bottom-12 duration-1000">
                        THE FUTURE OF <br />
                        <span className="text-[#6B2FA0]">
                            VEHICLE CARE
                        </span>
                    </h1>

                    <p className="text-[#475569] text-base md:text-xl max-w-2xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-200">
                        Vroom is the all-in-one automotive ecosystem connecting you to premium garages,
                        specialized tools, and advanced care solutions — instantly.
                    </p>
                </div>

                {/* Primary Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-24 animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-400">
                    <Button
                        size="lg"
                        onClick={handleOpenLogin}
                        className="px-10 h-16 bg-[#6B2FA0] hover:bg-[#6B2FA0] text-white font-bold uppercase text-xs tracking-[0.2em] rounded-xl transition-all hover:scale-105 active:scale-95 shadow-none"
                    >
                        Get Started Now
                    </Button>
                </div>

                {/* Feature Tags / Social Proof */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-4xl py-12 border-t border-[#E4E7EC] animate-in fade-in duration-1000 delay-700">
                    {[
                        { label: 'Network', value: '500+ Garages' },
                        { label: 'Response', value: '< 15 Mins' },
                        { label: 'Services', value: '40+ Types' },
                        { label: 'Rating', value: '4.9/5 stars' }
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center md:items-start text-center md:text-left space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#94A3B8]">{item.label}</span>
                            <span className="text-sm font-bold text-[#0F172A] tracking-tight italic">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
