"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Logo from "@/app/assets/icons/logo.svg";
import Image from "next/image";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { otpSchema } from "@/app/schema/login/otpSchema"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useDispatch } from "react-redux"
import { setCredentials } from "@/app/store/slices/authSlice"
import { useVerifyOtpMutation } from "@/app/beService/auth-service";
import { toast } from "sonner";


interface OtpVerificationDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    phoneNumber: string;
}

export default function OtpVerificationDialog({ open, setOpen, phoneNumber }: OtpVerificationDialogProps) {
    const router = useRouter()
    const dispatch = useDispatch()
    const { control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(otpSchema),
        defaultValues: {
            otp: ""
        }
    })

    // Initial otp array state
    const [otpState, setOtpState] = React.useState<string[]>(new Array(6).fill(""));
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

    const [verifyOtp, { isLoading }] = useVerifyOtpMutation()

    // Sync local state to form
    React.useEffect(() => {
        setValue("otp", otpState.join(""))
    }, [otpState, setValue])

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false;

        const newOtp = [...otpState];
        newOtp[index] = element.value;
        setOtpState(newOtp);

        // Focus next input
        if (element.value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace") {
            if (!otpState[index] && index > 0) {
                inputRefs.current[index - 1]?.focus();
                const newOtp = [...otpState];
                newOtp[index - 1] = "";
                setOtpState(newOtp);
            } else {
                const newOtp = [...otpState];
                newOtp[index] = "";
                setOtpState(newOtp);
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otpState];
        pastedData.split("").forEach((char, i) => {
            if (i < 6) newOtp[i] = char;
        });
        setOtpState(newOtp);
        inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
    };


    const onFormSubmit = async (data: yup.InferType<typeof otpSchema>) => {
        if (!phoneNumber) {
            toast.error("Phone number missing. Please define login flow.")
            return
        }

        try {
            const result = await verifyOtp({
                phone: phoneNumber,
                otp: data.otp
            }).unwrap()

            if (result.success) {
                dispatch(setCredentials({ user: result.user, token: result.token }))
                toast.success("User logged in successfully")
                setOpen(false)
                router.push("/dashboard")
            }
        } catch (error: any) {
            console.error(error)
            toast.error(error?.data?.error || "Invalid OTP")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[450px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[#091A23] via-[#0D212C] to-[#000000] border-[#163341] text-white">
                <DialogHeader>
                    <DialogTitle className="bg-transparent flex justify-start">
                        <Image src={Logo} alt="Vroom" width={128} height={42} className="w-32 h-auto drop-shadow-[0_4px_8px_rgba(255,255,255,0.15)]" />
                    </DialogTitle>
                    <DialogDescription className="text-xl font-bold text-gray-300">
                        Enter Verification Code
                    </DialogDescription>
                    <p className="text-sm text-gray-400">
                        We have sent a verification code to {phoneNumber || "your phone number"}.
                    </p>
                </DialogHeader>
                <form onSubmit={handleSubmit(onFormSubmit)} className="grid gap-6 py-4">
                    <div className="flex justify-center gap-1 sm:gap-2">
                        {otpState.map((data, index) => {
                            return (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength={1}
                                    ref={(el) => { inputRefs.current[index] = el }}
                                    value={data}
                                    onChange={(e) => handleChange(e.target, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onPaste={handlePaste}
                                    className="w-10 h-10 sm:w-12 sm:h-12 text-center text-xl font-bold bg-[#163341] border border-[#2D5A6E] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                />
                            );
                        })}
                    </div>
                    {errors.otp && <p className="text-red-500 text-sm text-center">{errors.otp.message}</p>}

                    <div className="flex justify-center">
                        <Button
                            type="submit"
                            loading={isLoading}
                            className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 border-none shadow-lg text-white font-bold py-2 rounded-lg transform transition hover:scale-[1.02]"
                        >
                            Verify & Proceed
                        </Button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-400">
                            Didn't receive the code? <button type="button" className="text-red-500 font-semibold hover:underline bg-transparent border-none cursor-pointer">Resend</button>
                        </p>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
