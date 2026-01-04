"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
    return (
        <section className="py-24 bg-black">
            <div className="container px-4 md:px-6">
                <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 px-6 py-16 md:px-16 text-center">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-900/20 via-transparent to-transparent" />

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Ready to give your vehicle the care it deserves?
                        </h2>
                        <p className="text-gray-400 mb-8 text-lg">
                            Join thousands of smart vehicle owners today. Track, maintain, and upgrade seamlessly.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button size="lg" className="bg-green-600 hover:bg-green-500 text-black font-bold h-12 px-8">
                                Get Started Now
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
