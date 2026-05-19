"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { loginSchema, MAIL_PROVIDERS } from "@/app/schema/login/loginSchema"
import PhoneInputField from "@/app/hooks/usePhoneInput"
import { Input } from "@/components/ui/input"
import { Mail, Phone } from "lucide-react"
import IconLogo from "@/app/assets/icons/create-custom.svg";
import Image from "next/image";
import { toast } from "sonner"
import { useSendOtpMutation } from "@/app/beService/auth-service"
import * as yup from "yup"
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
    onLoginSuccess?: (phoneOrEmail: string, type: 'phone' | 'email') => void
}

type LoginSchemaType = yup.InferType<typeof loginSchema>;



export default function LoginDialog({ open, setOpen, onLoginSuccess }: LoginDialogProps) {
    // const isMobile = useIsMobile()
    const [loginMethod, setLoginMethod] = React.useState<'phone' | 'email'>('email')
    const [emailSent, setEmailSent] = React.useState(false)


    const {
        control,
        handleSubmit,
        register,
        reset,
        getValues,
        formState: { errors },
    } = useForm<LoginSchemaType>({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            method: "phone",
            phone: "",
            email: "",
        },
    });



    // Reset form when switching methods
    React.useEffect(() => {
        reset({ method: loginMethod, phone: "", email: "" })
        setEmailSent(false)
    }, [loginMethod, reset, setOpen])

    const [sendOtp, { isLoading }] = useSendOtpMutation()

    const onSubmit = async (data: LoginSchemaType) => {
        try {
            const payload = loginMethod === 'phone' ? { phone: data.phone } : { email: data.email }
            const result = await sendOtp(payload).unwrap()
            // console.log("OTP Sent", result)
            if (result.success) {

                if (loginMethod === 'email') {
                    toast.success('Magic link sent successfully')
                    setEmailSent(true)
                } else {
                    toast.success('OTP sent successfully')
                    const identifier = data.phone
                    onLoginSuccess?.(identifier!, loginMethod)
                }
            }
        } catch (error: unknown) {
            console.error(error)
            toast.error((error as { data: { error: string } })?.data?.error || "Failed to send OTP")
        }
    }

    const openUserMail = (email: string) => {
        if (!email) return;

        const ua = navigator.userAgent.toLowerCase();

        const isAndroid = ua.includes("android");
        const isIOS = ua.includes("iphone") || ua.includes("ipad");

        if (isAndroid) {
            window.location.href =
                "intent://#Intent;scheme=mailto;package=com.google.android.gm;end";
            return;
        }

        if (isIOS) {
            window.location.href = "googlegmail://";
            return;
        }

        const domain = email.split("@")[1]?.toLowerCase();
        const mailUrl = MAIL_PROVIDERS[domain];

        if (mailUrl) {
            window.open(mailUrl, "_blank");
        } else {
            // fallback – open default mail client
            window.location.href = "mailto:";
        }
    }


    return (
        <Dialog open={open} onOpenChange={(val) => {
            setLoginMethod('email')
            setOpen(val)
        }}>            <DialogContent className="sm:max-w-[450px] max-h-[90vh] overflow-y-auto bg-bg-elevated border-border-default text-text-primary shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="bg-transparent flex justify-start">
                        <span className="text-theme-amber text-3xl font-extrabold tracking-[0.25em] drop-shadow-md">TORQ</span>
                    </DialogTitle>
                    <DialogDescription className="text-xl font-bold text-text-secondary">
                        Log in to keep your vehicle running smooth!
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    {!emailSent ? (
                        <>
                            {/* Method Toggle */}
                            <div className="grid grid-cols-2 gap-2 bg-bg-tertiary/50 p-1 rounded-lg border border-border-default">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setLoginMethod('email')}
                                    className={`flex cursor-pointer items-center justify-center gap-2 h-10 rounded-md font-black uppercase text-[10px] tracking-widest transition-all ${loginMethod === 'email' ? 'bg-theme-amber/12 text-theme-amber border border-theme-amber/25' : 'text-text-secondary hover:text-text-primary'}`}
                                >
                                    <Mail className="w-3.5 h-3.5" /> Email
                                </Button>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setLoginMethod('phone')}
                                    className={`flex cursor-pointer items-center justify-center gap-2 h-10 rounded-md font-black uppercase text-[10px] tracking-widest transition-all ${loginMethod === 'phone' ? 'bg-theme-amber/12 text-theme-amber border border-theme-amber/25' : 'text-text-secondary hover:text-text-primary'}`}
                                >
                                    <Phone className="w-3.5 h-3.5" /> Phone
                                </Button>
                            </div>

                            <div className="flex flex-col gap-4">
                                {loginMethod === 'phone' ? (
                                    <>
                                        <PhoneInputField
                                            control={control}
                                            name="phone"
                                            label="Phone Number"
                                            placeholder="Enter phone number"
                                        />
                                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                                    </>
                                ) : (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Email Address</label>
                                        <Input
                                            {...register('email')}
                                            placeholder="Enter your email"
                                            className="h-12 bg-bg-tertiary border-border-default text-text-primary placeholder:text-text-tertiary/75 focus-visible:ring-theme-amber/30 focus-visible:border-theme-amber selection:bg-theme-amber-muted rounded-xl"
                                        />
                                        {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1">{errors.email.message}</p>}
                                    </div>
                                )}
                            </div>
                            <p className="text-[10px] font-medium text-text-tertiary text-center leading-relaxed">
                                By continuing, you agree to our <span className="text-theme-amber cursor-pointer hover:underline">Terms of Service</span> and <span className="text-theme-amber cursor-pointer hover:underline">Privacy Policy</span>.
                            </p>
                            <div className="flex justify-center pt-2">
                                <Button
                                    type="submit"
                                    loading={isLoading}
                                    loadingText="Signing in..."
                                    className="w-full h-12 cursor-pointer bg-theme-amber text-text-inverse font-semibold uppercase text-[10px] tracking-[0.2em] rounded-[6px] hover:bg-theme-amber-hover transition-all active:scale-[0.98] border-0"
                                >
                                    Login to TORQ
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-4 py-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="h-16 w-16 bg-theme-amber/12 rounded-full flex items-center justify-center mb-2">
                                <Mail className="w-8 h-8 text-theme-amber" />
                            </div>
                            <h3 className="text-xl font-semibold text-text-primary">Check your email</h3>
                            <p className="text-text-secondary max-w-[280px]">
                                We sent a magic link to <span className="text-text-primary font-medium">{getValues('email')}</span>
                            </p>
                            <p className="text-sm text-text-tertiary">
                                Click the link in the email to sign in.
                            </p>
                            <div className="flex gap-5">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEmailSent(false)}
                                    className="mt-4 cursor-pointer border-border-default text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
                                >
                                    Back To Login
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => openUserMail(getValues('email') ?? '')}
                                    className="mt-4 cursor-pointer border-border-default text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
                                >
                                    Go To Mail
                                </Button>
                            </div>

                        </div>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    )
}
