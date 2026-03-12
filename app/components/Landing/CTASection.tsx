"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { setLoginModalOpen } from "@/app/store/slices/authSlice";

export default function CTASection() {
    const dispatch = useDispatch();

    const handleOpenLogin = () => {
        dispatch(setLoginModalOpen(true));
    };

    return (
        <section className="py-32 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="relative rounded-[48px] overflow-hidden border border-white/5 bg-slate-950 px-6 py-24 text-center">
                    {/* Background Accents */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-theme-green/10 rounded-full blur-[100px] -mr-40 -mt-20" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[80px] -ml-20 -mb-20" />
                    <div className="absolute inset-0 bg-noise opacity-[0.02]" />

                    <div className="relative z-10 max-w-3xl mx-auto space-y-10 animate-in fade-in zoom-in duration-1000">
                        <div className="space-y-4">
                            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none uppercase">
                                ELEVATE YOUR <br />
                                <span className="text-theme-green">DRIVE TODAY.</span>
                            </h2>
                            <p className="text-gray-400 text-base md:text-lg font-medium max-w-xl mx-auto leading-relaxed">
                                Join the elite ecosystem of vehicle owners who demand more from their automotive experience.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <Button
                                size="lg"
                                onClick={handleOpenLogin}
                                className="h-16 px-12 bg-theme-green hover:bg-theme-green/90 text-black font-black uppercase text-xs tracking-[0.3em] rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,223,130,0.2)]"
                            >
                                Get Started
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
