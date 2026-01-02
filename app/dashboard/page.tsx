"use client";

import UserDashboardCard from "@/app/components/common/UserDashboardCard";
import myVehicleData from "@/app/json/my-vehicle.json";
import productData from "@/app/json/product-data.json";
import ConsultantCategorySection from "../components/common/CategoryCards";
import categoryData from '@/app/json/services.json';
import QuickActions from "../components/common/QuickActions";
import ProductShelf from "@/app/components/common/ProductShelf";

const dashboardData = {
    title: myVehicleData.heading.replace(/\n/g, " "),
    // highlightedTitle: myVehicleData.highlightedText,
    // description: myVehicleData.description,
    cards: productData.items.map((item) => ({
        title: item.title,
        // headline: item.title, // Reusing title as headline since JSON structure differs slightly
        description: item.description,
        bgImage: "/png/it-consulting/hero/background1.jpg", // Fallback or reusing a background
        // icon: item.logo,
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

            <ProductShelf
                title="Household Cleaning"
                products={[
                    {
                        title: "Shatras Disinfectant Toilet Cleaner",
                        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400",
                        weight: "2 x 5 L",
                        price: 521,
                        originalPrice: 1499,
                        discount: "65% OFF",
                    },
                    {
                        title: "Lizol Kitchen Cleaning Spray | Cleans Stove",
                        image: "https://images.unsplash.com/photo-1585670149967-b4f4da66cc47?auto=format&fit=crop&q=80&w=400",
                        weight: "450 ml",
                        price: 140,
                        originalPrice: 200,
                        discount: "30% OFF",
                    },
                    {
                        title: "Finish Power Essential Dishwasher Tablets",
                        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400",
                        weight: "1 pack",
                        price: 1750,
                        originalPrice: 1995,
                        discount: "12% OFF",
                    },
                    {
                        title: "Nimyle Herbal Floor Cleaner",
                        image: "https://images.unsplash.com/photo-1616400619175-5beda3a17896?auto=format&fit=crop&q=80&w=400",
                        weight: "2 L",
                        price: 412,
                        originalPrice: 900,
                        discount: "54% OFF",
                    },
                    {
                        title: "Harpic Original Toilet Cleaner Liquid",
                        image: "https://images.unsplash.com/photo-1516750930166-ed88ab1adb61?auto=format&fit=crop&q=80&w=400",
                        weight: "1 L",
                        price: 187,
                        originalPrice: 235,
                        discount: "20% OFF",
                    },
                    {
                        title: "Colin Glass Cleaner",
                        image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80&w=400",
                        weight: "500 ml",
                        price: 95,
                        originalPrice: 110,
                        discount: "15% OFF",
                    },
                ]}
            />

            <ConsultantCategorySection data={categoryData} />

        </div>
    );
}
