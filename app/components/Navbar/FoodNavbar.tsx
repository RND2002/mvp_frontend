"use client";

import Image from "next/image";
import React from "react";
import AiNavbarMobile from "@/app/components/Navbar/AiNavbarMobile";
import ActiveLink from "@/app/components/Navbar/ActiveLink";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { NavItem } from "@/app/lib/types";

interface AiNavbarProps {
  items: NavItem[];
  open: boolean;
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}

const FoodNavbar: React.FC<AiNavbarProps> = ({ items, open, setOpen }) => {
  const pathname = usePathname();

  const showFoodNavbar = items.some((item) =>
    pathname.endsWith(item.href || "")
  );

  if (!showFoodNavbar) return null;

  return (
    <div
      id="ai-navbar"
      className="[background-image:var(--gradient-ai-navbar)]"
    >
      <div className="relative container mx-auto flex items-center justify-between px-3 md:px-4 lg:px-6 py-1">
        <div className="flex items-center gap-16">
          <Link
            href={items?.[0]?.href || "/"}
            className="relative h-15 w-[140px] lg:w-[170px]"
          >
            <Image
              src="/assets/icons/logoipsum-365.svg"
              className="object-contain"
              fill
              alt="Logo"
            />
          </Link>
        </div>

        {/* <div className="hidden xl:flex items-center gap-4">
          {items.map((item) => (
            <ActiveLink key={item.name} item={item} />
          ))}
        </div> */}
        <div className="xl:hidden">
          <AiNavbarMobile items={items} open={open} setOpen={setOpen} />
        </div>
      </div>
    </div>
  );
};

export default FoodNavbar;
