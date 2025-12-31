"use client";

import React from "react";
import HealthCard from "@/app/components/common/HealthCard";
import healthData from "@/app/json/health-data.json";
import ConsultantCategorySection from "../components/common/CategoryCards";
import categoryData from '@/app/json/services.json';


export default function HealthPage() {
    return (
        <div className="w-full">
            <HealthCard data={healthData} />
            <ConsultantCategorySection data={categoryData} />

        </div>
    );
}
