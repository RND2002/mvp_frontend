import React from "react";
import DualSectionCard from "../common/DualSectionCard";
import { SpringUp } from "@/app/components/common/AnimatedWrapper";

interface ServicesItem {
    title: string;
    description: string;
    logo: string;
    image: string;
}

interface ServicesProps {
    data: {
        heading: {
            highlighted: string;
            line1: string;
        };
        paragraph: string;
        items: ServicesItem[];
    };
}

const Services: React.FC<ServicesProps> = ({ data }) => {
    const { heading, paragraph, items } = data;
    return (
        <section className="relative [background-image:var(--gradient-generative-ai-solution)] overflow-hidden">
            <div className="container px-3 lg:px-6 py-6 lg:py-16 w-full mx-auto">
                <h2 className="2xl:text-4xl md:text-[2.3rem] text-[1.4rem] font-normal text-center leading-normal">
                    <span className="font-bold primary-gradient-text ![background-image:var(--gradient-chatbot-dev)]">
                        {heading.highlighted}
                    </span>
                    <br />
                    {heading.line1}
                </h2>
                <p className="text-[12px] lg:text-sm 2xl:text-[18px] text-paragraph text-center whitespace-pre-line mt-2">
                    {paragraph}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full flex-shrink-0 items-stretch mt-8">
                    {items.map((item, idx) => (
                        <SpringUp delay={idx * 0.1} key={idx}>
                            <DualSectionCard showHoverCircle item={item} />
                        </SpringUp>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
