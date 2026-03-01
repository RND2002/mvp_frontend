"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { useDispatch, useSelector } from "react-redux"
import { logout, User } from "@/app/store/slices/authSlice"
import { selectVehicle } from "@/app/store/slices/vehicleSlice"
import { RootState } from "@/app/store/store"
import { useLogoutMutation } from "@/app/beService/auth-service"
import { useRouter } from "next/navigation"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Loader } from "@/components/ui/loader"
import { LogOut, User as UserIcon, ArrowLeft } from "lucide-react"
import { AddVehicleButton } from "@/app/components/Vehicle/AddVehicleButton"
import { VehicleCard } from "@/app/components/Vehicle/VehicleCard"

interface ProfileSettingsDialogProps {
    open: boolean
    setOpen: (open: boolean) => void
    user: User | null
}

export default function ProfileSettingsDialog({ open, setOpen, user }: ProfileSettingsDialogProps) {
    const dispatch = useDispatch()
    const router = useRouter()
    const [logoutApi, { isLoading }] = useLogoutMutation()
    const { vehicles, selectedVehicle } = useSelector((state: RootState) => state.vehicle)
    const [isRedirecting, setIsRedirecting] = React.useState(false)

    const handleSelectVehicle = (id: string) => {
        dispatch(selectVehicle(id))
        setIsRedirecting(true)
        setTimeout(() => {
            setOpen(false)
            router.push('/dashboard')
            setIsRedirecting(false)
        }, 1000)
    }

    const handleLogout = async () => {
        try {
            await logoutApi().unwrap()
            dispatch(logout())
            setOpen(false)
            router.push('/')
            router.refresh()
        } catch (error) {
            console.error('Logout failed:', error)
            // Still logout locally if API fails to ensure user isn't stuck
            dispatch(logout())
            setOpen(false)
            router.push('/')
            router.refresh()
        }
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
            {isRedirecting && <Loader fullScreen text="Switching vehicle..." />}
            <SheetContent side="right" className="w-full sm:max-w-[400px] bg-vehicle-card-bg border-l border-vehicle-card-bg text-white p-0">
                <SheetHeader className="p-4 sm:p-6 border-b border-vehicle-card-bg flex flex-row items-center gap-4 space-y-0">
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
                            <UserIcon className="w-5 h-5 text-green-500" />
                            Account Settings
                        </SheetTitle>
                        <SheetDescription className="text-gray-400 text-left">
                            Manage your account
                        </SheetDescription>
                    </div>
                </SheetHeader>

                <div className="p-6 space-y-6">
                    {/* User Info */}
                    <div className="flex flex-col space-y-2 bg-vehicle-card-bg/50 p-4 rounded-lg border border-vehicle-card-border/50">
                        <span className="text-sm text-gray-400 font-medium">
                            {user?.email ? "Email Address" : "Phone Number"}
                        </span>
                        <span className="text-lg font-semibold text-white tracking-wide">
                            {user?.email || user?.phone || "N/A"}
                        </span>
                    </div>

                    {/* Vehicle List */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white">My Vehicles</h3>
                            <AddVehicleButton
                                onClick={() => {
                                    setOpen(false);
                                    router.push('/dashboard?onboarding=true');
                                }}
                            />
                        </div>

                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                            {vehicles.map((vehicle) => (
                                <VehicleCard
                                    key={vehicle.id}
                                    vehicle={vehicle}
                                    isSelected={selectedVehicle?.id === vehicle.id}
                                    onSelect={handleSelectVehicle}
                                />
                            ))}
                            {vehicles.length === 0 && (
                                <div className="text-center py-8 text-gray-500 text-sm bg-vehicle-card-bg/20 rounded-lg border border-dashed border-vehicle-card-border/30">
                                    No vehicles added yet.
                                </div>
                            )}
                        </div>
                    </div>

                    <Button
                        onClick={handleLogout}
                        loading={isLoading}
                        loadingText="Logging Out..."
                        className="w-full py-3"
                    >
                        <LogOut className="w-4 h-4" />
                        Log Out
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}
