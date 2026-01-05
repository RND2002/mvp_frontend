
"use client";

import React, { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export const SuccessView = () => {
    const router = useRouter();

    useEffect(() => {
        // Redirect after animation
        const timer = setTimeout(() => {
            router.push("/dashboard");
        }, 3000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="fixed inset-0 z-[200] bg-[#091A23] flex flex-col items-center justify-center animate-in fade-in duration-500">
            <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full animate-pulse"></div>
                <div className="relative w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mb-6 shadow-2xl shadow-green-900/50 animate-bounce">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-2 animate-in slide-in-from-bottom-5 fade-in duration-700 delay-150">Booking Confirmed!</h2>
            <p className="text-slate-400 text-lg animate-in slide-in-from-bottom-5 fade-in duration-700 delay-300">Your mechanic is on the way.</p>

            <div className="mt-8 flex gap-2">
                <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 rounded-full bg-white animate-bounce"></div>
            </div>
        </div>
    );
};
