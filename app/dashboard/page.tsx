"use client";

import UserDashboardCard from "@/app/components/common/UserDashboardCard";
import myVehicleData from "@/app/json/my-vehicle.json";
import productData from "@/app/json/product-data.json";
import ConsultantCategorySection from "../components/common/CategoryCards";
import categoryData from '@/app/json/services.json';
import QuickActions from "../components/common/QuickActions";

const dashboardData = {
    title: myVehicleData.heading.replace(/\n/g, " "),
    highlightedTitle: myVehicleData.highlightedText,
    description: myVehicleData.description,
    cards: productData.items.map((item) => ({
        title: item.title,
        headline: item.title, // Reusing title as headline since JSON structure differs slightly
        description: item.description,
        phoneSrc: item.image,
        bgImage: "/png/it-consulting/hero/background1.jpg", // Fallback or reusing a background
        icon: item.logo,
        buttonText: "Learn More",
        link: item.title.toLowerCase().includes("health") ? "/health" : undefined,
    })),
};

export default function DashboardPage() {
    return (
        <div className="w-full">
            <div className="px-4 lg:px-0 hidden md:block">
                <QuickActions />
            </div>
            <UserDashboardCard data={dashboardData} />

            <ConsultantCategorySection data={categoryData} />

        </div>
    );
}
