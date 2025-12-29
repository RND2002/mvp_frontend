"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

type CtaImage = {
  src: string;
  alt: string;
};

const CtaImageWrapper: React.FC<{ image: CtaImage , image2: CtaImage}> = ({ image , image2}) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"], 
  });

  const y = useTransform(scrollYProgress, [0, 1], [60, -30]);
  const phone2 = useTransform(scrollYProgress, [0, 1], [80, -20]);
  return (
    <div ref={sectionRef}>
      <motion.div
        style={{ y }}
        className="absolute right-[22%] -bottom-8 w-[250px] md:w-[300px] lg:w-[210px] z-10"
      >
        <Image
          src={image.src}
          alt={image.alt}
          width={480}
          height={500}
          className="w-full h-auto"
        />
      </motion.div>

      <motion.div  
        style={{ y: phone2 }}
        className="absolute right-[8%] -bottom-6 w-[250px] md:w-[300px] lg:w-[210px]">
        <Image
          src={image2.src}
          alt={image2.alt}
          width={480}
          height={500}
          className="w-full h-auto"
        />
      </motion.div>
    </div>
  );
};

export default CtaImageWrapper;
