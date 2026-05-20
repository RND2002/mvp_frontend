import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import "@/app/global.css";
import { AlertProvider } from "@/app/hooks/useAlert";
import { Footer } from "@/app/components/Footer/index";
import MainNavbar from "@/app/components/Navbar/index";
import { ContactUsPopupProvider } from "@/app/components/Providers/ContactUsPopupProvider";
import { NAVBAR_DATA } from "@/app/lib/navbar-data";
import MobileBottomNav from "@/app/components/common/MobileBottomNav";
import DesktopFloatingDock from "@/app/components/common/DesktopFloatingDock";
import { StoreProvider } from "@/app/components/Providers/StoreProvider";
import { Toaster } from "@/components/ui/sonner";
import { VehicleInitializer } from "@/app/components/VehicleInitializer";
import LocationPermissionDialog from "@/app/components/Location/LocationPermissionDialog";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vroom — Your Ultimate Vehicle Care & Customization Hub",
  description: "Vroom is your smart partner for car and bike care—offering doorstep servicing, real-time vehicle health tracking, verified mechanics, and performance customization in one seamless platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#F8F9FB]">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[#F8F9FB] antialiased selection:bg-[#6B2FA0]/20 selection:text-[#6B2FA0]`}
      >
        <StoreProvider>
          <VehicleInitializer />
          <LocationPermissionDialog />
          <AlertProvider>
            <ContactUsPopupProvider>
              <MainNavbar navbarData={NAVBAR_DATA} />
              <main className="pb-24 md:pb-0">
                {children}
              </main>
              <MobileBottomNav />
              <DesktopFloatingDock />
              <Toaster position="bottom-right" richColors />
              {/* <Footer /> */}
            </ContactUsPopupProvider>
          </AlertProvider>
        </StoreProvider>
      </body >
    </html >
  );
}

