"use client"

import * as React from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import PhoneInputField from "@/app/hooks/usePhoneInput"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import PrimaryButton from "../common/PrimaryButton"

interface LoginDialogProps {
    open: boolean
    setOpen: (open: boolean) => void
}

export default function LoginDialog({ open, setOpen }: LoginDialogProps) {
    // const isMobile = useIsMobile()
    const router = useRouter()
    const { control, handleSubmit } = useForm()

    const onSubmit = (data: any) => {
        console.log(data)
        router.push("/dashboard")
        setOpen(false)
    }

    // if (isMobile) {
    //     return (
    //         <Sheet open={open} onOpenChange={setOpen}>
    //             <SheetContent side="right">
    //                 <SheetHeader>
    //                     <SheetTitle>Login</SheetTitle>
    //                     <SheetDescription>
    //                         Enter your phone number to login to your account.
    //                     </SheetDescription>
    //                 </SheetHeader>
    //                 <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
    //                     <div className="flex flex-col gap-4">
    //                         <PhoneInputField
    //                             control={control}
    //                             name="phone"
    //                             label="Phone Number"
    //                             placeholder="Enter phone number"
    //                         />
    //                         <Button type="submit">Login</Button>
    //                     </div>
    //                 </form>
    //             </SheetContent>
    //         </Sheet>
    //     )
    // }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[450px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="bg-transparent">Vroom</DialogTitle>
                    <DialogDescription className="font-bold">
                        Let's get you logged in!
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
                    </div>
                    <div className="flex justify-center">
                        <PrimaryButton type="submit">Login</PrimaryButton>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
