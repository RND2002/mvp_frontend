"use client";

import React from "react";
import { LogIn, Search, CheckCircle2 } from "lucide-react";

export default function HowItWorksSection() {
    const steps = [
        {
            icon: LogIn,
            title: "Step 1: Sign In",
            description: "Access the TORQ platform."
        },
        {
            icon: Search,
            title: "Step 2: Choose What You Need",
            description: "Find garages, services, tools, or assistance."
        },
        {
            icon: CheckCircle2,
            title: "Step 3: Get It Done",
            description: "Connect, book, and manage everything easily."
        }
    ];

    return (
        <section className="py-24 bg-primary-theme">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-black text-text-primary mb-2 uppercase tracking-tighter">
                        How TORQ Works
                    </h2>
                    <div className="h-1 w-20 bg-theme-amber mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {steps.map((step, i) => (
                        <div key={i} className="group p-8 rounded-[32px] bg-bg-secondary/40 border border-border-default hover:border-theme-amber/30 transition-all flex flex-col items-center text-center">
                            <div className="h-16 w-16 rounded-full bg-theme-amber/12 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <step.icon className="h-8 w-8 text-theme-amber" />
                            </div>
                            <h3 className="text-xl font-bold text-text-primary mb-3 tracking-tight">{step.title}</h3>
                            <p className="text-text-secondary text-sm leading-relaxed font-medium">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
