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
        <section className="py-24 bg-primary-theme relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                        Why <span className="text-theme-green">Vroom.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {items.map((item, i) => (
                        <div key={i} className="flex flex-col gap-4 border border-secondary-theme p-8 rounded-[32px] bg-primaryCard/20 hover:border-theme-green/30 transition-all">
                            <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-theme-green/10 flex items-center justify-center">
                                <item.icon className="h-7 w-7 text-theme-green" />
                            </div>
                            <div>
                                <h4 className="text-xl text-white font-bold mb-3 tracking-tight">{item.title}</h4>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
