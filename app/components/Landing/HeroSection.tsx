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
        <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-background py-20">
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-theme-amber/5 rounded-full blur-[160px] animate-pulse opacity-50" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[140px] opacity-30" />
                <div className="absolute inset-0 bg-noise opacity-[0.03]" />
            </div>

            <div className="container mx-auto relative z-10 px-4 flex flex-col items-center">
                {/* Floating Badge */}
                <div className="group relative mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="absolute -inset-0.5 bg-linear-to-r from-theme-amber to-amber-700 rounded-full blur-sm opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="relative inline-flex items-center gap-3 rounded-full border border-theme-amber/30 bg-bg-secondary/40 px-6 py-2 backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-theme-amber opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-theme-amber"></span>
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-theme-amber">
                            Real-time Network Active
                        </span>
                    </div>
                </div>

                {/* Hero Title */}
                <div className="max-w-5xl text-center space-y-8 mb-12">
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-text-primary leading-[0.9] animate-in fade-in slide-in-from-bottom-12 duration-1000">
                        THE FUTURE OF <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-b from-theme-amber to-amber-600">
                            VEHICLE CARE
                        </span>
                    </h1>

                    <p className="text-theme-amber text-lg md:text-2xl font-black tracking-[0.2em] uppercase animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-100">
                        Precision. Power. Peace of Mind.
                    </p>

                    <p className="text-text-secondary text-base md:text-xl max-w-2xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-200">
                        TORQ is the premium automotive ecosystem connecting you to high-end garages,
                        specialized tools, and advanced care solutions — instantly.
                    </p>
                </div>

                {/* Primary Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-24 animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-400">
                    <Button
                        size="lg"
                        onClick={handleOpenLogin}
                        className="group relative px-10 h-16 bg-theme-amber text-black font-semibold uppercase text-xs tracking-[0.2em] rounded-[6px] overflow-hidden transition-all hover:scale-105 active:scale-[0.98] border-none"
                    >
                        <span className="relative z-10">Get Started Now</span>
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </Button>
                </div>

                {/* Feature Tags / Social Proof */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-4xl py-12 border-t border-border-subtle animate-in fade-in duration-1000 delay-700">
                    {[
                        { label: 'Network', value: '500+ Garages' },
                        { label: 'Response', value: '< 15 Mins' },
                        { label: 'Services', value: '40+ Types' },
                        { label: 'Rating', value: '4.9/5 stars' }
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center md:items-start text-center md:text-left space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">{item.label}</span>
                            <span className="text-sm font-bold text-text-primary tracking-tight italic">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
