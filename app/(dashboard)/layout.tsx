
"use client";

import MainNavbar from "@/app/components/Navbar";
import { ContactUsPopupProvider } from "@/app/components/Providers/ContactUsPopupProvider";
import { NAVBAR_DATA } from "../lib/navbar-data";
import PartnerSection from "../ServiceSection";
import partnerData from "../json/partner-data.json";
export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ContactUsPopupProvider>
            <>
                <MainNavbar navbarData={NAVBAR_DATA} />
                {children}
                <PartnerSection data={partnerData} />
            </>
        </ContactUsPopupProvider>
    );
}
