"use client";

import PartnerSectionComponent from "../components/ServiceSection";
import ProductSection from "../components/Products/Services";
import partnerData from "../json/partner-data.json";
import productData from "../json/product-data.json";

export default function DashboardPage() {
    return (
        <main>
            <PartnerSectionComponent data={partnerData} />
            <ProductSection data={productData} />
        </main>
    );
}

