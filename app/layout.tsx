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
import { StoreProvider } from "@/app/components/Providers/StoreProvider";
import { Toaster } from "@/components/ui/sonner";
import { VehicleInitializer } from "@/app/components/VehicleInitializer";

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-black antialiased selection:bg-green-500/30`}
      >
        <StoreProvider>
          <VehicleInitializer />
          <AlertProvider>
            <ContactUsPopupProvider>
              <MainNavbar navbarData={NAVBAR_DATA} />
              {children}
              <MobileBottomNav />
              <Toaster position="bottom-right" richColors />
              {/* <Footer /> */}
            </ContactUsPopupProvider>
          </AlertProvider>
        </StoreProvider>
      </body >
    </html >
  );
}

