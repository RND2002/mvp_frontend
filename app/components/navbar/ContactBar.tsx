import React from "react";
import Image from "next/image";
import Link from "next/link";
import EmailIcon from "@/public/assets/icons/email.svg";

interface ContactBarProps {
  contact: {
    email: string;
    uae: { phone: string };
    india: { phone: string };
  };
}

const ContactBar: React.FC<ContactBarProps> = ({ contact }) => {
  return (
    <div className="bg-top-bar-gradient flex items-center justify-end text-white text-[12px] md:text-sm lg:text-base">
      <div className="container mx-auto flex items-center justify-end px-3 md:px-4 lg:px-6">
        <div className="flex items-center space-x-2">
          <Image src={EmailIcon} alt="Email" className="w-5 h-5 invert" />
          <Link
            href={`mailto:${contact.email}`}
            passHref
            className="hover:underline font-bold"
          >
            {contact.email}
          </Link>
        </div>

        <div className="h-8 w-0.5 bg-[#FFFFFF4A] mx-4 md:mx-8 opacity-50" />
      </div>
    </div>
  );
};

export default ContactBar;
