"use client";

import React from "react";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
    {
        quote: "Vroom completely transformed how I manage my car. The health analysis detected a battery issue before it stranded me.",
        name: "Eleanor Fant",
        role: "BMW 3 Series Owner",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
    },
    {
        quote: "The roadside assistance response is insanely fast. I requested help for a flat tire, and a mechanic arrived in 12 minutes.",
        name: "Marcus Aurelius",
        role: "Audi A4 Owner",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    },
    {
        quote: "Highly recommend the Gear Up shop. Got custom performance brakes, and the installation booking was seamless.",
        name: "Sonia Patel",
        role: "Tesla Model Y Owner",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"
    }
];

export default function TestimonialSection() {
    return (
        <section className="py-32 bg-white flex flex-col items-center">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCFCE7] border border-[#DCFCE7] mb-6 font-black text-[10px] text-[#6B2FA0] uppercase tracking-[0.3em] justify-center">
                        Testimonials
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-[#0F172A] tracking-tighter uppercase leading-none">
                        TRUSTED BY <span className="text-[#6B2FA0]">DRIVERS.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {TESTIMONIALS.map((t, idx) => (
                        <div 
                            key={idx} 
                            className="bg-white border border-[#E4E7EC] rounded-[32px] p-8 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative group"
                        >
                            <div className="mb-8">
                                <Quote className="h-8 w-8 text-[#6B2FA0] opacity-20 mb-4" />
                                <p className="text-[#475569] text-base leading-relaxed font-medium italic">
                                    "{t.quote}"
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-4 mt-auto pt-6 border-t border-[#E4E7EC]">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-[#F8F9FB] border border-[#E4E7EC]">
                                    <img 
                                        src={t.avatar} 
                                        alt={t.name}
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#0F172A] text-sm leading-none mb-1">{t.name}</h4>
                                    <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
