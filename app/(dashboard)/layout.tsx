
"use client";

import MainNavbar from "@/app/components/Navbar";
import { ContactUsPopupProvider } from "@/app/components/Providers/ContactUsPopupProvider";
import { NAVBAR_DATA } from "../lib/navbar-data";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ContactUsPopupProvider>
            <MainNavbar navbarData={NAVBAR_DATA} />
            {children}
        </ContactUsPopupProvider>
    );
}
