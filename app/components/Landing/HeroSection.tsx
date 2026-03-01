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
        <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-black">
            {/* Abstract Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-green-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
                <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] mix-blend-screen" />
            </div>

            <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center">
                <div className="inline-flex items-center rounded-full border border-gray-800 bg-gray-950/50 px-3 py-1 text-sm text-gray-400 backdrop-blur-xl mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                    Now Live: AI Vehicle Health Tracking
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent max-w-4xl mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-forwards">
                    Your smart partner for <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                        car & bike care
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-forwards leading-relaxed">
                    Experience doorstep servicing, real-time health tracking, and verified mechanics.
                    The smartest way to manage your vehicle is finally here.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-16 duration-1000 fill-mode-forwards">
                    <Button
                        size="lg"
                        onClick={handleOpenLogin}
                        className="w-full cursor-pointer sm:w-auto px-8 h-12 text-base font-semibold bg-green-600 hover:bg-green-500 hover:text-white text-black shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all hover:scale-105"
                    >
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>

                {/* Stats / trust indicators */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 border-t border-white/5 pt-8 animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-300">
                    {[
                        { label: "Satisfied Users", value: "10k+" },
                        { label: "Verified Mechanics", value: "500+" },
                        { label: "Services Completed", value: "50k+" },
                        { label: "Cities", value: "12+" },
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <span className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</span>
                            <span className="text-sm text-gray-500">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
