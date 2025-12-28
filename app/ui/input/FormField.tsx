import clsx from "clsx";
import React from "react";
import { FieldError } from "react-hook-form";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    color?: string;
    as?: "input" | "textarea";
    rows?: number;
    labelClassName?: string;
    inputClassName?: string;
    name?: string;
    error?: FieldError;
}

const FormField: React.FC<FormFieldProps> = ({
    label,
    as = "input",
    color,
    rows = 3,
    labelClassName,
    inputClassName,
    id,
    name,
    error,
    ...props
}) => {
    const fieldId = id || name || label?.toLowerCase().replace(/\s+/g, "-");

    const labelClass = clsx(
        "mb-1",
        color === "white"
            ? "text-sm 2xl:text-lg text-white"
            : "text-sm 2xl:text-lg text-text-dark"
    );

    const inputClass = clsx(
        "w-full px-4 py-3 ",
        as === "input" ? "rounded-[12px]" : "rounded-xl",
        color === "white" &&
        "bg-transparent border border-white text-white placeholder:text-white/70",
        !color && "bg-text-field text-text-dark border border-paragraph/30",
        "focus:ring-1 focus:border-transparent focus:ring-primary/50 focus:outline-none",
        error && "border-transparent focus:ring-primary/50"
    );

    return (
        <div className="grid mb-3 mt-1 relative">
            {label && (
                <label htmlFor={fieldId} className={clsx(labelClassName, labelClass)}>
                    {label}
                </label>
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
                    className={clsx(inputClassName, inputClass)}
                />
            )}
            {error && (
                <div className="absolute -bottom-5">
                    <p className="text-xs text-red-600 mt-1">{error.message}</p>
                </div>
            )}
        </div>
    );
};

export default FormField;
