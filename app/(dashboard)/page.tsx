"use client";

import PartnerSectionComponent from "@/app/components/ServiceSection/index";
import ProductSection from "@/app/components/Products/Services";
import partnerData from "@/app/json/partner-data.json";
import productData from "@/app/json/product-data.json";

export default function DashboardPage() {
    return (
        <main>
            <PartnerSectionComponent data={partnerData} />
            <ProductSection data={productData} />
        </main>
    );
}

