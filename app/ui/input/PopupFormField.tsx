import clsx from "clsx";
import React from "react";
import { FieldError } from "react-hook-form";
import InlineSVG from "@/app/components/common/InlineSVG";

interface PopupFormFieldProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    color?: string;
    as?: "input" | "textarea";
    rows?: number;
    labelClassName?: string;
    inputClassName?: string;
    name?: string;
    error?: FieldError;
    iconSrc?: string;
}

const PopupFormField: React.FC<PopupFormFieldProps> = ({
    label,
    as = "input",
    color,
    rows = 3,
    labelClassName,
    inputClassName,
    id,
    name,
    error,
    iconSrc,
    ...props
}) => {
    const fieldId = id || name || label?.toLowerCase().replace(/\s+/g, "-");

    const hasIcon = !!iconSrc;

    const labelClass = clsx(
        "mb-1 hidden",
        color === "white"
            ? "text-sm 2xl:text-lg text-white"
            : "text-sm 2xl:text-lg text-text-dark"
    );

    const inputClass = clsx(
        "w-full py-2 border-b text-xs lg:text-sm 2xl:text-base",
        "placeholder-[#B4B4B4] focus:border-black",
        "focus:ring-0 focus:outline-none",
        error ? "border-primary" : "border-paragraph/50",
        hasIcon && "pl-6.5"
    );

    return (
        <div className="grid mb-3 mt-1 relative">
            {label && (
                <label htmlFor={fieldId} className={clsx(labelClassName, labelClass)}>
                    {label}
                </label>
            )}

            <div className="relative">
                {as === "input" && iconSrc && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none w-5 h-5 flex items-center">
                        <InlineSVG
                            src={iconSrc}
                            alt={`${label}-icon`}
                            preserveColors
                            className="w-5 h-5"
                        />
                    </div>
                )}

                {as === "textarea" ? (
                    <textarea
                        id={fieldId}
                        rows={rows}
                        name={name}
                        {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                        className={clsx(inputClassName, inputClass, "resize-none")}
                    />
                ) : (
                    <input
                        id={fieldId}
                        {...props}
                        name={name}
                        autoComplete="on"
                        className={clsx(inputClassName, inputClass)}
                    />
                )}
            </div>

            {error && (
                <div className="absolute -bottom-5">
                    <p className="text-xs text-red-600 mt-1 whitespace-nowrap">
                        {error.message}
                    </p>
                </div>
            )}
        </div>
    );
};

export default PopupFormField;
