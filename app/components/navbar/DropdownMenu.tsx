import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import InlineSVG from "@/app/components/common/InlineSVG";
import { usePathname } from "next/navigation";
import ChevronDown from "@/app/assets/icons/chevron-down-double.svg";

export interface childrenData {
  label: string;
  href?: string;
  items?: childrenData[];
  title?: string;
  icon?: string;
}

const DropdownMenu: React.FC<{
  childrenData: childrenData[];
  section?: string;
  onClose?: () => void;
}> = ({ childrenData, section, onClose }) => {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showChevron, setShowChevron] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const canScroll = el.scrollHeight > el.clientHeight;
      const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5;

      setShowChevron(canScroll && !isAtBottom);
    };

    update();
    el.addEventListener("scroll", update);
    window.addEventListener("resize", update);

    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  const handleChevronClick = () => {
    const el = containerRef.current;
    if (!el) return;

    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });

    setShowChevron(false);
  };

  const handleLinkClick = (e: React.MouseEvent, href?: string) => {
    if (href) {
      e.stopPropagation();
      onClose?.();
    }
  };
  const renderChildren = (child: childrenData) => {
    if (section === "services" || section === "industries") {
      return (
        <>
          <Link
            href={child.href || "#"}
            onClick={(e) => handleLinkClick(e, child.href)}
            className="flex items-center gap-2 text-[18px] font-bold text-primary-dark py-1 ml-1"
          >
            <InlineSVG src={child.icon || ""} className="w-4 h-4 text-primary" preserveColors />
            {child.title}
          </Link>

          <div className="pl-3">
            {child.items?.map((item) => {
              const isActive = activeItem === item.href || pathname.endsWith(item.href ?? "");

              return (
                <Link
                  key={item.href}
                  href={item.href || "#"}
                  onClick={(e) => {
                    handleLinkClick(e, item.href);
                    setActiveItem(item.href || null);
                  }}
                  className={clsx(
                    "flex items-center gap-2 text-base py-1 ml-4",
                    isActive ? "text-primary" : "text-primary-dark/70"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </>
      );
    }

    return (
      <Link
        href={child.href || "#"}
        onClick={(e) => handleLinkClick(e, child.href)}
        className="block py-1 ml-4 text-base text-primary-dark/90 hover:text-primary"
      >
        {child.label}
      </Link>
    );
  };

  return (
    <div className="relative overflow-hidden">
      <div
        ref={containerRef}
        className="flex flex-col space-y-1 w-full max-h-[50vh] overflow-scroll pr-2"
      >
        {childrenData.map((child) => (
          <div key={`${child.label || child.title}`}>{renderChildren(child)}</div>
        ))}
      </div>

      {showChevron && (
        <button
          onClick={handleChevronClick}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-light flex justify-center items-center animate-bounce"
        >
          <ChevronDown className="w-5 h-5 text-insight-text" />
        </button>
      )}
    </div>
  );
};
export default DropdownMenu;