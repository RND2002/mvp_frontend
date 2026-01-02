"use client";

import React, { useState } from "react";
import ContactBar from "@/app/components/Navbar/ContactBar";
import "@/app/components/Navbar/index.css";
import Navbar from "@/app/components/Navbar/Navbar";
import Image from "next/image";
import AutoSlider from "@/app/components/common/AutoSlider";
import AiNavbar from "@/app/components/Navbar/AiNavbar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import FoodNavbar from "@/app/components/Navbar/FoodNavbar";
import { NavbarName } from "@/app/lib/constants";
import useStickyNavbar from "@/app/hooks/useStickyNavbar";
import { NavbarData } from "@/app/lib/types";

export interface ContactData {
  email: string;
  uae: { country: string; phone: string };
  india: { country: string; phone: string };
}

interface MainNavbarProps {
  navbarData: NavbarData;
}

const MainNavbar: React.FC<MainNavbarProps> = ({ navbarData }) => {
  const pathname = usePathname();
  const showFoodNavbar = navbarData?.foodNavItems.some((item) =>
    pathname.endsWith(item.href || "")
  );
  const [openNav, setOpenNav] = useState<{
    main: boolean;
    ai: boolean;
    food: boolean;
  }>({
    main: false,
    ai: false,
    food: false,
  });

  // Close other navbars when one is opened
  const handleNavbarToggle = (navbar: NavbarName, isOpen: boolean) => {
    setOpenNav(() => ({
      main: navbar === NavbarName.MAIN ? isOpen : false,
      ai: navbar === NavbarName.AI ? isOpen : false,
      food: navbar === NavbarName.FOOD ? isOpen : false,
    }));
  };

  useStickyNavbar(100, openNav.main);
  return (
    <nav id="navbar" className="relative z-500 bg-secondary-theme shadow-navbar">
      <div
        id="main-navbar-container"
        className="container mx-auto flex items-center justify-between px-3 md:px-4 lg:px-6 py-4 relative"
      >
        <div className="flex items-center gap-16">

          {/* <AutoSlider
              className="mb-0! hidden md:flex"
              slideClassName="!p-0"
              slides={navbarData.navSlideItems}
              direction="vertical"
              showName={false}
              showNavigation={false}
              showTagline={false}
              slideHeight={60}
              slideWidth={90}
              autoSlideTime={3000}
              hideOnMobile={true}
            /> */}
        </div>
        <Navbar
          navbarData={navbarData}
          open={openNav.main}
          setOpen={(isOpen) =>
            handleNavbarToggle(
              NavbarName.MAIN,
              typeof isOpen === "boolean" ? isOpen : !openNav.main
            )
          }
        />
      </div>
      {/* {showFoodNavbar && (
        <FoodNavbar
          items={navbarData.foodNavItems}
          open={openNav.food}
          setOpen={(isOpen) =>
            handleNavbarToggle(
              NavbarName.FOOD,
              typeof isOpen === "boolean" ? isOpen : !openNav.food
            )
          }
        />
      )} */}
    </nav>
  );
};

export default MainNavbar;
