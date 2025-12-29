"use client";
import React, { useCallback, useState } from "react";
import { NavbarData, NavItem } from "@/app/lib/types";
import Link from "next/link";
import Image from "next/image";
import PrimaryButton from "../common/PrimaryButton";
import ArrowUpIcon from "@/public/assets/icons/arrow-up.svg";
// import HamburgerIcon from "@/assets/icons/hamburger.svg";
import DropdownSection from "@/app/components/Navbar/DropdownSection";
import ServicesSection from "@/app/components/Navbar/ServicesSection";
import useStickyNavbar from "@/app/hooks/useStickyNavbar";
import { useMediaQuery } from "@/app/hooks/useMediaQuery";
import MobileMainNavbar from "@/app/components/Navbar/MobileMainNavbar";
import CustomButton from "@/app/ui/button/CustomButton";

interface NavbarProps {
  navbarData: NavbarData;
  open: boolean;
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
};

const Navbar: React.FC<NavbarProps> = ({ navbarData, open, setOpen }) => {
  const isMobileOrTab = useMediaQuery("(max-width: 1100px)");
  const [showStudio, setShowStudio] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(false);
  const [showOurServices, setShowOurServices] = useState(false);
  const [showServices, setShowServices] = useState(false);

  useStickyNavbar(100, open);

  const handleMouseEnter = (item: NavItem) => {
    switch (item.section) {
      case "studio":
        setShowStudio(true);
        break;
      case "our-services":
        setShowOurServices(true);
        break;
    }
  };

  const handleMouseLeave = (section: string) => {
    switch (section) {
      case "studio":
        setShowStudio(false);
        break;
      case "our-services":
        setShowOurServices(false);
        break;
    }
  };

  const renderNavItems = useCallback(
    (item: NavItem) => {
      if (item.href) {
        return (
          <Link
            href={item.href}
            className="group relative inline-block whitespace-nowrap text-primary-dark transition-colors hover:text-primary focus:outline-none"
          >
            <span className="block font-bold invisible">{item.name}</span>
            <span className="absolute inset-0 block font-normal group-hover:font-bold">
              {item.name}
            </span>
          </Link>
        );
      }

      return (
        <button
          className="group relative inline-block whitespace-nowrap text-text-dark transition-colors hover:text-primary focus:outline-none cursor-pointer"
          onMouseEnter={() => handleMouseEnter(item)}
          onMouseLeave={() => handleMouseLeave(item.section || item.name)}
          onFocus={() => handleMouseEnter(item)}
          onBlur={() => handleMouseLeave(item.section || item.name)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              handleMouseLeave(item.section || item.name);
              e.currentTarget.blur();
            }
          }}
        >
          <span className="block font-bold invisible">{item.name}</span>
          <span className="absolute inset-0 block font-normal group-hover:font-bold">
            {item.name}
          </span>
        </button>
      );
    },
    [navbarData, handleMouseEnter, handleMouseLeave]
  );

  // if (isMobileOrTab) {
  //   return (
  //     <MobileMainNavbar items={navbarData.navItems} navbarData={navbarData} open={open} setOpen={setOpen} />
  //   );
  // }
  return (
    <>
      <div className="lg:hidden">
        <MobileMainNavbar items={navbarData.navItems} navbarData={navbarData} open={open} setOpen={setOpen} />
      </div>
      <div className="hidden lg:flex items-center gap-8 relative">
        {navbarData.navItems.filter((item) => item.visibleIn === "both").map((item) => (
          <div key={item.name} className="relative">
            {renderNavItems(item)}
            <DropdownSection
              isVisible={item.section === "our-services" && showOurServices}
              items={navbarData.resourcesSection.items}
              onMouseEnter={() => setShowOurServices(true)}
              onMouseLeave={() => handleMouseLeave("our-services")}
            />
          </div>
        ))}

        <CustomButton onClick={() => alert("Custom Button Clicked")}>
          Sign In
        </CustomButton>

        {/* <ServicesSection
          navbarData={navbarData}
          onMouseEnter={() => setShowServices(true)}
          handleMouseLeave={handleMouseLeave}
          isVisible={showServices}
        /> */}
      </div>
    </>
  );
};

export default Navbar;
