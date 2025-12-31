
import React from 'react';
import Image from 'next/image';
import { FadeUp, StaggerContainer } from '@/app/components/common/AnimatedWrapper';

interface Feature {
    icon: string;
    title: string;
    description?: string;
}

interface AIPoweredFeaturesProps {
    colorText: string;
    title: string;
    phoneImage: string;
    features: Feature[];
}

interface Props {
    data: AIPoweredFeaturesProps;
}

const HealthCard: React.FC<Props> = ({ data }) => {
    return (
        <StaggerContainer>

            <section className="container mx-auto lg:py-16 py-6 px-3 md:px-4 lg:px-6 ">
                <div className="mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start min-h-[900px]">

                        <div className="lg:col-span-4 sticky  flex justify-center lg:top-20">
                            <div className="relative w-full">

                                <Image
                                    src={data.phoneImage}
                                    alt="Mobile App Preview"
                                    width={280}
                                    height={570}
                                    className="w-full h-auto"
                                    priority
                                />
                            </div>
                        </div>


                        {/* Right Side - Features Grid */}
                        <div className="lg:col-span-8 min-h-[900px]">
                            <FadeUp>
                                <div className="mb-8 lg:mb-12">
                                    <h2 className="text-4xl md:text-[2.3rem] text-[1.4rem] font-normal  leading-normal">
                                        <span className="font-bold primary-gradient-text ![background-image:var(--gradient-chatbot-dev)]">{data.colorText}</span>
                                        <span className="block">{data.title}</span>
                                    </h2>

                                </div>
                            </FadeUp>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

                                {data.features.map((feature, index) => (

                                    <div
                                        key={index}
                                        className="group hover:shadow-lg transition-all duration-300 rounded-2xl p-4 bg-white border border-border-gray min-h-[190px] flex flex-col justify-between"
                                    >
                                        {/* Icon: Only this card transitions! */}
                                        <div className="w-14 h-14 bg-ai-red/10 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 overflow-hidden group-hover:opacity-0 group-hover:scale-75 group-hover:h-0 group-hover:mb-0">
                                            <Image
                                                src={feature.icon}
                                                alt={feature.title}
                                                width={24}
                                                height={24}
                                                className="w-6 h-6"
                                            />
                                        </div>

                                        <h4 className="text-base font-semibold mb-2">{feature.title}</h4>

                                        {/* Description: Only on this card's hover */}
                                        {feature.description && (
                                            <p className="text-xs text-paragraph leading-relaxed max-h-0 opacity-0 overflow-hidden group-hover:max-h-40 group-hover:opacity-100 transition-all duration-300">
                                                {feature.description}
                                            </p>
                                        )}
                                    </div>

                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        </StaggerContainer >
    );
};

export default HealthCard;
