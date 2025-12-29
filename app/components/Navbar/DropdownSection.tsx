import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import ListItem from "@/app/components/common/ListItem";
import {
  dropdownAnimation,
  listItemAnimation,
  staggerListAnimation,
} from "@/app/lib/motion";
import { NavItem } from "@/app/lib/types";

type DropdownSectionProps = {
  isVisible: boolean;
  items: NavItem[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};
const DropdownSection: React.FC<DropdownSectionProps> = ({
  isVisible,
  items,
  onMouseEnter,
  onMouseLeave,
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
          className="absolute top-full left-1/2 -translate-x-1/2 w-max bg-navbar shadow-navbar rounded-[1.25rem] z-50 p-4"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onFocus={onMouseEnter}
          onBlur={onMouseLeave}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              onMouseLeave();
              e.currentTarget.blur();
            }
          }}
        >
          <motion.ul
            className="space-y-2 font-medium text-base"
            variants={staggerListAnimation}
            initial="hidden"
            animate="visible"
          >
            {items.map((item) => (
              <ListItem
                key={`${item.logo}-${item.name}`}
                title={item.name || item.label || ""}
                href={item.href}
                className="hover:text-primary transition-colors block py-2"
              />
            ))}
          </motion.ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DropdownSection;
