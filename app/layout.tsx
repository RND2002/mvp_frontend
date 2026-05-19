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

import { cookies } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TORQ — Precision Vehicle Care",
  description: "TORQ is your smart partner for car and bike care—offering doorstep servicing, real-time vehicle health tracking, verified mechanics, and performance customization in one seamless platform.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value || "light";

  return (
    <html lang="en" data-theme={theme} className={theme === "dark" ? "dark" : ""}>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              var theme = document.cookie.split('; ').find(row => row.startsWith('theme='))?.split('=')[1] || 'light';
              document.documentElement.setAttribute('data-theme', theme);
              if (theme === 'dark') {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch (e) {}
          `
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-primary-theme antialiased selection:bg-amber-500/20`}
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

