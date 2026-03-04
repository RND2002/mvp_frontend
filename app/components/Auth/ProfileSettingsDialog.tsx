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
import { ScrollArea } from "@/components/ui/scroll-area"
import { LogOut, User as UserIcon, ArrowLeft, MapPin, Plus, Trash2, Home, Briefcase, Car, Bike, Settings2, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { AddVehicleButton } from "@/app/components/Vehicle/AddVehicleButton"
import { VehicleCard } from "@/app/components/Vehicle/VehicleCard"
import { useGetUserLocationsQuery, useCreateUserLocationMutation, useDeleteUserLocationMutation, UserLocation } from "@/app/beService/user-location-service"
import { useGeoLocation } from "@/app/hooks/useGeoLocation"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { LocationSelector } from "@/app/components/Location/LocationSelector"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

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
    const [isVehiclesExpanded, setIsVehiclesExpanded] = React.useState(false)
    const [isLocationsExpanded, setIsLocationsExpanded] = React.useState(false)
    const [isAddLocationOpen, setIsAddLocationOpen] = React.useState(false)

    // Location management
    const { data: locationsData, isLoading: isLocationsLoading } = useGetUserLocationsQuery()
    const [createLocation, { isLoading: isCreatingLocation }] = useCreateUserLocationMutation()
    const [deleteLocation] = useDeleteUserLocationMutation()
    const locations = locationsData?.data || locationsData?.locations || []

    const geo = useGeoLocation()
    const [newLoc, setNewLoc] = React.useState({
        label: "Home",
        houseNo: "",
        building: "",
        landmark: "",
        is_default: false
    })

    React.useEffect(() => {
        if (isAddLocationOpen && !isVehiclesExpanded) {
            // No-op, just to ensure we have dependency on open state
        }
    }, [isAddLocationOpen])

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

    const handleSaveLocation = async () => {
        if (!newLoc.houseNo || !newLoc.building) {
            toast.error("House No and Building are required")
            return
        }

        if (!geo.coordinates) {
            toast.error("Waiting for GPS coordinates...")
            return
        }

        try {
            const combinedAddress = [
                newLoc.houseNo,
                newLoc.building,
                newLoc.landmark ? `(Landmark: ${newLoc.landmark})` : ""
            ].filter(Boolean).join(", ")

            await createLocation({
                label: newLoc.label,
                address: combinedAddress,
                latitude: geo.coordinates.latitude,
                longitude: geo.coordinates.longitude,
                is_default: newLoc.is_default
            }).unwrap()

            toast.success("Location added")
            setIsAddLocationOpen(false)
            setNewLoc({ label: "Home", houseNo: "", building: "", landmark: "", is_default: false })
            setIsLocationsExpanded(true)
        } catch (err) {
            toast.error("Failed to add location")
        }
    }

    const handleDeleteLocation = async (id: string) => {
        try {
            await deleteLocation(id).unwrap()
            toast.success("Location deleted successfully")
        } catch (err) {
            toast.error("Failed to delete location")
        }
    }

    const getLocationIcon = (label?: string) => {
        const l = label?.toLowerCase() || ""
        if (l.includes("home")) return <Home className="w-4 h-4" />
        if (l.includes("work") || l.includes("office")) return <Briefcase className="w-4 h-4" />
        return <MapPin className="w-4 h-4" />
    }

    const getVehicleIcon = (type?: string) => {
        if (type === "two_wheeler") return <Bike className="w-5 h-5" />
        return <Car className="w-5 h-5" />
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
            <SheetContent side="right" className="w-full sm:max-w-[420px] bg-[#020617] border-l border-white/10 text-white p-0 overflow-hidden flex flex-col">
                <SheetHeader className="p-6 border-b border-white/5 flex flex-row items-center gap-4 space-y-0 relative z-10">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setOpen(false)}
                        className="text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                            <SheetTitle className="text-xl font-black text-white uppercase tracking-tighter">
                                Settings
                            </SheetTitle>
                            <div className="w-1.5 h-1.5 rounded-full bg-theme-green"></div>
                        </div>
                        <SheetDescription className="text-gray-500 font-bold uppercase text-[9px] tracking-widest text-left">
                            Personalize your dashboard
                        </SheetDescription>
                    </div>
                </SheetHeader>

                <ScrollArea className="flex-1">
                    <div className="px-6 py-8 space-y-10 scrollbar-hide">
                        {/* User Profile Card */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-linear-to-r from-theme-green/20 to-transparent rounded-3xl blur-sm opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative flex items-center gap-5 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                                <div className="w-16 h-16 bg-theme-green/10 rounded-2xl flex items-center justify-center border border-theme-green/20">
                                    <UserIcon className="w-8 h-8 text-theme-green" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    {/* <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Authenticated Account</p> */}
                                    <h3 className="text-white font-black text-lg truncate  tracking-tight">
                                        {user?.email?.split('@')[0] || user?.phone || "Guest User"}
                                    </h3>
                                    <p className="text-gray-500 font-bold text-[10px] truncate  tracking-widest">
                                        {user?.email || "verified member"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Premium Vehicle List */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <div
                                    className="flex items-center gap-3 cursor-pointer group/header"
                                    onClick={() => setIsVehiclesExpanded(!isVehiclesExpanded)}
                                >
                                    <div className="w-8 h-8 bg-theme-green/10 rounded-xl flex items-center justify-center border border-theme-green/20">
                                        <Car className="w-4 h-4 text-theme-green" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-black text-white uppercase  tracking-tighter">My Vehicles</h3>
                                        {isVehiclesExpanded ? <ChevronUp className="w-3 h-3 text-gray-500" /> : <ChevronDown className="w-3 h-3 text-gray-500" />}
                                    </div>
                                </div>
                                <AddVehicleButton
                                    onClick={() => {
                                        setOpen(false)
                                        router.push('/dashboard?onboarding=true')
                                    }}
                                />
                            </div>

                            <div className="space-y-3">
                                {(isVehiclesExpanded ? vehicles : vehicles.filter(v => v.id === selectedVehicle?.id)).map((vehicle) => (
                                    <div
                                        key={vehicle.id}
                                        onClick={() => handleSelectVehicle(vehicle.id)}
                                        className={cn(
                                            "group flex items-center p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden",
                                            selectedVehicle?.id === vehicle.id
                                                ? "bg-theme-green/10 border-theme-green/50 shadow-[0_0_20px_rgba(34,197,94,0.1)]"
                                                : "bg-white/5 border-white/10 hover:border-white/20"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                            selectedVehicle?.id === vehicle.id ? "bg-theme-green text-black" : "bg-white/5 text-gray-400 group-hover:text-white"
                                        )}>
                                            {getVehicleIcon(vehicle.vehicle_type)}
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-white font-black uppercase text-xs tracking-widest ">{vehicle.brand} {vehicle.model}</span>
                                                {selectedVehicle?.id === vehicle.id && (
                                                    <div className="h-4 px-2 flex items-center rounded-full border border-theme-green/30 text-theme-green text-[7px] font-black uppercase tracking-widest bg-theme-green/5">Active</div>
                                                )}
                                            </div>
                                            <p className="text-gray-500 text-[9px] font-bold uppercase tracking-wider mt-0.5">{vehicle.registration_number || "PENDING REG"}</p>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Settings2 className="w-4 h-4 text-gray-600" />
                                        </div>
                                        {selectedVehicle?.id === vehicle.id && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-theme-green rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                                        )}
                                    </div>
                                ))}
                                {vehicles.length === 0 && (
                                    <div className="text-center py-10 px-4 rounded-3xl border border-dashed border-white/5 bg-white/[0.02]">
                                        <Car className="w-8 h-8 text-white/10 mx-auto mb-3" />
                                        <p className="text-gray-600 font-bold uppercase text-[9px] tracking-[0.2em]">Add your primary vehicle to start</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Premium Saved Locations */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <div
                                    className="flex items-center gap-3 cursor-pointer group/header"
                                    onClick={() => setIsLocationsExpanded(!isLocationsExpanded)}
                                >
                                    <div className="w-8 h-8 bg-theme-green/10 rounded-xl flex items-center justify-center border border-theme-green/20">
                                        <MapPin className="w-4 h-4 text-theme-green" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-black text-white uppercase  tracking-tighter">Saved Locations</h3>
                                        {isLocationsExpanded ? <ChevronUp className="w-3 h-3 text-gray-500" /> : <ChevronDown className="w-3 h-3 text-gray-500" />}
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsAddLocationOpen(true)}
                                    className="text-[10px] font-black uppercase tracking-widest border-white/10 text-theme-green bg-transparent h-8 rounded-lg"
                                >
                                    + Add New
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {(isLocationsExpanded ? locations : locations.filter(l => l.is_default).slice(0, 1)).length > 0 ? (
                                    (isLocationsExpanded ? locations : locations.filter(l => l.is_default).slice(0, 1)).map((loc) => (
                                        <div
                                            key={loc.id}
                                            className="group flex items-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                                        >
                                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-theme-green transition-colors">
                                                {getLocationIcon(loc.label)}
                                            </div>
                                            <div className="ml-4 flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white font-black uppercase text-xs tracking-widest">{loc.label}</span>
                                                    {loc.is_default && (
                                                        <div className="h-3.5 px-1.5 flex items-center rounded border border-theme-green/30 text-theme-green text-[6px] font-black uppercase tracking-widest bg-theme-green/5">Default</div>
                                                    )}
                                                </div>
                                                <p className="text-gray-500 text-[9px] font-bold uppercase tracking-wider mt-0.5 truncate">{loc.address}</p>
                                            </div>
                                            {isLocationsExpanded && (
                                                <button
                                                    onClick={() => handleDeleteLocation(loc.id)}
                                                    className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white flex items-center justify-center"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 rounded-3xl border border-dashed border-white/5 bg-white/[0.02]">
                                        <MapPin className="w-8 h-8 text-white/10 mx-auto mb-3" />
                                        <p className="text-gray-600 font-bold uppercase text-[9px] tracking-[0.2em]">Quick access addresses will appear here</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <Dialog open={isAddLocationOpen} onOpenChange={setIsAddLocationOpen}>
                    <DialogContent className="bg-[#020617] border border-white/10 text-white rounded-4xl p-8 max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black uppercase  tracking-tighter">Add Location</DialogTitle>
                            <DialogDescription className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">
                                Save a new address for faster bookings
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 mt-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Label</Label>
                                <div className="flex gap-2">
                                    {["Home", "Work", "Other"].map(l => (
                                        <button
                                            key={l}
                                            onClick={() => setNewLoc(prev => ({ ...prev, label: l }))}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex-1",
                                                newLoc.label === l ? "bg-theme-green border-theme-green text-black" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20"
                                            )}
                                        >
                                            {l}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">House / Flat No.</Label>
                                    <Input
                                        className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-theme-green/50"
                                        value={newLoc.houseNo}
                                        onChange={e => setNewLoc(prev => ({ ...prev, houseNo: e.target.value }))}
                                        placeholder="e.g. 101"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Building/Area</Label>
                                    <Input
                                        className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-theme-green/50"
                                        value={newLoc.building}
                                        onChange={e => setNewLoc(prev => ({ ...prev, building: e.target.value }))}
                                        placeholder="e.g. Skyline"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Landmark (Optional)</Label>
                                <Input
                                    className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-theme-green/50"
                                    value={newLoc.landmark}
                                    onChange={e => setNewLoc(prev => ({ ...prev, landmark: e.target.value }))}
                                    placeholder="e.g. Near Mall"
                                />
                            </div>

                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                                <div className={cn("w-2 h-2 rounded-full", geo.loaded ? "bg-theme-green animate-pulse" : "bg-gray-600")}></div>
                                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">
                                    {geo.loaded ? "GPS COORDINATES CAPTURED" : "DETECTING GPS LOCATION..."}
                                </p>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsAddLocationOpen(false)}
                                    className="flex-1 rounded-xl text-gray-500 uppercase font-black text-xs"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSaveLocation}
                                    disabled={isCreatingLocation || !geo.loaded}
                                    className="flex-1 bg-theme-green hover:bg-theme-green/90 text-black rounded-xl uppercase font-black text-xs"
                                >
                                    {isCreatingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Location"}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                <div className="p-6 border-t border-white/5 bg-white/[0.01] flex flex-col gap-4">
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="w-full h-14 rounded-2xl border border-white/5 bg-white/5 hover:bg-red-500/10 hover:border-red-500/20 text-gray-400 hover:text-red-500 font-black uppercase tracking-widest transition-all"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Sign Out...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </div>
                        )}
                    </Button>
                    {/* <p className="text-center text-gray-600 text-[8px] font-black uppercase tracking-[0.3em]">Version 2.4.0 • MVP PRO PLATFORM</p> */}
                </div>
            </SheetContent>
        </Sheet>
    )
}
