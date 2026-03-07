"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
    return (
        <section className="py-24 bg-primary-theme">
            <div className="container mx-auto px-4 md:px-6">
                <div className="relative rounded-[40px] overflow-hidden bg-theme-green px-6 py-24 text-center shadow-[0_20px_50px_rgba(34,197,94,0.2)]">
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-black text-black mb-6 tracking-tighter leading-none">
                            Vehicle Care, Simplified.
                        </h2>
                        <p className="text-black/70 mb-10 text-sm md:text-base font-bold uppercase tracking-widest max-w-xl mx-auto leading-relaxed">
                            Join Vroom and access everything your vehicle needs.
                        </p>
                        <div className="flex justify-center">
                            <Button
                                size="lg"
                                className="bg-black hover:bg-black/90 text-white font-black uppercase text-xs tracking-[0.2em] h-14 px-10 rounded-full transition-all hover:scale-105"
                            >
                                Sign In
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
