"use client";

import React from "react";
import { UserPlus, Activity, CalendarCheck } from "lucide-react";

export default function HowItWorksSection() {
    const steps = [
        {
            icon: UserPlus,
            title: "Add your vehicle",
            description: "Enter your car or bike details to get personalized recommendations and service schedules."
        },
        {
            icon: Activity,
            title: "Track health",
            description: "Monitor your vehicle's condition and get alerts for upcoming maintenance or issues."
        },
        {
            icon: CalendarCheck,
            title: "Book service",
            description: "Schedule a doorstep service or visit a center with just one tap when needed."
        }
    ];

    return (
        <section className="py-0 bg-zinc-950 border-t border-white/5">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Simple as 1, 2, 3
                    </h2>
                    <p className="text-gray-400">
                        Getting started with smart vehicle management takes less than a minute.
                    </p>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-1">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-4 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-gray-800 via-green-900 to-gray-800" />

                    {steps.map((step, index) => (
                        <div key={index} className="relative flex flex-col items-center text-center z-10">
                            <div className="h-16 w-16 rounded-full bg-zinc-900 border-2 border-green-500/20 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                                <step.icon className="h-8 w-8 text-green-500" />
                            </div>
                            <div className="absolute top-0 right-0 h-6 w-6 rounded-full bg-green-600 flex items-center justify-center text-xs font-bold text-black transform translate-x-4 -translate-y-2 border-2 border-zinc-950">
                                {index + 1}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                            <p className="text-gray-400 max-w-sm">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
