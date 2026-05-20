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
        <section className="py-32 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="relative rounded-[48px] overflow-hidden border border-[#E4E7EC] bg-[#F8F9FB] px-6 py-24 text-center">
                    <div className="relative z-10 max-w-3xl mx-auto space-y-10 animate-in fade-in zoom-in duration-1000">
                        <div className="space-y-4">
                            <h2 className="text-5xl md:text-7xl font-black text-[#0F172A] tracking-tighter leading-none uppercase">
                                ELEVATE YOUR <br />
                                <span className="text-[#6B2FA0]">DRIVE TODAY.</span>
                            </h2>
                            <p className="text-[#475569] text-base md:text-lg font-medium max-w-xl mx-auto leading-relaxed">
                                Join the elite ecosystem of vehicle owners who demand more from their automotive experience.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <Button
                                size="lg"
                                onClick={handleOpenLogin}
                                className="h-16 px-12 bg-[#6B2FA0] hover:bg-[#6B2FA0] text-white font-bold uppercase text-xs tracking-[0.3em] rounded-xl transition-all hover:scale-105 active:scale-95 shadow-none"
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
