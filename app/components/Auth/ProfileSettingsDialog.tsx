"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { useDispatch } from "react-redux"
import { logout, User } from "@/app/store/slices/authSlice"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { LogOut, User as UserIcon, ArrowLeft } from "lucide-react"

interface ProfileSettingsDialogProps {
    open: boolean
    setOpen: (open: boolean) => void
    user: User | null
}

export default function ProfileSettingsDialog({ open, setOpen, user }: ProfileSettingsDialogProps) {
    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(logout())
        setOpen(false)
    }

    React.useEffect(() => {
        if (open) {
            // Push state when opened so back button works
            window.history.pushState({ dialog: 'profile-settings' }, '', window.location.href);

            const handlePopState = () => {
                setOpen(false);
            };

            window.addEventListener('popstate', handlePopState);

            return () => {
                window.removeEventListener('popstate', handlePopState);
            };
        }
    }, [open, setOpen]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent side="right" className="w-full sm:max-w-[400px] bg-gradient-to-br from-[#091A23] via-[#0D212C] to-[#000000] border-l border-[#163341] text-white p-0">
                <SheetHeader className="p-4 sm:p-6 border-b border-[#163341] flex flex-row items-center gap-4 space-y-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setOpen(false)}
                        className="text-gray-400 hover:text-white hover:bg-white/10 -ml-2"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <div className="flex flex-col gap-1">
                        <SheetTitle className="text-xl font-bold flex items-center gap-2 text-white">
                            <UserIcon className="w-5 h-5 text-red-500" />
                            Account Settings
                        </SheetTitle>
                        <SheetDescription className="text-gray-400 text-left">
                            Manage your account
                        </SheetDescription>
                    </div>
                </SheetHeader>

                <div className="p-6 space-y-6">
                    <div className="flex flex-col space-y-2 bg-[#163341]/50 p-4 rounded-lg border border-[#2D5A6E]/50">
                        <span className="text-sm text-gray-400 font-medium">Phone Number</span>
                        <span className="text-lg font-semibold text-white tracking-wide">
                            {user?.phone || user?.id || "N/A"}
                        </span>
                    </div>

                    <Button
                        variant="destructive"
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3"
                    >
                        <LogOut className="w-4 h-4" />
                        Log Out
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}
