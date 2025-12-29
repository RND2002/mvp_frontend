"use client";

import Link from "next/link";
import HamburgerIcon from "@/public/assets/icons/hamburger.svg";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  href?: string;
  section?: string;
}

const AiNavbarMobile = ({ items, open, setOpen }: { items: NavItem[]; open: boolean; setOpen: (open: boolean | ((prev: boolean) => boolean)) => void; }) => {
  const pathname = usePathname();

  return (
    <>
      <button className="transition duration-200 active:scale-95" onClick={() => setOpen((prev: boolean) => !prev)}>
        {open ? (
          <HamburgerIcon className="text-white w-7 h-7" />
        ) : (
          <HamburgerIcon className="text-white w-7 h-7" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 w-full bg-black/80 backdrop-blur-sm xl:hidden z-50"
          >
            <div className="flex flex-col items-start gap-2 p-4">
              {items.map((item) => {
                const isActive = pathname.endsWith(item.href ?? "");
                return (
                  <Link
                    key={item.name}
                    href={item.href ?? "#"}
                    onClick={() => setOpen(false)}
                    className={
                      isActive
                        ? "w-full px-3 py-2 rounded-[20px] bg-white text-black font-normal"
                        : "w-full text-white px-3 py-2 rounded-[20px] transition-all duration-200 hover:bg-white hover:text-black"
                    }
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiNavbarMobile;
