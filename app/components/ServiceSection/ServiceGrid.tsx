"use client";
import React, { useEffect, useRef, useState } from "react";
import ArrowRightIcon from "@/app/assets/icons/arrow-right.svg";
import InlineSVG from "@/app/components/common/InlineSVG";
import { useMediaQuery } from "@/app/hooks/useMediaQuery";
import { usePopup } from "@/app/components/Providers/ContactUsPopupProvider";
import clsx from "clsx";
interface PartnerGirdProps {
    data: PartnerSection;
}

const PartnerGrid: React.FC<PartnerGirdProps> = ({ data }) => {
    const arrowRightSrc = (ArrowRightIcon as any).src || ArrowRightIcon;
    const isMobileOrTab = useMediaQuery("(max-width: 1024px)");
    const [activeIndex, setActiveIndex] = useState(0);
    const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
    const activeButtonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (activeButtonRef.current && window.innerWidth < 1024) {
            activeButtonRef.current.scrollIntoView({
                behavior: "smooth",
                inline: "start",
                block: "nearest",
            });
        }
    }, [activeIndex]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = sectionRefs.current.indexOf(
                            entry.target as HTMLDivElement
                        );
                        if (index !== -1) setActiveIndex(index);
                    }
                });
            },
            {
                threshold: 0.5,
                rootMargin: `-20px 0px 0px 0px`,
            }
        );

        sectionRefs.current.forEach((section) => {
            if (section) observer.observe(section);
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    const handleClick = (idx: number) => {
        const target = sectionRefs.current[idx];
        if (target) {
            const yOffset = -200;
            const y =
                target.getBoundingClientRect().top + window.pageYOffset + yOffset;

            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };
    const { showPopup } = usePopup();
    const handleOnClickRedirect = () => {
        showPopup();
    };
    return (
        <>
            {isMobileOrTab && (
                <div className="sticky top-[68px] z-20">
                    <div className="flex bg-white/0 backdrop-blur-md gap-3 overflow-x-auto scrollbar-none px-4 py-3">
                        {data.items.map((item, i) => (
                            <button
                                key={item.title}
                                ref={i === activeIndex ? activeButtonRef : null}
                                onClick={() => handleClick(i)}
                                className={`whitespace-nowrap px-6 py-2 rounded-full border transition-all duration-300 ${i === activeIndex
                                    ? "bg-primary/45 text-white border-white"
                                    : "bg-primary/12 text-paragraph border-gray-600"
                                    }`}
                            >
                                {item.title}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            <div className="grid lg:grid-cols-12 gap-8 items-start">
                {!isMobileOrTab && (
                    <div className="lg:col-span-3 sticky top-20 hidden lg:block">
                        <div className="bg-card-accent space-y-8 text-paragraph border border-paragraph rounded-[20px] p-6 pb-8">
                            {data.items.map((item, idx) => (
                                <button
                                    key={item.title}
                                    onClick={() => handleClick(idx)}
                                    className="w-full text-left border-b border-paragraph last:border-b-0 cursor-pointer pb-4"
                                >
                                    <h4
                                        className={`${idx === activeIndex ? "primary-gradient-light-text" : ""
                                            } 2xl:text-xl text-base font-normal`}
                                    >
                                        {item.title}
                                    </h4>
                                    <p
                                        className={`${idx === activeIndex ? "text-white" : ""
                                            } text-[14px] 2xl:text-[18px]`}
                                    >
                                        {item.subtitle}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="lg:col-span-9 space-y-8">
                    {data.items.map((item, idx) => (
                        <div
                            key={idx}
                            ref={(el) => {
                                sectionRefs.current[idx] = el;
                            }}
                            className="relative bg-card flex flex-col text-left p-6 pb-14 text-white rounded-[20px] h-full"
                        >
                            <h3 className="text-[1.5rem] lg:text-[2.5rem] font-normal mb-2">
                                {item.content.heading}
                            </h3>
                            <p className="text-white text-[14px] 2xl:text-[18px] max-w-lg">
                                {item.content.description}
                            </p>

                            <h4 className="2xl:text-2xl lg:text-xl text-[15px] font-normal mt-4 mb-2">
                                {data?.labels?.techExpertise}
                            </h4>
                            <div className="grid grid-cols-3 md:grid-cols-6 lg:gap-4 gap-1 auto-rows-fr">
                                {item.techExpertise.map((tech: any) => (
                                    <div
                                        key={tech.name}
                                        className={clsx(
                                            "relative flex flex-col items-center justify-center bg-white text-text-dark lg:p-4 p-2 rounded-lg cursor-pointer",
                                            "group hover:bg-primary hover:scale-[1.05] transition-all duration-300 ease-in-out aspect-square h-full"
                                        )}
                                        onClick={handleOnClickRedirect}
                                    >
                                        <InlineSVG
                                            src={tech.icon}
                                            preserveColors={tech.preserveColor || false}
                                            className="lg:w-8 w-6 lg:h-10 h-6 mb-2 text-primary group-hover:text-white transition-colors"
                                        />
                                        <p className="text-center text-primary-dark group-hover:text-white text-[11px] lg:text-[14px] 2xl:text-[18px]">
                                            {tech.name}
                                        </p>
                                        <InlineSVG src={arrowRightSrc} className="absolute w-5 h-5 top-2 right-2 opacity-0 text-white group-hover:opacity-100 transition-opacity duration-200 [&_path]:stroke-[3px]" />
                                    </div>
                                ))}
                            </div>
                            <h4 className="2xl:text-2xl lg:text-xl text-[15px] font-normal mt-4 mb-2">
                                {data?.labels?.futureProducts}
                            </h4>
                            <div className="flex gap-3 flex-wrap">
                                {item.futureProducts.map((product: any, idx2: number) => (
                                    <button
                                        key={`${product.name}-${idx2}`}
                                        onClick={handleOnClickRedirect}
                                        className="flex w-full md:w-[180px] lg:w-[200px] h-[60px] items-center justify-between gap-2 bg-partner-button rounded-[10px] px-2 py-1 text-sm font-semibold cursor-pointer hover:scale-[1.05] transition-all duration-300 ease-in-out"
                                    >
                                        <InlineSVG
                                            src={product.icon}
                                            preserveColors={true}
                                            className="h-[30px] max-w-20"
                                        />
                                        <div className="w-6 h-6 border border-white rounded-full flex items-center justify-center">
                                            <InlineSVG src={arrowRightSrc} className="w-3 h-3" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default PartnerGrid;
