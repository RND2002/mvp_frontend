"use client";

import React, { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { AnimatePresence, motion } from "framer-motion";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useOutsideClick } from "@/app/hooks/useOutsideClick";
import InlineSVG from "@/app/components/common/InlineSVG";
import PrimaryButton from "@/app/components/common/PrimaryButton";
import PhoneInputField from "@/app/hooks/usePhoneInput";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAlert } from "@/app/hooks/useAlert";
import { apiRequest } from "@/app/lib/api";
import MathCaptcha from "@/app/components/common/MathCaptcha";
import { useMathCaptcha } from "@/app/hooks/useMathCaptcha";

interface CtaContactData {
    title: string;
    description: string;
}

export interface CtaPopupProps {
    data?: CtaContactData;
    open: boolean;
    onClose: () => void;
}

const contactFormSchema = yup.object({
    phone: yup
        .string()
        .required("Phone number is required")
        .test(
            "is-phone",
            "Enter a valid phone number",
            (val) => !!val && isValidPhoneNumber(val)
        ),
});

interface FormValues {
    phone: string;
}

const CtaPopup: React.FC<CtaPopupProps> = ({ data, open, onClose }) => {
    const popupRef = useRef<HTMLDivElement | null>(null);
    const captcha = useMathCaptcha();
    useOutsideClick(popupRef, onClose);
    const { showAlert } = useAlert();
    const [showCaptcha, setShowCaptcha] = useState(false);
    const captchaRef = useRef<HTMLDivElement | null>(null);

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: yupResolver(contactFormSchema),
        reValidateMode: "onChange",
        defaultValues: {
            phone: "",
        },
    });

    useEffect(() => {
        if (open) {
            captcha.refresh();
        }
    }, [open]);

    if (!open || !data) return null;

    const handleBtnClick = async (values: FormValues) => {
        if (showCaptcha) {
            await submitForm(values);
            return;
        }
        setShowCaptcha(true);
    };

    const submitForm = async (values: FormValues) => {
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
            fullName: "Anonymous",
            phoneNumber: values.phone,
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
        reset();
        setShowCaptcha(false);
        onClose();
    };

    return (
        <motion.div
            className="cta-popup fixed inset-0 z-999999 bg-black/40 backdrop-blur-sm flex items-center justify-center"
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
                className={clsx(
                    "relative rounded-3xl overflow-hidden bg-white w-[90%] max-w-[494px] shadow-xl",
                    "px-8 pb-8 pt-35 text-center flex flex-col items-center"
                )}
            >
                <div className="bg-insight-text rounded-full aspect-square w-[200%] absolute z-0 bottom-[65%] left-1/2 -translate-x-1/2" />

                <h3 className="text-2xl lg:text-3xl 2xl:text-4xl font-bold primary-gradient-text mt-6">
                    {data.title}
                </h3>

                <p className="text-paragraph text-sm lg:text-base 2xl:text-lg mt-3 leading-relaxed max-w-[90%]">
                    {data.description}
                </p>
                {/* Icon placeholder since src might be missing */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <InlineSVG
                        src="/icons/contact-us/pop-up/cta-phone.svg"
                        alt="Phone"
                        preserveColors
                        className="w-8 h-8"
                    />
                </div>

                <form
                    className="relative z-10 w-full mt-10"
                    onSubmit={handleSubmit(handleBtnClick)}
                >
                    <div className="md:max-w-2/3! w-full mx-auto">
                        <PhoneInputField
                            control={control}
                            name="phone"
                            placeholder="Phone number"
                            inputClassName={clsx(
                                "w-full border-b text-sm lg:text-base 2xl:text-lg",
                                "placeholder-[#B4B4B4] focus:border-black",
                                "focus:ring-0 focus:ring-transparent focus:outline-none",
                                errors.phone ? "border-primary" : "border-paragraph/50"
                            )}
                            error={errors.phone}
                        />
                    </div>

                    <div className="relative mt-7">
                        <PrimaryButton
                            type="submit"
                            openPopup={false}
                            className="md:w-2/4 w-full font-medium! py-2.5 flex justify-center mx-auto"
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </PrimaryButton>

                        <AnimatePresence>
                            {showCaptcha && (
                                <motion.div
                                    ref={captchaRef}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.25 }}
                                    className={clsx(
                                        "absolute bottom-0 right-20 translate-x-1/2 bg-white p-3",
                                        "rounded-xl shadow-lg border border-paragraph/20 z-10000"
                                    )}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-sm font-normal text-paragraph">
                                            Verify you’re human
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setShowCaptcha(false)}
                                            className="text-xs text-paragraph/70 hover:text-primary cursor-pointer"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <MathCaptcha captcha={captcha} showRefreshButton={true} />

                                    <PrimaryButton
                                        type="button"
                                        openPopup={false}
                                        onClick={handleSubmit(submitForm)}
                                        className="mt-4 w-full justify-center"
                                    >
                                        Verify & Submit
                                    </PrimaryButton>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default CtaPopup;
