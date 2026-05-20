import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import PrimaryButton from "@/app/components/common/PrimaryButton";
import ArrowUpIcon from "@/public/assets/icons/arrow-up.svg";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { NavItem, NavbarData, Category } from "@/app/lib/types";
import { NavItemName } from "@/app/lib/constants";
import DropdownMenu, { childrenData } from "@/app/components/Navbar/DropdownMenu";

type Item = NavItem;

interface Column {
  title: string;
  items: NavItem[];
}

interface MobileViewNavbarProps {
  items: NavItem[];
  navbarData: NavbarData;
  open: boolean;
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}

const MobileViewNavbar = ({
  items,
  navbarData,
  open,
  setOpen,
}: MobileViewNavbarProps) => {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleClose = () => {
    setOpen(false);
    setActiveDropdown(null);
  };

  const getChildrenForSection = (section: string) => {
    switch (section) {
      case "services":
        return navbarData.servicesSection?.categories || [];
      case "studio":
        return navbarData.studioSection?.items || [];
      case "about":
        return navbarData.aboutUsSection?.items || [];
      case "resources":
      case "our-services":
        return navbarData.resourcesSection?.items || [];
      case "whoWeServe":
        return navbarData.whoWeServe?.items || [];
      default:
        return [];
    }
  };

  const transformToChildrenData = (
    items: (Category | Item)[]
  ): childrenData[] => {
    return items.map((item) => {
      let label = "";
      if ("title" in item) {
        label = item.title;
      } else if ("label" in item && item.label) {
        label = item.label;
      } else if ("name" in item) {
        label = item.name;
      }

      if ("title" in item) {
        return {
          ...item,
          label: label,
          items: item.items ? transformToChildrenData(item.items) : undefined,
        };
      }
      return {
        ...item,
        label: label
      };
    });
  };

  return (
    <div>
      <div className="flex items-center gap-4">


        <button
          className="relative rounded-md transition duration-200 active:scale-95"
          onClick={() => setOpen((prev: boolean) => !prev)}
        >
          <p
            className={clsx(
              "absolute w-7 py-0.5  transition-all duration-300 ease-in-out -top-1 rounded-sm",
              open ? "rotate-45 top-[3px] bg-insight-text" : " bg-primary-dark"
            )}
          />

          <p
            className={clsx(
              "w-5 py-0.5 bg-primary-dark mt-1 transition-all duration-300 ease-in-out rounded-sm",
              open && "opacity-0"
            )}
          />

          <p
            className={clsx(
              "absolute w-7 py-0.5  mt-1 transition-all duration-300 ease-in-out rounded-sm",
              open
                ? "rotate-[-45deg] bottom-0 bg-insight-text"
                : "bg-primary-dark"
            )}
          />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-[#F5EDFC] backdrop-blur-sm xl:hidden z-40"
          >
            <div className="p-4">
              {items.map((item, index) => {
                const isActive = pathname.endsWith(item.href ?? "");
                const children = item.section
                  ? transformToChildrenData(getChildrenForSection(item.section))
                  : [];

                return (
                  <div key={item.name} className="w-full mb-2">
                    {item.href ? (
                      <Link
                        href={item.href}
                        onClick={handleClose}
                        className={clsx(
                          "block px-4 py-3 font-bold text-[18px] border-b border-primary-dark/10",
                          isActive ? "text-primary" : "text-primary-dark/90"
                        )}
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <div>
                        <button
                          onClick={() =>
                            setActiveDropdown(
                              activeDropdown === item.name ? null : item.name
                            )
                          }
                          className={clsx(
                            "w-full flex justify-between items-center px-4 py-3 text-left font-bold text-[18px] border-b border-primary-dark/10",
                            activeDropdown === item.name
                              ? "text-primary"
                              : "text-primary-dark/90",
                            index === items.length - 1 ? "border-none" : ""
                          )}
                        >
                          {item.name}
                          <span className="text-[#475569]">
                            {activeDropdown === item.name ? "-" : "+"}
                          </span>
                        </button>

                        <AnimatePresence>
                          {activeDropdown === item.name && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="pl-4 mt-1"
                            >
                              <DropdownMenu
                                childrenData={children}
                                section={item.section}
                                onClose={handleClose}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileViewNavbar;
