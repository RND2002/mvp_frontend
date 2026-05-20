import React from "react";
import Image from "next/image";
import InlineSVG from "@/app/components/common/InlineSVG";
import clsx from "clsx";
import PopupTrigger from "../PopupTrigger";

type FeatureCardProps = {
    title: string;
    headline: string;
    description: string;
    phoneSrc: string;
    bgImage: string;
    icon: string;
    buttonText: string;
    reverse?: boolean;
};

const FeatureCard: React.FC<FeatureCardProps> = ({
    title,
    headline,
    description,
    phoneSrc,
    bgImage,
    icon,
    buttonText,
    reverse = false,
}) => {
    const headingOrderClass = reverse ? "md:order-3" : "md:order-1";
    const descOrderClass = reverse ? "md:order-1" : "md:order-3";
    const imageOrderClass = "md:order-2";

    return (
        <article
            className="sticky top-20 rounded-[40px] overflow-hidden bg-no-repeat bg-center bg-cover"
            style={{
                backgroundImage: `url(${bgImage})`
            }}
        >
            <div className="relative z-10 px-6 lg:px-12 pt-6 lg:pt-8 text-white">
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6">
                    <div className={clsx("py-4 text-left", headingOrderClass)}>
                        <InlineSVG
                            src={icon}
                            alt={title}
                            preserveColors
                            className="w-20 h-20 mb-4"
                        />
                        <h3 className="2xl:text-4xl md:text-[2.3rem] text-[1.4rem] font-bold leading-tight">
                            {title}
                        </h3>
                    </div>

                    {/* <div
                        className={clsx(
                            "flex justify-center items-center",
                            imageOrderClass
                        )}
                    >
                        <div className="relative drop-shadow-2xl" aria-hidden>
                            <Image
                                src={phoneSrc}
                                alt={title}
                                width={600}
                                height={800}
                                className="object-contain max-h-[500px] w-auto"
                                priority={false}
                            />
                        </div>
                    </div> */}

                    <div className={clsx("py-6 lg:py-8", descOrderClass)}>
                        <div className="max-w-md mx-auto md:mx-0">
                            <h4 className="text-[#0F172A] font-bold 2xl:text-2xl lg:text-xl text-[15px] mb-3">
                                {headline}
                            </h4>

                            <p className="text-[13px] text-sm 2xl:text-base text-white/90 leading-relaxed">
                                {description}
                            </p>

                            <div className="mt-8 flex items-center gap-4 justify-start">
                                <PopupTrigger as="button" className="cursor-pointer inline-flex items-center gap-2 text-[13px] text-sm 2xl:text-base hover:underline">
                                    {buttonText}
                                </PopupTrigger>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default FeatureCard;
