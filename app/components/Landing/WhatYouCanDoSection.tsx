"use client";

import React from "react";
import { MapPin, Wrench, Package, ShieldAlert } from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description, index }: { icon: any, title: string, description: string, index: number }) => (
    <div
        className="group relative p-8 rounded-[32px] bg-white border border-[#E4E7EC] hover:border-[#6B2FA0]/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
        style={{ animationDelay: `${index * 150}ms` }}
    >
        <div className="relative z-10">
            <div className="h-14 w-14 rounded-2xl bg-[#DCFCE7] flex items-center justify-center mb-8 group-hover:scale-105 transition-all duration-300">
                <Icon className="h-7 w-7 text-[#6B2FA0]" />
            </div>

            <h3 className="text-xl font-black text-[#0F172A] mb-4 tracking-tighter uppercase">{title}</h3>
            <p className="text-[#475569] text-sm leading-relaxed font-medium transition-colors">{description}</p>
        </div>
    </div>
);

export default function WhatYouCanDoSection() {
    const features = [
        {
            icon: MapPin,
            title: "Smart Network",
            description: "Instant access to a verified network of 500+ premium garages and service centers."
        },
        {
            icon: Wrench,
            title: "Elite Services",
            description: "From routine maintenance to complex performance tuning and ceramic coatings."
        },
        {
            icon: Package,
            title: "Pro Hardware",
            description: "A curated marketplace for specialized tools, parts, and high-end automotive gear."
        },
        {
            icon: ShieldAlert,
            title: "Rapid Response",
            description: "Smart 24/7 breakdown assistance with real-time GPS tracking and live updates."
        }
    ];

    return (
        <section className="py-32 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="max-w-3xl mb-20 animate-in fade-in slide-in-from-left-8 duration-1000">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCFCE7] border border-[#DCFCE7] mb-6 font-black text-[10px] text-[#6B2FA0] uppercase tracking-[0.3em]">
                        Capabilities
                    </div>
                    <h2 className="text-4xl md:text-7xl font-black text-[#0F172A] leading-[0.9] tracking-tighter uppercase">
                        EVERYTHING <br />
                        <span className="text-[#6B2FA0]">
                            WITH VROOM.
                        </span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, i) => (
                        <FeatureCard key={i} {...feature} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
