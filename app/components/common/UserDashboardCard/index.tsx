"use client";
import React from "react";
import FeatureCard from "@/app/components/common/UserDashboardCard/FeatureCard";
import Cta from "@/app/components/common/UserDashboardCard/Cta";
import { useRouter } from "next/navigation";
import PopupTrigger from "../PopupTrigger";

type Props = {
    data: {
        title: string;
        highlightedTitle: string;
        description: string;
        cards: any[];
        // cta: {
        //     title: string;
        //     description: string;
        //     imageSrc: string;
        //     buttons: {
        //         secondary: string;
        //         primary: string;
        //     };
        // };
    };
    withCta?: boolean;
};

const OurDevelopmentApproach: React.FC<Props> = ({ data, withCta = true }) => {
    const router = useRouter();

    return (
        <section className="relative bg-light">
            <div className="container px-1 lg:px-0 pb-6 lg:py-0 py-6 w-full mx-auto">
                <h2 className="2xl:text-4xl md:text-[2.3rem] text-[1.4rem] font-normal leading-normal">
                    Hello Aryan
                    <br />
                    <span className="font-bold primary-gradient-text">{data.highlightedTitle}</span>
                </h2>

                {/*  <p className="text-[12px] lg:text-base 2xl:text-[18px] text-paragraph text-center whitespace-pre-line mt-4">{data.description}</p> */}

                {/* Cards loop */}
                <div className="mt-8 space-y-8">
                    {data.cards.map((card, i) => (
                        <div
                            key={i}
                            onClick={() => router.push(card.link || "/health")}
                            className="block w-full sticky top-20 z-10 cursor-pointer"
                        >
                            <FeatureCard {...card} reverse={i % 2 === 1} />
                        </div>
                    ))}
                </div>

                {/* {withCta && <Cta data={data.cta} />} */}
            </div>
        </section>
    );
};

export default OurDevelopmentApproach;
