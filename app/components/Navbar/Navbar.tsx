"use client";
import React, { useCallback, useState } from "react";
import { NavbarData, NavItem } from "@/app/lib/types";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/app/assets/icons/create-custom.svg";
import DropdownSection from "@/app/components/Navbar/DropdownSection";
import LocationHeader from "@/app/components/Location/LocationHeader";
import useStickyNavbar from "@/app/hooks/useStickyNavbar";
import { useMediaQuery } from "@/app/hooks/useMediaQuery";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import LoginDialog from "@/app/components/Auth/LoginDialog";
import OtpVerificationDialog from "@/app/components/Auth/OtpVerificationDialog";
import ProfileSettingsDialog from "@/app/components/Auth/ProfileSettingsDialog";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectIsAuthenticated,
  setCredentials,
  setLoginModalOpen,
  selectIsLoginModalOpen,
} from "@/app/store/slices/authSlice";
// import supabase from "@/app/api/supabaseClient";
import { useRouter, usePathname } from "next/navigation";
import { User, UserIcon, ShoppingCart } from "lucide-react";
import { useGetCartItemsQuery } from "@/app/beService/cart-items-service";
import { selectSelectedVehicle } from "@/app/store/slices/vehicleSlice";

interface NavbarProps {
  navbarData: NavbarData;
  open: boolean;
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}

const Navbar: React.FC<NavbarProps> = ({ navbarData, open, setOpen }) => {
  const isMobileOrTab = useMediaQuery("(max-width: 1100px)");
  const [showStudio, setShowStudio] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(false);
  const [showOurServices, setShowOurServices] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const isLoginOpen = useSelector(selectIsLoginModalOpen); // Use Redux selector
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [authIdentifier, setAuthIdentifier] = useState("");
  const [authType, setAuthType] = useState<"phone" | "email">("phone");

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const selectedVehicle = useSelector(selectSelectedVehicle);
  const { data: cartData } = useGetCartItemsQuery(
    { vehicle_id: selectedVehicle?.id || "" },
    { skip: !selectedVehicle }
  );

  const cartItemCount = cartData?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;


  // React.useEffect(() => {
  //   // Skip auth listener in Navbar if we are on the callback page to avoid race conditions
  //   if (pathname === '/auth/callback') return;

  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange(async (event, session) => {
  //     if (event === "SIGNED_IN" && session) {
  //       const user = {
  //         id: session.user.id,
  //         email: session.user.email,
  //         phone: session.user.phone,
  //       };

  //       dispatch(
  //         setCredentials({
  //           user,
  //           token: session.access_token,
  //         })
  //       );

  //       // Sync session with server for cookie-based auth
  //       try {
  //         await fetch("/api/auth/session", {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({ access_token: session.access_token }),
  //         });
  //       } catch (err) {
  //         console.error("Failed to sync session", err);
  //       }
  //     }
  //   });

  //   return () => {
  //     subscription.unsubscribe();
  //   };
  // }, [dispatch, router, pathname]);

  const handleAvatarClick = () => {
    if (isAuthenticated) {
      setIsSettingsOpen(true);
    } else {
      dispatch(setLoginModalOpen(true));
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

  const handleLoginSuccess = (identifier: string, type: "phone" | "email") => {
    setAuthIdentifier(identifier);
    setAuthType(type);
    dispatch(setLoginModalOpen(false));
    setIsOtpOpen(true);
  };

  return (
    <>
      <div className="lg:hidden flex items-center justify-between w-full px-4 py-1">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image
              src={Logo}
              alt="Vroom"
              width={810}
              height={30}
              className="w-20 h-auto"
            />
          </Link>
          <div className="scale-75 origin-left -ml-2">
            <LocationHeader />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative h-9 w-9 bg-green-500/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-500/30 transition-colors">
            <ShoppingCart className="h-5 w-5 text-green-500" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-brand-primary-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-primary-theme">
                {cartItemCount > 9 ? '9+' : cartItemCount}
              </span>
            )}
          </Link>
          <div
            className="h-9 w-9 bg-green-500/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-500/30 transition-colors"
            onClick={handleAvatarClick}
          >
            <User className="h-5 w-5 text-green-500" />
          </div>
        </div>
      </div>
      <div className="hidden lg:flex items-center w-full justify-between">
        <Link href="/" className="shrink-0 mr-4">
          <Image
            src={Logo}
            alt="Vroom"
            className="w-48 h-16"
          />
        </Link>
        <LocationHeader />
        <div className="flex items-center gap-4 ml-auto">
          <Link href="/cart" className="relative h-10 w-10 bg-green-500/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-500/30 transition-colors">
            <ShoppingCart className="h-5 w-5 text-green-500" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-primary-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-primary-theme">
                {cartItemCount > 9 ? '9+' : cartItemCount}
              </span>
            )}
          </Link>
          <div
            className="h-10 w-10 bg-green-500/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-500/30 transition-colors"
            onClick={handleAvatarClick}
          >
            <User className="h-6 w-6 text-green-500" />
          </div>
        </div>
        <LoginDialog
          open={isLoginOpen}
          setOpen={(val) => dispatch(setLoginModalOpen(val))}
          onLoginSuccess={handleLoginSuccess}
        />
        <OtpVerificationDialog
          open={isOtpOpen}
          setOpen={setIsOtpOpen}
          identifier={authIdentifier}
          type={authType}
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
