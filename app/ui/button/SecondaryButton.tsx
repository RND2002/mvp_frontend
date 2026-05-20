import React from "react";
import clsx from "clsx";

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    fullWidth?: boolean;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
    children,
    className,
    fullWidth = false,
    type = "button",
    ...props
}) => {
    return (
        <button
            type={type}
            className={clsx(
                "rounded-[12px] border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-[#94A3B8] transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2",
                fullWidth && "w-full",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

export default SecondaryButton;
