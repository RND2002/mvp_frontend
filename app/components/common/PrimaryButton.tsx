import React from "react";
import clsx from "clsx";
import CustomButton from "@/app/ui/button/CustomButton";

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
    openPopup?: boolean;
    href?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    children,
    className,
    openPopup = true,
    ...props
}) => {
    return (
        <CustomButton
            className={clsx("bg-black text-white hover:bg-gray-800", className)}
            openPopup={openPopup}
            {...props as any}
        >
            {children as any}
        </CustomButton>
    );
};

export default PrimaryButton;
