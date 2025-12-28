"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PopupFormField from "../../common/PopupFormField";
import PrimaryButton from "../../common/PrimaryButton";
import PhoneInputField from "@/hooks/usePhoneInput";
import { contactFormSchema } from "@/lib/yup";
import clsx from "clsx";
import { apiRequest } from "@/lib/api";
import { useAlert } from "@/hooks/useAlert";
import MathCaptcha from "@/components/common/MathCaptcha";
import { useMathCaptcha } from "@/hooks/useMathCaptcha";

interface FormValues {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    message: string;
}

interface ContactPopupFormProps {
    fields: {
        label: string;
        type: string;
        placeholder: string;
        rows?: number;
    }[];
    buttonText: string;
    onClose: () => void;
}

const ContactPopupForm: React.FC<ContactPopupFormProps> = ({
    fields,
    buttonText,
    onClose,
}) => {
    const { showAlert } = useAlert();
    const captcha = useMathCaptcha();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: yupResolver(contactFormSchema),
        reValidateMode: "onChange",
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            message: "",
        },
    });

    const onSubmit = async (values: FormValues) => {
        if (!captcha.answer.trim()) {
            showAlert("Please solve the CAPTCHA.", "error");
            return;
        }

        let pageSource = "landing-page";

        if (typeof window !== "undefined") {
            const pathParts = window.location.pathname.split("/").filter(Boolean);
            pageSource = pathParts[1] || "landing-page";
        }

        const payload = {
            captchaToken: captcha.token,
            captchaAnswer: captcha.answer,
            fullName: `${values.firstName} ${values.lastName}`,
            email: values.email,
            phoneNumber: values.phone,
            message: values.message,
            pageSource,
        };

        const { success, error } = await apiRequest("/api/contact", {
            method: "POST",
            payload,
        });

        if (!success) {
            showAlert(error || "Submission failed!", "error");
            captcha.refresh();
            return;
        }

        showAlert("Message sent successfully.", "success");
        captcha.refresh();
        reset();
        onClose();
    };

    const inputClassName = clsx(
        "w-full border-b text-xs lg:text-sm 2xl:text-base",
        "placeholder-[#B4B4B4] focus:border-black",
        "focus:ring-0 focus:ring-transparent focus:outline-none",
        errors.phone ? "border-primary" : "border-paragraph/50"
    )

    return (
        <form className="bg-white grid" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <PopupFormField
                        label={fields[0].label}
                        type={fields[0].type}
                        iconSrc="/icons/contact-us/pop-up/user.svg"
                        placeholder={fields[0].placeholder}
                        {...register("firstName")}
                        error={errors.firstName}
                    />
                </div>

                <div>
                    <PopupFormField
                        label={fields[1].label}
                        type={fields[1].type}
                        iconSrc="/icons/contact-us/pop-up/user.svg"
                        placeholder={fields[1].placeholder}
                        {...register("lastName")}
                        error={errors.lastName}
                    />
                </div>
            </div>

            <PopupFormField
                label={fields[2].label}
                type={fields[2].type}
                iconSrc="/icons/contact-us/pop-up/input-email.svg"
                placeholder={fields[2].placeholder}
                {...register("email")}
                error={errors.email}
            />

            <PhoneInputField
                control={control}
                name="phone"
                placeholder={fields[3].placeholder}
                inputClassName={inputClassName}
                error={errors.phone}
            />

            <PopupFormField
                label={fields[4].label}
                as="textarea"
                rows={fields[4].rows}
                placeholder={fields[4].placeholder}
                {...register("message")}
                error={errors.message}
            />

            <div className="flex items-center w-full gap-2">
                <MathCaptcha captcha={captcha} />

                <PrimaryButton
                    type="submit"
                    className="w-max font-medium! py-3 flex-1 text-sm! justify-center"
                >
                    {isSubmitting ? "Submitting..." : buttonText}
                </PrimaryButton>
            </div>
        </form>
    );
};

export default ContactPopupForm;
