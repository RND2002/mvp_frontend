"use client";

import React from "react";
import { ShieldCheck, Banknote, UserCheck, Timer } from "lucide-react";

export default function TrustSection() {
    return (
        <section className="py-24 bg-black relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                            Why thousands trust us with their ride
                        </h2>
                        <p className="text-gray-400 text-lg">
                            We don't just fix vehicles; we care for them. Our standards are higher because your safety comes first.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { icon: UserCheck, title: "Verified Mechanics", desc: "Background checked & certified experts." },
                                { icon: Banknote, title: "Transparent Pricing", desc: "Approvals required for every part." },
                                { icon: ShieldCheck, title: "6 Month Warranty", desc: "On all services and parts replaced." },
                                { icon: Timer, title: "On-Time Service", desc: "Real-time tracking of your service." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
                                        <item.icon className="h-5 w-5 text-green-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold">{item.title}</h4>
                                        <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 bg-green-500/10 blur-[100px] rounded-full" />
                        <div className="relative bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-12 w-12 rounded-full bg-yellow-500 flex items-center justify-center font-bold text-black overflow-hidden">
                                    <img src="https://github.com/shadcn.png" alt="User" />
                                </div>
                                <div>
                                    <div className="text-white font-bold">Aryan's KTM</div>
                                    <div className="text-green-400 text-xs">Service Completed • Just now</div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-2 bg-white/5 rounded-full w-3/4 animate-pulse"></div>
                                <div className="h-2 bg-white/5 rounded-full w-full animate-pulse delay-75"></div>
                                <div className="h-2 bg-white/5 rounded-full w-5/6 animate-pulse delay-150"></div>
                            </div>
                            <div className="mt-6 flex justify-between items-center bg-black/50 p-4 rounded-xl border border-white/5">
                                <span className="text-gray-400 text-sm">Total Cost</span>
                                <span className="text-white font-mono text-xl">₹1,499</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
