import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ListItem from "../common/ListItem";
import { NavItemName } from "@/app/lib/constants";
import { IndustryColumn, NavItem } from "@/app/lib/types";
import { dropdownAnimation, gridAnimation, cardAnimation } from "@/app/lib/motion";
import Link from "next/link";
// import InlineSVG from "../common/InlineSVG";

interface IndustrySectionProps {
  columns: IndustryColumn[];
  onMouseEnter: () => void;
  handleMouseLeave: (name: NavItemName) => void;
  isVisible: boolean;
}

const IndustrySection: React.FC<IndustrySectionProps> = ({
  columns,
  onMouseEnter,
  handleMouseLeave,
  isVisible,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={dropdownAnimation}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="menu"
          aria-hidden={!isVisible}
          tabIndex={-1}
          className="absolute top-[60px] left-0 w-max bg-navbar shadow-navbar rounded-[1.25rem] z-50 p-8"
          onMouseEnter={onMouseEnter}
          onMouseLeave={() => handleMouseLeave(NavItemName.Industries)}
          onFocus={onMouseEnter}
          onBlur={() => handleMouseLeave(NavItemName.Industries)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              handleMouseLeave(NavItemName.Industries);
              e.currentTarget.blur();
            }
          }}
        >
          <motion.div
            variants={gridAnimation}
            initial="hidden"
            animate="show"
            className="max-w-7xl mx-auto grid grid-cols-4 gap-8 text-sm text-primary-dark"
          >
            {columns.map((col, index) => (
              <motion.div
                key={index}
                variants={cardAnimation}
                className="col-span-1"
              >
                <div className="mb-6">
                  <h4 className="font-semibold text-navbar-label uppercase mb-4 text-sm">
                    {col.title}
                  </h4>
                  <ul className="space-y-2">
                    {col.items.map((item, i) => (
                      <ListItem
                        key={i}
                        title={item.name}
                        href={item.href}
                        className="text-[12px] 2xl:text-sm block py-1 hover:text-primary transition-colors"
                      />
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IndustrySection;
