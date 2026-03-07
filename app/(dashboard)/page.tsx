"use client";

import HeroSection from "@/app/components/Landing/HeroSection";
import WhatYouCanDoSection from "@/app/components/Landing/WhatYouCanDoSection";
import HowItWorksSection from "@/app/components/Landing/HowItWorksSection";
import TrustSection from "@/app/components/Landing/TrustSection";
import TestimonialSection from "@/app/components/Landing/TestimonialSection";
import CTASection from "@/app/components/Landing/CTASection";
import Footer from "@/app/components/Landing/Footer";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../store/slices/authSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, router]);

    return (
        <main className="bg-primary-theme min-h-screen">
            <HeroSection />
            <WhatYouCanDoSection />
            <div id="how-it-works">
                <HowItWorksSection />
            </div>
            <div id="why-vroom">
                <TrustSection />
            </div>
            <TestimonialSection />
            <CTASection />
            <Footer />
        </main>
    );
}

