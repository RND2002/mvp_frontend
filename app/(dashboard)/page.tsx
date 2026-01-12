"use client";

import HeroSection from "@/app/components/Landing/HeroSection";
import FeatureSection from "@/app/components/Landing/FeatureSection";
import TrustSection from "@/app/components/Landing/TrustSection";
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
        <main className="bg-black min-h-screen">
            <HeroSection />
            <FeatureSection />
            {/* <HowItWorksSection /> */}
            <TrustSection />
            {/* <CTASection /> */}
            {/* <Footer /> */}
        </main>
    );
}

