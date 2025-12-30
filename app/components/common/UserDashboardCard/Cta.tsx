import React from "react";
import Image from "next/image";
import SecondaryButton from "@/app/ui/button/SecondaryButton";
import ArrowUp from "@/app/assets/icons/arrow-up.svg";
import PrimaryButton from "@/app/components/common/PrimaryButton";

type Props = {
    data: {
        title: string;
        description: string;
        imageSrc: string;
        buttons: {
            secondary: string;
            primary: string;
        };
    };
};

const Cta: React.FC<Props> = ({ data }) => {
    return (
        <section className="w-full flex justify-center mt-16">
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 lg:gap-6 items-stretch">
                <div className="lg:col-span-4 flex justify-center lg:justify-start">
                    <Image src={data.imageSrc} alt="iPhone mockup" width={300} height={400} className="object-contain" priority />
                </div>

                <div className="lg:col-span-8 bg-white rounded-2xl shadow-md p-8">
                    <h2 className="2xl:text-[2.25rem] md:text-[2rem] text-[1.4rem] font-bold mb-4">{data.title}</h2>
                    <p className="text-[13px] text-sm 2xl:text-base leading-relaxed mb-6">{data.description}</p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <SecondaryButton>{data.buttons.secondary}</SecondaryButton>

                        <PrimaryButton className="py-3! px-8! w-max">
                            {data.buttons.primary}
                            {/* <ArrowUp className="w-5 h-5" /> */}
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Cta;
