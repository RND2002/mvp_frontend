"use client";

import { HealthDashboard } from "@/app/components/Health/HealthDashboard";
import myVehicleData from "@/app/json/my-vehicle.json";
import productData from "@/app/json/product-data.json";
import ConsultantCategorySection from "../components/common/CategoryCards";
import categoryData from '@/app/json/services.json';
import QuickActions from "../components/common/QuickActions";
import ProductShelf from "@/app/components/common/ProductShelf";
import { useGetUserVehiclesQuery } from "../beService/user-service";
import { VehicleOnboardingWizard } from "@/components/onboarding/VehicleOnboardingWizard";
import { useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";


import { Suspense } from "react";

function DashboardContent() {
    const { data, isLoading } = useGetUserVehiclesQuery();
    const [showOnboarding, setShowOnboarding] = useState(false);

    const vehicles = data?.vehicles;

    const searchParams = useSearchParams();
    const onboarding = searchParams.get('onboarding');

    useEffect(() => {
        if ((!isLoading && vehicles && vehicles.length === 0) || onboarding === 'true') {
            setShowOnboarding(true);
        }
    }, [vehicles, isLoading, onboarding]);

    return (
        <div className="w-full">
            <VehicleOnboardingWizard open={showOnboarding} onClose={() => setShowOnboarding(false)} />
            <div className="px-2 mt-4 lg:px-0">
                {/* <QuickActions /> */}

                <div className="mb-6">
                    <HealthDashboard />
                </div>

            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DashboardContent />
        </Suspense>
    );
}
