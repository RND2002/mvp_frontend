"use client";

import React from "react";
import QuickActionCard from "./QuickActionCard";

const actions = [
    {
        title: "Book Service",
        icon: "/icons/vehicle/booking-service.svg", // Reusing existing
        link: "/book-service"
    },
    {
        title: "Modify Ride",
        icon: "/icons/vehicle/modification.svg", // Reusing existing
        link: "/modify-ride"
    },
    {
        title: "Emergency Help",
        icon: "/icons/vehicle/components.svg", // Placeholder, will update if specific icon found
        link: "/emergency-assistance"
    },
    {
        title: "Service History",
        icon: "/icons/vehicle/user-experience.svg", // Reusing existing
        link: "/service-history"
    }
];

const QuickActions: React.FC = () => {
    return (
        <section className="container mx-auto px-4 py-8">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Quick Actions</h2>

            <div className="grid grid-cols-4 gap-2 md:flex md:justify-center md:gap-12">
                {actions.map((action, idx) => (
                    <QuickActionCard
                        key={idx}
                        {...action}
                    />
                ))}
            </div>
        </section>
    );
};

export default QuickActions;
