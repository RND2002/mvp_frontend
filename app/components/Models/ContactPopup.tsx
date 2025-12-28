"use client";

import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PopupFormField from "@/app/ui/input/PopupFormField";
import PrimaryButton from "@/app/components/common/PrimaryButton";
import PhoneInputField from "@/app/hooks/usePhoneInput";
import { contactFormSchema } from "@/app/lib/yup";
import clsx from "clsx";
import { apiRequest } from "@/app/lib/api";
import { useAlert } from "@/app/hooks/useAlert";
import MathCaptcha from "@/app/components/common/MathCaptcha";
import { useMathCaptcha } from "@/app/hooks/useMathCaptcha";
import { useOutsideClick } from "@/app/hooks/useOutsideClick";
import { motion } from "framer-motion";

interface FormValues {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    message: string;
}

export interface ContactPopupProps {
    data?: any;
    open: boolean;
    onClose: () => void;
}

const ContactPopup: React.FC<ContactPopupProps> = ({
    data,
    open,
    onClose,
}) => {
    const popupRef = useRef<HTMLDivElement>(null);
    useOutsideClick(popupRef, onClose);
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

    useEffect(() => {
        if (open) {
            captcha.refresh();
        }
    }, [open]);

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

    if (!open) return null;

    return (
        <motion.div
            className="fixed inset-0 z-[999999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div
                ref={popupRef}
                initial={{ y: 50, opacity: 0, scale: 0.96 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 50, opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 18, stiffness: 120 }}
                className="bg-white rounded-3xl w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold mb-6 text-center">Contact Us</h2>

                <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <PopupFormField
                                label="First Name"
                                placeholder="First Name"
                                iconSrc="/icons/contact-us/pop-up/user.svg"
                                {...register("firstName")}
                                error={errors.firstName}
                            />
                        </div>
                        <div>
                            <PopupFormField
                                label="Last Name"
                                placeholder="Last Name"
                                iconSrc="/icons/contact-us/pop-up/user.svg"
                                {...register("lastName")}
                                error={errors.lastName}
                            />
                        </div>
                    </div>

                    <PopupFormField
                        label="Email"
                        placeholder="your@email.com"
                        iconSrc="/icons/contact-us/pop-up/input-email.svg"
                        {...register("email")}
                        error={errors.email}
                    />

                    <PhoneInputField
                        control={control}
                        name="phone"
                        placeholder="Phone Number"
                        inputClassName={inputClassName}
                        error={errors.phone}
                    />

                    <PopupFormField
                        label="Message"
                        as="textarea"
                        rows={4}
                        placeholder="How can we help?"
                        {...register("message")}
                        error={errors.message}
                    />

                    <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                        <MathCaptcha captcha={captcha} />

                        <PrimaryButton
                            type="submit"
                            className="w-full sm:w-auto px-8"
                        >
                            {isSubmitting ? "Submitting..." : "Send Message"}
                        </PrimaryButton>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default ContactPopup;
