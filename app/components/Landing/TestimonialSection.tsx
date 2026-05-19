"use client";

import React from "react";
import { Quote } from "lucide-react";

export default function TestimonialSection() {
    return (
        <section className="py-24 bg-primary-theme flex flex-col items-center text-center">
            <div className="h-10 w-10 bg-theme-green/10 rounded-full flex items-center justify-center mb-8">
                <Quote className="h-5 w-5 text-theme-green fill-theme-green" />
            </div>

            <blockquote className="max-w-4xl px-4">
                <p className="text-2xl md:text-4xl font-black text-text-primary italic leading-tight tracking-tight">
                    "Built to make roadside help simple, fast, and stress-free."
                </p>
            </blockquote>
        </section>
    );
}
