import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import ListItem from "@/app/components/common/ListItem";
import PrimaryButton from "@/app/components/common/PrimaryButton";
import ArrowUpIcon from "@/public/assets/icons/arrow-up.svg";
import { NavItemName } from "@/app/lib/constants";
import { NavbarData, NavItem, Category } from "@/app/lib/types";
import {
  cardAnimation,
  dropdownAnimation,
  gridAnimation,
  slideInLeftAnimation,
} from "@/app/lib/motion";
// import InlineSVG from "../common/InlineSVG";
import AutoSlider from "../common/AutoSlider";

interface ServicesSectionProps {
  isVisible: boolean;
  navbarData: NavbarData;
  onMouseEnter: () => void;
  handleMouseLeave: (name: NavItemName) => void;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({
  isVisible,
  navbarData,
  onMouseEnter,
  handleMouseLeave,
}) => {
  const { branding, categories } = navbarData.servicesSection;

  const renderHeading = (category: Category) => {
    return (
      <div className="group flex gap-2 items-center mb-3">
        <span
          className="font-bold text-[14px] 2xl:text-[16px] tracking-[0.2px] text-start leading-[1.3rem] text-primary"
          dangerouslySetInnerHTML={{ __html: category.title }}
        />
      </div>
    );
  };

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
          className="absolute top-full mt-2 right-0 w-max bg-navbar shadow-navbar rounded-[1.25rem] z-50 px-4 py-6"
          onMouseEnter={onMouseEnter}
          // onMouseLeave={() => handleMouseLeave(NavItemName.Services)}
          onFocus={onMouseEnter}
        // onBlur={() => handleMouseLeave(NavItemName.Services)}
        // onKeyDown={(e) => {
        //   if (e.key === "Escape") {
        //     handleMouseLeave(NavItemName.Services);
        //     e.currentTarget.blur();
        //   }
        // }}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
            {branding && (
              <motion.div
                className="md:col-span-3 flex flex-col p-2"
                variants={slideInLeftAnimation}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={cardAnimation}>
                  <AutoSlider slides={branding.sliderItems} slideHeight={240} />
                </motion.div>

                <div className="ml-8">
                  <motion.h4
                    variants={cardAnimation}
                    className="2xl:text-[28px] lg:text-[24px] text-[20px] font-normal mb-4"
                  >
                    <span className="font-bold text-gradient-contact-text">
                      {branding?.contactTitle}
                    </span>
                    <span
                      dangerouslySetInnerHTML={{ __html: branding?.helpingText }}
                    />
                  </motion.h4>

                  <motion.div variants={cardAnimation}>
                    <PrimaryButton className="w-max" href="/contact">
                      {branding?.buttonText} <Image src={ArrowUpIcon} alt="Arrow Up" className="w-5 h-5 invert" />
                    </PrimaryButton>
                  </motion.div>
                </div>
              </motion.div>
            )}

            <motion.div
              className="md:col-span-9 columns-1 sm:columns-2 lg:columns-4"
              variants={gridAnimation}
              initial="hidden"
              animate="show"
            >
              {categories.map((category, index) => (
                <motion.div
                  key={index}
                  variants={cardAnimation}
                  className="mb-8 break-inside-avoid"
                >
                  {renderHeading(category)}
                  <ul className="list-none p-0 m-0 space-y-1">
                    {category.items?.map((item, i) => (
                      <ListItem
                        key={i}
                        title={item.name}
                        href={item.href}
                        className="text-[12px] 2xl:text-sm block py-1 hover:text-primary transition-colors"
                      />
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ServicesSection;
