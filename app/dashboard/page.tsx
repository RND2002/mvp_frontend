"use client";

import UserDashboardCard from "@/app/components/common/UserDashboardCard";
import myVehicleData from "@/app/json/my-vehicle.json";
import productData from "@/app/json/product-data.json";
import ConsultantCategorySection from "../components/common/CategoryCards";
import categoryData from '@/app/json/services.json';

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
    })),
    // cta: {
    //     title: "Need Assistance?",
    //     description: "Our support team is always here to assist you with any questions or issues you may have.",
    //     imageSrc: "/png/it-consulting/hero/logo-1.svg", // Fallback image
    //     buttons: {
    //         secondary: myVehicleData.buttons.secondary,
    //         primary: myVehicleData.buttons.primary,
    //     },
    // },
};

export default function DashboardPage() {
    return (
        <div className="w-full">
            <UserDashboardCard data={dashboardData} />
            <ConsultantCategorySection data={categoryData} />

        </div>
    );
}
