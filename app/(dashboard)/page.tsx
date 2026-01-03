"use client";

import PartnerSectionComponent from "@/app/components/ServiceSection/index";
import ProductSection from "@/app/components/Products/Services";
import partnerData from "@/app/json/partner-data.json";
import productData from "@/app/json/product-data.json";
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
        <main>
            <PartnerSectionComponent data={partnerData} />
            <ProductSection data={productData} />
        </main>
    );
}

