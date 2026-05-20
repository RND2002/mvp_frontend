"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { loginSchema } from "@/app/schema/login/loginSchema"
import PhoneInputField from "@/app/hooks/usePhoneInput"
import { Input } from "@/components/ui/input"
import { Lock, Mail, Phone } from "lucide-react"
import IconLogo from "@/app/assets/icons/create-custom.svg";
import Image from "next/image";
import { toast } from "sonner"
import { useLoginWithEmailMutation, useSendOtpMutation, useSignupWithEmailMutation } from "@/app/beService/auth-service"
import * as yup from "yup"
import { useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { setCredentials } from "@/app/store/slices/authSlice"
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
    const dispatch = useDispatch()
    const router = useRouter()
    const [loginMethod, setLoginMethod] = React.useState<'phone' | 'email'>('email')
    const [emailMode, setEmailMode] = React.useState<'login' | 'signup'>('login')


    const {
        control,
        handleSubmit,
        register,
        reset,
        formState: { errors },
    } = useForm<LoginSchemaType>({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            method: "phone",
            phone: "",
            email: "",
            password: "",
        },
    });



    // Reset form when switching methods
    React.useEffect(() => {
        reset({ method: loginMethod, phone: "", email: "", password: "" })
    }, [loginMethod, reset, setOpen])

    const [sendOtp, { isLoading }] = useSendOtpMutation()
    const [loginWithEmail, { isLoading: isEmailLoginLoading }] = useLoginWithEmailMutation()
    const [signupWithEmail, { isLoading: isEmailSignupLoading }] = useSignupWithEmailMutation()

    const onSubmit = async (data: LoginSchemaType) => {
        try {
            if (loginMethod === 'email') {
                const payload = { email: data.email!, password: data.password! }
                const result = emailMode === 'login'
                    ? await loginWithEmail(payload).unwrap()
                    : await signupWithEmail({ ...payload, role: 'customer' }).unwrap()

                if (result.success) {
                    dispatch(setCredentials({ user: result.user, token: result.token }))
                    toast.success(emailMode === 'login' ? 'Logged in successfully' : 'Account created successfully')
                    setOpen(false)
                    router.push("/dashboard")
                }
                return
            }

            const payload = { phone: data.phone }
            const result = await sendOtp(payload).unwrap()
            // console.log("OTP Sent", result)
            if (result.success) {
                toast.success('OTP sent successfully')
                const identifier = data.phone
                onLoginSuccess?.(identifier!, loginMethod)
            }
        } catch (error: unknown) {
            console.error(error)
            toast.error((error as { data: { error: string } })?.data?.error || "Authentication failed")
        }
    }


    return (
        <Dialog open={open} onOpenChange={(val) => {
            setLoginMethod('email')
            setOpen(val)
        }}>
            <DialogContent className="sm:max-w-[450px] max-h-[90vh] overflow-y-auto bg-white border border-[#E4E7EC] text-[#0F172A] shadow-xl">
                <DialogHeader>
                    <DialogTitle className="bg-transparent flex justify-start">
                        <Image src={IconLogo as unknown as string} alt="Vroom" className="w-56 h-auto" />
                    </DialogTitle>
                    <DialogDescription className="text-xl font-bold text-[#475569]">
                        Log in to keep your vehicle running smooth!
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    {/* Method Toggle */}
                    <div className="grid grid-cols-2 gap-2 bg-[#F8F9FB] p-1 rounded-lg border border-[#E4E7EC]">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setLoginMethod('email')}
                            className={`flex cursor-pointer items-center justify-center gap-2 h-10 rounded-md font-bold uppercase text-[10px] tracking-widest transition-all ${loginMethod === 'email' ? 'bg-[#DCFCE7] text-[#6B2FA0] border border-[#DCFCE7]' : 'text-[#94A3B8] hover:text-[#475569]'}`}
                        >
                            <Mail className="w-3.5 h-3.5" /> Email
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setLoginMethod('phone')}
                            className={`flex cursor-pointer items-center justify-center gap-2 h-10 rounded-md font-bold uppercase text-[10px] tracking-widest transition-all ${loginMethod === 'phone' ? 'bg-[#DCFCE7] text-[#6B2FA0] border border-[#DCFCE7]' : 'text-[#94A3B8] hover:text-[#475569]'}`}
                        >
                            <Phone className="w-3.5 h-3.5" /> Phone
                        </Button>
                    </div>

                    {loginMethod === 'email' && (
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setEmailMode('login')}
                                className={`h-9 rounded-md text-[10px] font-bold uppercase tracking-widest ${emailMode === 'login' ? 'bg-[#F8F9FB] border border-[#E4E7EC] text-[#0F172A]' : 'text-[#94A3B8]'}`}
                            >
                                Login
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setEmailMode('signup')}
                                className={`h-9 rounded-md text-[10px] font-bold uppercase tracking-widest ${emailMode === 'signup' ? 'bg-[#F8F9FB] border border-[#E4E7EC] text-[#0F172A]' : 'text-[#94A3B8]'}`}
                            >
                                Create Account
                            </Button>
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        {loginMethod === 'phone' ? (
                            <>
                                <PhoneInputField
                                    control={control}
                                    name="phone"
                                    label="Phone Number"
                                    placeholder="Enter phone number"
                                />
                                {errors.phone && <p className="text-[#DC2626] text-xs mt-1 font-bold">{errors.phone.message}</p>}
                            </>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#475569]">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                                        <Input
                                            {...register('email')}
                                            type="email"
                                            placeholder="Enter your email"
                                            className="h-12 pl-10 bg-white border border-[#E4E7EC] text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:ring-[#6B2FA0]/30 focus-visible:border-[#6B2FA0] selection:bg-[#6B2FA0] selection:text-white rounded-xl"
                                        />
                                    </div>
                                    {errors.email && <p className="text-[#DC2626] text-[10px] font-bold uppercase tracking-wider mt-1">{errors.email.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#475569]">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                                        <Input
                                            {...register('password')}
                                            type="password"
                                            placeholder="Enter your password"
                                            className="h-12 pl-10 bg-white border border-[#E4E7EC] text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:ring-[#6B2FA0]/30 focus-visible:border-[#6B2FA0] selection:bg-[#6B2FA0] selection:text-white rounded-xl"
                                        />
                                    </div>
                                    {errors.password && <p className="text-[#DC2626] text-[10px] font-bold uppercase tracking-wider mt-1">{errors.password.message}</p>}
                                </div>
                            </>
                        )}
                    </div>
                    <p className="text-[10px] font-medium text-[#94A3B8] text-center leading-relaxed">
                        By continuing, you agree to our <span className="text-[#6B2FA0] cursor-pointer hover:underline">Terms of Service</span> and <span className="text-[#6B2FA0] cursor-pointer hover:underline">Privacy Policy</span>.
                    </p>
                    <div className="flex justify-center pt-2">
                        <Button
                            type="submit"
                            loading={isLoading || isEmailLoginLoading || isEmailSignupLoading}
                            loadingText={loginMethod === 'phone' ? 'Sending OTP...' : 'Signing in...'}
                            className="w-full h-12 cursor-pointer bg-[#6B2FA0] hover:bg-[#6B2FA0] text-white font-bold uppercase text-xs tracking-widest rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-none border-0"
                        >
                            {loginMethod === 'phone'
                                ? 'Continue With Phone'
                                : emailMode === 'login'
                                    ? 'Login to Vroom'
                                    : 'Create Account'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
