import InlineSVG from "@/app/components/common/InlineSVG";
import clsx from "clsx";
import Image from "next/image";
import React from "react";
import PopupTrigger from "@/app/components/common/PopupTrigger";

interface DualSectionCardProps {
    item: GenerativeAiSolution;
    showHoverCircle?: boolean;
}

const DualSectionCard: React.FC<DualSectionCardProps> = ({
    item,
    showHoverCircle = false,
}) => {
    return (
        <PopupTrigger as="div">
            <div className="flex py-5 flex-col h-full">
                <div className="relative backdrop-blur-0 bg-primaryCard border border-secondary-theme hover:border-primaryBorder  rounded-[20px] p-6 flex flex-col gap-4 h-full justify-start aspect-6/6 lg:min-h-[380px] lg:aspect-13/16 group overflow-hidden z-0">
                    {showHoverCircle && (
                        <>
                            <Image
                                src="/png/mobile-app/features/top-circle.png"
                                alt="top circle"
                                width={200}
                                height={200}
                                className="absolute w-[60%] top-0 left-0 opacity-0 -translate-x-20 -translate-y-20 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 z-5"
                            />
                            <Image
                                src="/png/mobile-app/features/bottom-circle.png"
                                alt="bottom circle"
                                width={200}
                                height={200}
                                className="absolute w-[30%] bottom-0 right-0 opacity-0 translate-x-20 translate-y-20 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 z-5"
                            />
                            <span className="absolute inset-0 rounded-2xl bg-transparent transition-colors duration-300  z-0" />
                        </>
                    )}
                    <div className="relative w-full h-full rounded-xl z-10">
                        <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-contain transition-transform duration-500 ease-in-out group-hover:scale-105"
                        />
                        {item.logo && (
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[60px] h-[60px] rounded-full bg-[#EB4545] flex items-center justify-center shadow-lg z-20">
                                <InlineSVG
                                    src={item.logo}
                                    alt={`${item.title} Icon`}
                                    width={24}
                                    height={24}
                                    className="object-contain w-6 h-6 text-white"
                                />
                            </div>
                        )}
                    </div>

                    <div className="p-2 bg-white/6 rounded-[15px] border border-white/20 text-center flex flex-col justify-between items-center h-full z-0 relative">
                        <p
                            className={clsx(
                                "mt-4 text-[18px] 2xl:text-[20px] font-normal",
                                showHoverCircle ? "group-hover:text-white" : ""
                            )}
                        >
                            {item.title}
                        </p>
                        <p
                            className={clsx(
                                "text-[14px] 2xl:text-[18px] text-paragraph mt-2",
                                showHoverCircle ? "group-hover:text-white/80" : ""
                            )}
                        >
                            {item.description}
                        </p>
                    </div>
                </div>
            </div>
        </PopupTrigger>
    );
};

export default DualSectionCard;
