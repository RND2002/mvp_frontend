"use client";

import { NavItem } from "@/app/lib/types";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ActiveLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive = pathname.endsWith(item.href || "");

  if (item.href) {
    return (
      <Link
        href={item.href}
        className={clsx("text-[12px] lg:text-base",
          isActive
            ? "px-3 py-2 rounded-[15px] bg-white text-black font-normal"
            : "text-white px-3 py-2 rounded-[20px] transition-all duration-200 hover:bg-white hover:text-black"
        )
        }
      >
        {item.name}
      </Link>
    );
  }

  return (
    <button className="text-white px-3 py-2 rounded-[15px] transition-all duration-200 hover:bg-white hover:text-primary-dark">
      <span className="block font-bold invisible">{item.name}</span>
      <span className="absolute inset-0 block font-normal group-hover:font-bold">
        {item.name}
      </span>
    </button>
  );
}
