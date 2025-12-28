import React from "react";
import PartnerGrid from "./ServiceGrid";

interface PartnerSectionProps {
    data: PartnerSection;
}

const PartnerSection: React.FC<PartnerSectionProps> = ({ data }) => {
    return (
        <section
            className="bg-no-repeat bg-center bg-cover bg-card"
        >
            <div className="container mx-auto py-6 lg:py-16 px-3 lg:px-6 z-10" >
                <h3 className="font-normal pt-4 z-20 bg-white/0 backdrop-blur-md 2xl:text-5xl md:text-[2.5rem] text-[1.4rem] text-white mb-8" >
                    {data.title.line1} < br />
                    {data.title.line2}
                </h3>

                < PartnerGrid data={data} />
            </div>
        </section>
    );
};

export default PartnerSection;
