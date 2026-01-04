"use client";

import React from "react";
import { Wrench, Activity, AlertCircle, Clock, Zap, ShieldCheck } from "lucide-react";

const features = [
    {
        icon: Wrench,
        title: "Book Service",
        description: "Instant booking for car & bike servicing at your doorstep or nearest center.",
        color: "text-blue-400",
        bg: "bg-blue-400/10",
    },
    {
        icon: Activity,
        title: "Vehicle Health",
        description: "Track vital stats, battery life, and upcoming maintenance needs in real-time.",
        color: "text-green-400",
        bg: "bg-green-400/10",
    },
    {
        icon: AlertCircle,
        title: "Emergency Help",
        description: "24/7 roadside assistance for breakdowns, flat tyres, and fuel support.",
        color: "text-red-400",
        bg: "bg-red-400/10",
    },
    {
        icon: Clock,
        title: "Service History",
        description: "Digital logs of all your past repairs, parts changed, and costs incurred.",
        color: "text-orange-400",
        bg: "bg-orange-400/10",
    },
    {
        icon: Zap,
        title: "Custom Mods",
        description: "Explore performance upgrades and aesthetic modifications for your ride.",
        color: "text-purple-400",
        bg: "bg-purple-400/10",
    },
    {
        icon: ShieldCheck,
        title: "Quality Assurance",
        description: "Every service comes with a warranty and quality checks by expert engineers.",
        color: "text-cyan-400",
        bg: "bg-cyan-400/10",
    },
];

export default function FeatureSection() {
    return (
        <section className="py-24 bg-black relative">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Everything your vehicle needs
                    </h2>
                    <p className="text-gray-400 max-w-2xl text-lg">
                        One app to manage, maintain, and upgrade your vehicle. Designed for the modern owner.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${feature.bg} ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
