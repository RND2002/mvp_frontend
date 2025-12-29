import React from "react";
import SecondaryButton from "@/app/ui/button/SecondaryButton";
import PrimaryButton from "@/app/components/common/PrimaryButton";
import { FadeUp, StaggerContainer } from "@/app/components/common/AnimatedWrapper";
import Image from "next/image";
import InlineSVG from "@/app/components/common/InlineSVG";

type HeroProps = {
    data: {
        backgroundImage: string;
        darkShadow: string;
        heading: string;
        highlightedText: string;
        description: string;
        buttons: {
            primary: string;
            secondary: string;
        };
        logos: {
            name: string;
            logo: string;
        }[];
    };
};

const Hero: React.FC<HeroProps> = ({ data }) => {
    const headingLines = data.heading.split("\n");

    return (
        <section
            className="relative overflow-hidden bg-no-repeat bg-center bg-cover"
            style={{
                backgroundImage: `url("${data.backgroundImage}")`,
            }}
        >
            <div className="container px-3 lg:px-6 py-6 lg:py-20 pb-6 w-full mx-auto grid grid-cols-12 items-stretch text-white">
                <div className="col-span-12 lg:col-span-6">
                    <StaggerContainer className="flex flex-col gap-4 lg:gap-8 border-l border-white pl-10">
                        <FadeUp
                            as="h1"
                            className="text-[3rem] md:text-[4rem] 2xl:text-[5rem] leading-[3.5rem] md:leading-[4.5rem] 2xl:leading-normal font-normal"
                        >
                            {headingLines.map((line, i) => {
                                const isHighlighted = line.includes(data.highlightedText);
                                return (
                                    <React.Fragment key={i}>
                                        {isHighlighted ? (
                                            <>
                                                {line.split(data.highlightedText)[0]}
                                                <span className="text-primary font-bold">
                                                    {data.highlightedText}
                                                </span>
                                                {line.split(data.highlightedText)[1]}
                                            </>
                                        ) : (
                                            <>{line}</>
                                        )}
                                        <br />
                                    </React.Fragment>
                                );
                            })}
                        </FadeUp>

                        <FadeUp
                            as="p"
                            className="text-[12px] lg:text-sm 2xl:text-[18px] whitespace-pre-line"
                        >
                            {data.description}
                        </FadeUp>

                        <FadeUp as="div" className="flex gap-4">
                            <SecondaryButton
                                className="bg-gradient-to-r from-white to-primary !bg-[#040405] hover:bg-gradient-to-r hover:from-white hover:to-primary !text-white"
                            >
                                {data.buttons.secondary}
                            </SecondaryButton>

                            <PrimaryButton
                                href="/contact-us"
                                className="!text-text-dark !font-bold bg-gradient-to-r from-white via-primary to-white"
                            >
                                {data.buttons.primary}
                                {/* <InlineSVG src={data.buttons.icon} className="w-5 h-5 text-primary-dark" /> */}
                            </PrimaryButton>
                        </FadeUp>
                        <div className="absolute bottom-0 left-0 lg:hidden w-full h-50">
                            <Image
                                src={data.darkShadow}
                                alt="dark-shadow"
                                width={100}
                                height={100}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </StaggerContainer>
                </div>
            </div>
        </section>
    );
};

export default Hero;
