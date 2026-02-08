"use client"
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const useStickyNavbar = (threshold: number = 100, isMobileMenuOpen: boolean = false) => {
    const pathname = usePathname();

    useEffect(() => {
        const navbar = document.getElementById("navbar");
        const mainContainer = document.getElementById("main-navbar-container");
        const aiNavbar = document.getElementById("ai-navbar");

        if (!navbar) return;

        const handleScroll = () => {
            // Skip sticky behavior if mobile menu is open
            if (isMobileMenuOpen) return;

            if (window.scrollY > threshold) {
                navbar.classList.add(
                    "fixed!",
                    "top-0",
                    "z-40",
                    "shadow-md",
                    "w-full"
                );

                if (mainContainer && aiNavbar) {
                    mainContainer.classList.add("fixed");
                }
            } else {
                navbar.classList.remove(
                    "fixed!",
                    "top-0",
                    "z-40",
                    "bg-white",
                    "shadow-md",
                    "w-full"
                );

                if (mainContainer && aiNavbar) {
                    mainContainer.classList.remove("fixed");
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [threshold, pathname, isMobileMenuOpen]);
};

export default useStickyNavbar;
