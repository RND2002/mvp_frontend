"use client";
import React from "react";
import Container from "@/app/components/common/Container";
import CategoryCard from "./CategoryCards";
import Cta from "@/app/components/common/DatingCta";
import clsx from "clsx";

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
    data, cta, className = "[background-image:var(--gradient-red-white)] bg-no-repeat bg-cover "
}) => {
    return (
        <div className={clsx("", className)}>
            <Container className="py-12 lg:px-6 px-4 ">
                <div className="max-w-[720px] mx-auto text-center mb-12">
                    <h2 className="text-[2.75rem] leading-[3.75rem] tracking-normal text-center">
                        {data.heading}
                        <span className="primary-gradient-text [background-image:var(--gradient-chatbot-dev)] font-bold "> {data.subHeading}</span>
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">{data.description}</p>
                </div>
                <div className="flex flex-wrap -mx-4">
                    {data?.cards.map((card, index) => (
                        <div key={index} className="w-full sm:w-1/2 lg:w-1/4 px-4 mb-6">
                            <CategoryCard data={card} />
                        </div>
                    ))}
                </div>
            </Container>
            {cta && <div className="container mx-auto px-8 mt-16 pb-16"><Cta data={cta} /></div>}
        </div>
    );
};

export default ConsultantCategorySection;
