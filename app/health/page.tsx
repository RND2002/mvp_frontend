"use client";

import React from "react";
import { HealthDashboard } from "@/app/components/Health/HealthDashboard";
import Container from "@/app/components/common/Container";


export default function HealthPage() {
    return (
        <div className="w-full bg-primary-theme min-h-screen">
            <Container className="py-4">
                <HealthDashboard />
            </Container>
        </div>
    );
}
