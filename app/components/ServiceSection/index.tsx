import React from "react";
import PartnerGrid from "@/app/components/ServiceSection/ServiceGrid";
import PlatformFeatures from "../PlatformFeatures/PlatformFeatures";

interface PartnerSectionProps {
  data: PartnerSection;
}

const PartnerSectionComponent: React.FC<PartnerSectionProps> = ({ data }) => {
  return (
    <section
      className="bg-no-repeat bg-center bg-cover bg-primary-theme"
    >
      <div className="container mx-auto pb-6 lg:pb-16 pt-0 px-3 lg:px-6 z-10" >
        <div className="flex justify-center items-center h-[350px]">
          <h3 className="font-bold pt-4 z-20 bg-white/0 backdrop-blur-md 2xl:text-7xl md:text-6xl text-center text-[1.4rem] text-white mb-8 leading-17.5 tracking-tighter" >
            {data.title.line1}
            < br />
            {data.title.line2}
          </h3>
        </div>

        < PartnerGrid data={data} />
      </div>
    </section>
  );
};

export default PartnerSectionComponent;
