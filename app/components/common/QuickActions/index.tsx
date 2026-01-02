"use client";

import React from "react";
import QuickActionCard from "./QuickActionCard";
import { FaCalendarCheck, FaHistory } from "react-icons/fa";
import { MdTune, MdEmergency } from "react-icons/md";

const actions = [
    {
        title: "Book Service",
        icon: FaCalendarCheck,
        link: "/book-service"
    },
    {
        title: "Modify Ride",
        icon: MdTune,
        link: "/modify-ride"
    },
    {
        title: "Emergency Help",
        icon: MdEmergency,
        link: "/emergency-assistance"
    },
    {
        title: "Service History",
        icon: FaHistory,
        link: "/service-history"
    }
];

const QuickActions: React.FC = () => {
    return (
        <section className="container mx-auto px-4 py-8">
            <h2 className="text-lg font-bold mb-4 text-primaryText">Quick Actions</h2>

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
