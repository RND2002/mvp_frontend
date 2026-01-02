"use client";
import React from "react";
import Container from "@/app/components/common/Container";
import CategoryCard from "@/app/components/common/CategoryCards/CategoryCards";
import Cta from "@/app/components/common/DatingCta";
import clsx from "clsx";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export interface ConsultantCategoryCard {
    title: string;
    image: string;
}

export interface ConsultantCategorySectionData {
    heading: string;
    subHeading: string;
    description: string;
    cards: ConsultantCategoryCard[];
}

type CtaImage = {
    src: string;
    alt: string;
};

interface CtaData {
    title: string;
    description: string;
    buttonText: string;
    backgroundImage: string;
    image: CtaImage;
    image2: CtaImage;
}


export interface ConsultantCategorySectionProps {
    data: ConsultantCategorySectionData;
    cta?: CtaData;
    className?: string;
}

const ConsultantCategorySection: React.FC<ConsultantCategorySectionProps> = ({
    data, cta, 
}) => {
    return (
        <div >
            <Container className="py-12 lg:px-6 px-4 ">
                <div className="max-w-[720px] mx-auto text-center mb-12">
                    <h2 className="text-[2.75rem] leading-[3.75rem] tracking-normal text-white text-center">
                        {data.heading}
                        <span className="primary-gradient-text [background-image:var(--gradient-chatbot-dev)] font-bold "> {data.subHeading}</span>
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">{data.description}</p>
                </div>
                <ScrollArea className="w-full pb-4">
                    <div className="flex w-max space-x-4 p-4">
                        {data?.cards.map((card, index) => (
                            <div key={index} className="w-[30vw] sm:w-[300px] lg:w-[350px] flex-shrink-0">
                                <CategoryCard data={card} />
                            </div>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </Container>
            {cta && <div className="container mx-auto px-8 mt-16 pb-16"><Cta data={cta} /></div>}
        </div>
    );
};

export default ConsultantCategorySection;
