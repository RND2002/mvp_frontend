"use client";

import React from "react";
import { MapPin, Wrench, Package, ShieldAlert } from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description, index }: { icon: any, title: string, description: string, index: number }) => (
    <div
        className="group relative p-8 rounded-[32px] glass-card hover:border-theme-green/30 transition-all duration-500 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
        style={{ animationDelay: `${index * 150}ms` }}
    >
        <div className="absolute inset-0 bg-linear-to-br from-theme-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]" />

        <div className="relative z-10">
            <div className="h-14 w-14 rounded-2xl bg-theme-green/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-theme-green/20 transition-all duration-500">
                <Icon className="h-7 w-7 text-theme-green" />
            </div>

            <h3 className="text-xl font-black text-white mb-4 tracking-tighter uppercase">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed font-medium group-hover:text-gray-300 transition-colors">{description}</p>
        </div>

        <div className="absolute bottom-4 right-8 opacity-0 group-hover:opacity-20 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
            <Icon className="h-12 w-12 text-theme-green" />
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
        <section className="py-32 bg-background relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-theme-green/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="max-w-3xl mb-20 animate-in fade-in slide-in-from-left-8 duration-1000">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-theme-green/10 border border-theme-green/20 mb-6 font-black text-[10px] text-theme-green uppercase tracking-[0.3em]">
                        Capabilities
                    </div>
                    <h2 className="text-4xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter uppercase">
                        EVERYTHING <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-theme-green to-emerald-500">
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
