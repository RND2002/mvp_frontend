"use client";
import React, { useCallback, useState } from "react";
import { NavbarData, NavItem } from "@/app/lib/types";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/app/assets/icons/logo.svg";
import DropdownSection from "@/app/components/Navbar/DropdownSection";
import useStickyNavbar from "@/app/hooks/useStickyNavbar";
import { useMediaQuery } from "@/app/hooks/useMediaQuery";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import LoginDialog from "@/app/components/Auth/LoginDialog";
import OtpVerificationDialog from "@/app/components/Auth/OtpVerificationDialog";
import ProfileSettingsDialog from "@/app/components/Auth/ProfileSettingsDialog";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectIsAuthenticated } from "@/app/store/slices/authSlice";

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
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);

  const handleAvatarClick = () => {
    if (isAuthenticated) {
      setIsSettingsOpen(true);
    } else {
      setIsLoginOpen(true);
    }
  };

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

  const handleLoginSuccess = (phone: string) => {
    setPhoneNumber(phone);
    setIsLoginOpen(false);
    setIsOtpOpen(true);
  };

  const renderNavItems = useCallback(
    (item: NavItem) => {
      if (item.href) {
        return (
          <Link
            href={item.href}
            className="group relative inline-block whitespace-nowrap text-white transition-colors hover:text-primary focus:outline-none"
          >
            <span className="block font-bold invisible">{item.name}</span>
            <span className="absolute inset-0 block font-normal ">
              {item.name}
            </span>
          </Link>
        );
      }

      return (
        <button
          className="group relative inline-block whitespace-nowrap text-white transition-colors hover:text-primary focus:outline-none cursor-pointer"
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
          <span className="absolute inset-0 block font-normal">
            {item.name}
          </span>
        </button>
      );
    },
    [navbarData]
  );

  return (
    <>
      <div className="lg:hidden flex items-center justify-between w-full px-4 py-4">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image src={Logo} alt="Vroom" width={810} height={30} className="w-20 h-auto" />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Avatar className="h-9 w-9 bg-blue-500 cursor-pointer" onClick={handleAvatarClick}>
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="@shadcn"
            />
          </Avatar>
        </div>
      </div>
      <div className="hidden lg:flex items-center w-full justify-between">
        <Link href="/" className="flex-shrink-0 mr-12">
          <Image src={Logo} alt="Vroom" width={112} height={40} className="w-28 h-auto" />
        </Link>
        <div className="flex items-center gap-4 ml-auto">
          <Avatar className="h-10 w-10 bg-blue-500 cursor-pointer" onClick={handleAvatarClick}>
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="@shadcn"
            />
          </Avatar>
        </div>
        <LoginDialog open={isLoginOpen} setOpen={setIsLoginOpen} onLoginSuccess={handleLoginSuccess} />
        <OtpVerificationDialog
          open={isOtpOpen}
          setOpen={setIsOtpOpen}
          phoneNumber={phoneNumber}
        />
        <ProfileSettingsDialog
          open={isSettingsOpen}
          setOpen={setIsSettingsOpen}
          user={currentUser}
        />
      </div>
    </>
  );
};

export default Navbar;
