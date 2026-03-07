"use client";

import React from "react";
import { MapPin, Wrench, Package, ShieldAlert } from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
    <div className="group p-8 rounded-[32px] bg-primaryCard/20 border border-secondary-theme hover:border-theme-green/30 transition-all hover:-translate-y-2">
        <div className="h-12 w-12 rounded-2xl bg-theme-green/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Icon className="h-6 w-6 text-theme-green" />
        </div>
        <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed font-medium">{description}</p>
    </div>
);

export default function WhatYouCanDoSection() {
    const features = [
        {
            icon: MapPin,
            title: "Find Nearby Garages",
            description: "Connect instantly with trusted garages near you."
        },
        {
            icon: Wrench,
            title: "Vehicle Services",
            description: "Book maintenance, repairs, and diagnostics."
        },
        {
            icon: Package,
            title: "Tools & Add-Ons",
            description: "Discover tools, accessories, and upgrades for your vehicle."
        },
        {
            icon: ShieldAlert,
            title: "Breakdown Assistance",
            description: "Get help quickly when something goes wrong."
        }
    ];

    return (
        <section className="py-24 bg-primary-theme">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                        What You Can Do <br />
                        <span className="text-theme-green">with Vroom.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, i) => (
                        <FeatureCard key={i} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
}
