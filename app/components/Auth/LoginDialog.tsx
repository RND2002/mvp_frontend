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
            <DialogContent className="sm:max-w-[450px] max-h-[90vh] overflow-y-auto bg-primaryCard border-secondary-theme text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <DialogHeader>
                    <DialogTitle className="bg-transparent flex justify-start">
                        <Image src={IconLogo as unknown as string} alt="Vroom" className="w-56 h-auto drop-shadow-[0_4px_8px_rgba(255,255,255,0.15)]" />
                    </DialogTitle>
                    <DialogDescription className="text-xl font-bold text-gray-300">
                        Log in to keep your vehicle running smooth!
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    {/* Method Toggle */}
                    <div className="grid grid-cols-2 gap-2 bg-primary-theme/50 p-1 rounded-lg border border-secondary-theme">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setLoginMethod('email')}
                            className={`flex cursor-pointer items-center justify-center gap-2 h-10 rounded-md font-black uppercase text-[10px] tracking-widest transition-all ${loginMethod === 'email' ? 'bg-theme-green/10 text-theme-green border border-theme-green/30' : 'text-gray-500 hover:text-white'}`}
                        >
                            <Mail className="w-3.5 h-3.5" /> Email
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setLoginMethod('phone')}
                            className={`flex cursor-pointer items-center justify-center gap-2 h-10 rounded-md font-black uppercase text-[10px] tracking-widest transition-all ${loginMethod === 'phone' ? 'bg-theme-green/10 text-theme-green border border-theme-green/30' : 'text-gray-500 hover:text-white'}`}
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
                                className={`h-9 rounded-md text-[10px] font-black uppercase tracking-widest ${emailMode === 'login' ? 'bg-white/10 text-white' : 'text-gray-500'}`}
                            >
                                Login
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setEmailMode('signup')}
                                className={`h-9 rounded-md text-[10px] font-black uppercase tracking-widest ${emailMode === 'signup' ? 'bg-white/10 text-white' : 'text-gray-500'}`}
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
                                {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                            </>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                        <Input
                                            {...register('email')}
                                            type="email"
                                            placeholder="Enter your email"
                                            className="h-12 pl-10 bg-primary-theme border-secondary-theme text-white placeholder:text-gray-600 focus-visible:ring-theme-green/30 focus-visible:border-theme-green selection:bg-theme-green/20 rounded-xl"
                                        />
                                    </div>
                                    {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1">{errors.email.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                        <Input
                                            {...register('password')}
                                            type="password"
                                            placeholder="Enter your password"
                                            className="h-12 pl-10 bg-primary-theme border-secondary-theme text-white placeholder:text-gray-600 focus-visible:ring-theme-green/30 focus-visible:border-theme-green selection:bg-theme-green/20 rounded-xl"
                                        />
                                    </div>
                                    {errors.password && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1">{errors.password.message}</p>}
                                </div>
                            </>
                        )}
                    </div>
                    <p className="text-[10px] font-medium text-gray-600 text-center leading-relaxed">
                        By continuing, you agree to our <span className="text-theme-green cursor-pointer hover:underline">Terms of Service</span> and <span className="text-theme-green cursor-pointer hover:underline">Privacy Policy</span>.
                    </p>
                    <div className="flex justify-center pt-2">
                        <Button
                            type="submit"
                            loading={isLoading || isEmailLoginLoading || isEmailSignupLoading}
                            loadingText={loginMethod === 'phone' ? 'Sending OTP...' : 'Signing in...'}
                            className="w-full h-12 cursor-pointer bg-theme-green text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-full hover:bg-theme-green/90 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_10px_30px_rgba(0,223,130,0.2)] border-0"
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
