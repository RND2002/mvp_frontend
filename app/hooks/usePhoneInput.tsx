"use client";
import React from "react";
import {
    Controller,
    Control,
    FieldError,
    FieldValues,
    Path,
} from "react-hook-form";
import ReactPhoneInput from "react-phone-number-input";
import clsx from "clsx";
import "react-phone-number-input/style.css";
import "./phone-input.css";

interface PhoneInputFieldProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    color?: string;
    placeholder?: string;
    labelClassName?: string;
    inputClassName?: string;
    error?: FieldError;
}

const PhoneInputField = <T extends FieldValues>({
    control,
    name,
    label = "",
    color,
    placeholder,
    labelClassName,
    inputClassName,
    error,
}: PhoneInputFieldProps<T>) => {
    const labelClass = clsx(
        "mb-1",
        labelClassName,
        color === "white"
            ? "text-sm 2xl:text-lg text-white"
            : "text-sm 2xl:text-lg text-text-white"
    );

    const inputClass = clsx(
        "w-full px-4 py-3",
        "rounded-[12px]",
        // Always usage dark theme for consistency
        "bg-vehicle-card-bg text-white border border-vehicle-card-border placeholder:text-gray-500",
        "focus:border-green-500 focus:ring-green-500/50 focus:outline-none focus:ring-[3px]",
        error && "border-red-500 focus:ring-red-500/50",
        inputClassName
    );

    return (
        <div className="grid mb-3 mt-1 relative">
            {label && (
                <label htmlFor={name} className={labelClass}>
                    {label}
                </label>
            )}

            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, value, ref } }) => (
                    <div className="relative w-full">
                        <div className="relative custom-phone-input-wrapper">
                            <ReactPhoneInput
                                international
                                defaultCountry="IN"
                                value={value}
                                onChange={onChange}
                                id={name}
                                limitMaxLength={true}
                                inputRef={ref}
                                placeholder={placeholder}
                                className="custom-phone-input"
                                numberInputProps={{
                                    className: inputClass
                                }}
                            />
                        </div>
                        <div className="absolute -bottom-5">
                            {error && (
                                <p className="text-xs text-red-600 mt-1">{error.message}</p>
                            )}
                        </div>
                    </div>
                )}
            />
        </div>
    );
};

export default PhoneInputField;
