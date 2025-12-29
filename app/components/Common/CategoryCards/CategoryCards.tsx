// CategoryCard.tsx
import React from "react";
import Image from "next/image";
import { ConsultantCategoryCard } from "@/app/components/common/CategoryCards/index";
import ArrowRightIcon from "@/app/assets/icons/arrow-right.svg";
import ArrowUpIcon from "@/app/assets/icons/arrow-up.svg";
import InlineSVG from "@/app/components/common/InlineSVG";

interface Props {
    data: ConsultantCategoryCard;
}

const CategoryCard: React.FC<Props> = ({ data }) => {
    return (
        <div className="flex flex-col items-center gap-4 rounded-xl bg-white group transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
            <div className="w-full border-b border-[var(--color-border-gray)] p-3">
                <div className="flex justify-between items-center py-2 px-2 md:min-w-[180px]">
                    <h3 className="text-[1.375rem] md:text-[1rem] leading-7 tracking-normal text-[var(--color-nav-blue)] whitespace-pre-line">
                        {data?.title}
                    </h3>
                    <div className="border border-[var(--color-border-gray)] rounded-full p-3 flex items-center justify-center overflow-hidden transition-colors duration-300 group-hover:[background-color:var(--color-primary)]">
                        <InlineSVG
                            src={ArrowUpIcon.src || ArrowUpIcon}
                            className="block group-hover:hidden w-5 h-5 transition-opacity duration-300 text-primary"
                        />

                        <InlineSVG
                            src={ArrowRightIcon.src || ArrowRightIcon}
                            className="hidden group-hover:block w-4 h-4 transition-opacity duration-300 text-white"
                        />
                    </div>
                </div>
            </div>

            <div className="w-full p-3 transition-all duration-300">
                <Image
                    src={data?.image}
                    alt={data?.title}
                    width={300}
                    height={208}
                    className="rounded-lg object-cover w-full h-full  "
                />
            </div>
        </div>
    );
};

export default CategoryCard;
