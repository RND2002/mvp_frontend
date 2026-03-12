"use client";

import React from "react";
import { Share2, ShieldCheck, Heart } from "lucide-react";

export default function TrustSection() {
    const items = [
        {
            icon: Share2,
            title: "Smart Connections",
            description: "Vroom intelligently connects you with nearby services."
        },
        {
            icon: ShieldCheck,
            title: "Trusted Network",
            description: "Work with verified garages and service providers."
        },
        {
            icon: Heart,
            title: "Built for Drivers",
            description: "Everything designed to make vehicle care simple."
        }
    ];

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mb-20 animate-in fade-in slide-in-from-left-8 duration-1000">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-theme-green/10 border border-theme-green/20 mb-6 font-black text-[10px] text-theme-green uppercase tracking-[0.3em]">
                        Reliability
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white leading-tight uppercase tracking-tighter">
                        WHY <span className="text-theme-green">VROOM.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {items.map((item, i) => (
                        <div
                            key={i}
                            className="flex flex-col gap-6 glass-card p-10 rounded-[32px] hover:border-theme-green/30 transition-all duration-500 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
                            style={{ animationDelay: `${i * 200}ms` }}
                        >
                            <div className="h-16 w-16 rounded-2xl bg-theme-green/10 flex items-center justify-center group-hover:bg-theme-green/20 transition-colors">
                                <item.icon className="h-8 w-8 text-theme-green" />
                            </div>
                            <div>
                                <h4 className="text-xl text-white font-black uppercase tracking-tighter mb-4">{item.title}</h4>
                                <p className="text-sm text-gray-400 font-medium leading-relaxed">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
