// Force update: 2025-12-29 23:35
import React from "react";
import ArrowRightIcon from "@/app/assets/icons/arrow-right.svg";
import WhiteButton from "@/app/ui/button/WhiteButton";
import CtaImageWrapper from "@/app/components/common/DatingCta/CtaImageWrapper";
import clsx from "clsx";
import { FadeUp, StaggerContainer } from "@/app/components/common/AnimatedWrapper";
import InlineSVG from "@/app/components/common/InlineSVG";

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

interface CtaSectionProps {
  data: CtaData;
  noDescription?: boolean;
}

const CtaSection: React.FC<CtaSectionProps> = ({ data, noDescription }) => {
  const { title, description, buttonText, backgroundImage, image, image2 } = data;
  return (
    <section
      className="relative z-20 bg-no-repeat bg-center bg-cover text-white rounded-xl"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <StaggerContainer className="container mx-auto px-3 md:px-4 lg:px-8 py-3 lg:py-16 flex relative z-10">
        <div className="flex flex-col justify-center">
          <FadeUp as="h2" className={clsx("font-bold leading-snug mb-4 whitespace-pre-line", description ? "2xl:text-4xl md:text-[1.9rem] text-[1.4rem] " : "2xl:text-5xl md:text-[2.5rem] text-[1.4rem] ")}>
            {title}
          </FadeUp>

          <FadeUp as="p" className="text-[14px] 2xl:text-[18px] max-w-xl mb-8">
            {noDescription ? "" : description}
          </FadeUp>
          <FadeUp>
            <WhiteButton className="w-max">
              {buttonText}
              <InlineSVG src={ArrowRightIcon.src || ArrowRightIcon} className="w-5 h-5 ml-2" />
            </WhiteButton>
          </FadeUp>
        </div>
        <CtaImageWrapper image={image} image2={image2} />
      </StaggerContainer>
      <div className="absolute -bottom-16 left-0 right-0 h-16 bg-white  pointer-events-none z-20 w-[95%] mx-auto " />
    </section>
  );
};

export default CtaSection;
