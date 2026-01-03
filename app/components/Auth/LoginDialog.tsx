"use client"

import * as React from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { loginSchema } from "@/app/schema/login/loginSchema"
import { useRouter } from "next/navigation"
import PhoneInputField from "@/app/hooks/usePhoneInput"
import Logo from "@/app/assets/icons/logo.svg";
import Image from "next/image";
import { toast } from "sonner"
import { useSendOtpMutation } from "@/app/beService/auth-service"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface LoginDialogProps {
    open: boolean
    setOpen: (open: boolean) => void
    onLoginSuccess?: (phone: string) => void
}



export default function LoginDialog({ open, setOpen, onLoginSuccess }: LoginDialogProps) {
    // const isMobile = useIsMobile()
    const router = useRouter()
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            phone: ""
        }
    })

    const [sendOtp, { isLoading }] = useSendOtpMutation()

    const onSubmit = async (data: yup.InferType<typeof loginSchema>) => {
        try {
            const result = await sendOtp({ phone: data.phone }).unwrap()
            // console.log("OTP Sent", result)
            if (result.success) {
                toast.success('OTP sent successfully')
                onLoginSuccess?.(data.phone)
            }
        } catch (error: any) {
            console.error(error)
            toast.error(error?.data?.error || "Failed to send OTP")
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
                        Log in to keep your vehicle running smooth!
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <div className="flex flex-col gap-4">
                        <PhoneInputField
                            control={control}
                            name="phone"
                            label="Phone Number"
                            placeholder="Enter phone number"
                        />
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                    </div>
                    <p className="text-xs text-gray-400 text-center">By continuing, you agree to our <span className="text-red-500 cursor-pointer hover:underline">Terms of Service</span> and <span className="text-red-500 cursor-pointer hover:underline">Privacy Policy</span>.</p>
                    <div className="flex justify-center">
                        <Button
                            type="submit"
                            loading={isLoading}
                            className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 border-none shadow-lg text-white font-bold py-2 rounded-lg transform transition hover:scale-[1.02]"
                        >
                            Login
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
