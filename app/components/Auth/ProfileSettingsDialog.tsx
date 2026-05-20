"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { useDispatch, useSelector } from "react-redux"
import { logout, User } from "@/app/store/slices/authSlice"
import { selectVehicle, Vehicle } from "@/app/store/slices/vehicleSlice"
import { selectLocation } from "@/app/store/slices/locationSlice"
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
import { LogOut, User as UserIcon, ArrowLeft, MapPin, Plus, Trash2, Home, Briefcase, Car, Bike, Settings2, ChevronDown, ChevronUp } from "lucide-react"
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
    const { city: reduxCity } = useSelector(selectLocation)

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

    // No-op useEffect removed

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
                delivery_address: combinedAddress,
                city: reduxCity || undefined,
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
            <SheetContent side="right" className="w-full sm:max-w-[420px] bg-white border-l border-[#E4E7EC] text-[#0F172A] p-0 overflow-hidden flex flex-col">
                <SheetHeader className="p-6 border-b border-[#E4E7EC] flex flex-row items-center gap-4 space-y-0 relative z-10">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setOpen(false)}
                        className="text-[#94A3B8] hover:text-[#475569] hover:bg-[#F8F9FB] rounded-xl transition-all"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                            <SheetTitle className="text-xl font-black text-[#0F172A] uppercase tracking-tighter">
                                Settings
                            </SheetTitle>
                            <div className="w-1.5 h-1.5 rounded-full bg-[#6B2FA0]"></div>
                        </div>
                        <SheetDescription className="text-[#94A3B8] font-bold uppercase text-[9px] tracking-widest text-left">
                            Personalize your dashboard
                        </SheetDescription>
                    </div>
                </SheetHeader>

                <ScrollArea className="flex-1">
                    <div className="px-6 py-8 space-y-10 scrollbar-hide">
                        {/* User Profile Card */}
                        <div className="relative group">
                            <div className="relative flex items-center gap-5 bg-[#F8F9FB] border border-[#E4E7EC] rounded-3xl p-6">
                                <div className="w-16 h-16 bg-[#6B2FA0]/10 rounded-2xl flex items-center justify-center border border-[#6B2FA0]/20">
                                    <UserIcon className="w-8 h-8 text-[#6B2FA0]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-[#0F172A] font-black text-lg tracking-tight leading-tight">
                                        {user?.email?.split('@')[0] || user?.phone || "Guest User"}
                                    </h3>
                                    <p className="text-[#94A3B8] font-bold text-[10px] tracking-widest break-all">
                                        {user?.email || "verified member"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Premium Vehicle List */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between w-full px-1">
                                <div
                                    className="flex items-center gap-3 cursor-pointer group/header py-1"
                                    onClick={() => setIsVehiclesExpanded(!isVehiclesExpanded)}
                                >
                                    <div className="w-8 h-8 bg-[#6B2FA0]/10 rounded-xl flex items-center justify-center border border-[#6B2FA0]/20 group-hover/header:bg-[#6B2FA0]/20 transition-colors">
                                        <Car className="w-4 h-4 text-[#6B2FA0]" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-black text-[#0F172A] uppercase tracking-tighter">My Vehicles</h3>
                                        <div className="transition-transform duration-200">
                                            {isVehiclesExpanded ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                                        </div>
                                    </div>
                                </div>
                                <div className="shrink-0">
                                    <AddVehicleButton
                                        onClick={() => {
                                            setOpen(false)
                                            router.push('/dashboard?onboarding=true')
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                {(() => {
                                    if (vehicles.length === 0) return null;
                                    const itemsToDisplay = isVehiclesExpanded
                                        ? vehicles
                                        : (selectedVehicle ? [selectedVehicle] : [vehicles[0]]);

                                    return itemsToDisplay.map((vehicle) => {
                                        const isActive = selectedVehicle?.id === vehicle.id;
                                        return (
                                            <div
                                                key={vehicle.id}
                                                onClick={() => handleSelectVehicle(vehicle.id)}
                                                className={cn(
                                                    "group flex items-center p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden",
                                                    isActive
                                                        ? "bg-[#6B2FA0]/5 border-[#6B2FA0] shadow-sm"
                                                        : "bg-[#F8F9FB] border-[#E4E7EC] hover:bg-white"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0",
                                                    isActive ? "bg-[#6B2FA0] text-white" : "bg-white text-[#94A3B8] group-hover:text-[#475569] border border-[#E4E7EC]"
                                                )}>
                                                    {getVehicleIcon(vehicle.vehicle_type)}
                                                </div>
                                                <div className="ml-4 flex-1 min-w-0">
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-[#0F172A] font-black uppercase text-xs tracking-widest whitespace-normal leading-tight">
                                                            {vehicle.brand} {vehicle.model}
                                                        </span>
                                                        {isActive && (
                                                            <div className="shrink-0 h-4 px-2 flex items-center rounded-full border border-[#6B2FA0]/30 text-[#6B2FA0] text-[7px] font-black uppercase tracking-widest bg-[#6B2FA0]/5">
                                                                Active
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-[#475569] text-[9px] font-bold uppercase tracking-wider mt-0.5 whitespace-normal break-all">
                                                        {vehicle.registration_number || "PENDING REG"}
                                                    </p>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                                                    <Settings2 className="w-4 h-4 text-[#94A3B8]" />
                                                </div>
                                                {isActive && (
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#6B2FA0] rounded-full"></div>
                                                )}
                                            </div>
                                        );
                                    });
                                })()}
                                {vehicles.length === 0 && (
                                    <div className="text-center py-10 px-4 rounded-3xl border border-dashed border-[#E4E7EC] bg-[#F8F9FB]">
                                        <Car className="w-8 h-8 text-[#E4E7EC] mx-auto mb-3" />
                                        <p className="text-[#94A3B8] font-bold uppercase text-[9px] tracking-[0.2em]">Add your primary vehicle to start</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Premium Saved Locations */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between w-full px-1">
                                <div
                                    className="flex items-center gap-3 cursor-pointer group/header py-1"
                                    onClick={() => setIsLocationsExpanded(!isLocationsExpanded)}
                                >
                                    <div className="w-8 h-8 bg-[#6B2FA0]/10 rounded-xl flex items-center justify-center border border-[#6B2FA0]/20 group-hover/header:bg-[#6B2FA0]/20 transition-colors">
                                        <MapPin className="w-4 h-4 text-[#6B2FA0]" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-black text-[#0F172A] uppercase tracking-tighter">Saved Locations</h3>
                                        <div className="transition-transform duration-200">
                                            {isLocationsExpanded ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                                        </div>
                                    </div>
                                </div>
                                <div className="shrink-0">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsAddLocationOpen(true)}
                                        className="text-[10px] font-black uppercase tracking-widest border-[#E4E7EC] text-[#6B2FA0] bg-transparent h-8 rounded-lg hover:bg-[#6B2FA0] hover:text-white transition-colors"
                                    >
                                        + Add New
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {(() => {
                                    if (locations.length === 0) return null;
                                    const defaultLoc = locations.find(l => l.is_default);
                                    const itemsToDisplay = isLocationsExpanded
                                        ? locations
                                        : [defaultLoc || locations[0]];

                                    return itemsToDisplay.map((loc) => (
                                        <div
                                            key={loc.id}
                                            className="group flex items-center p-4 rounded-2xl bg-[#F8F9FB] border border-[#E4E7EC] hover:bg-white transition-all"
                                        >
                                            <div className="w-10 h-10 bg-white text-[#94A3B8] group-hover:text-[#6B2FA0] border border-[#E4E7EC] rounded-xl flex items-center justify-center transition-colors shrink-0">
                                                {getLocationIcon(loc.label)}
                                            </div>
                                            <div className="ml-4 flex-1 min-w-0">
                                                <div className="flex items-start gap-2">
                                                    <span className="text-[#0F172A] font-black uppercase text-xs tracking-widest whitespace-normal leading-tight">{loc.label}</span>
                                                    {loc.is_default && (
                                                        <div className="shrink-0 h-3.5 px-1.5 flex items-center rounded border border-[#6B2FA0]/30 text-[#6B2FA0] text-[6px] font-black uppercase tracking-widest bg-[#6B2FA0]/5">Default</div>
                                                    )}
                                                </div>
                                                <p className="text-[#475569] text-[9px] font-bold uppercase tracking-wider mt-0.5 whitespace-normal leading-relaxed">{loc.address}</p>
                                            </div>
                                            {isLocationsExpanded && (
                                                <button
                                                    onClick={() => handleDeleteLocation(loc.id)}
                                                    className="shrink-0 w-8 h-8 rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white flex items-center justify-center ml-2"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ));
                                })()}
                                {locations.length === 0 && (
                                    <div className="text-center py-10 rounded-3xl border border-dashed border-[#E4E7EC] bg-[#F8F9FB]">
                                        <MapPin className="w-8 h-8 text-[#E4E7EC] mx-auto mb-3" />
                                        <p className="text-[#94A3B8] font-bold uppercase text-[9px] tracking-[0.2em]">Quick access addresses will appear here</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <Dialog open={isAddLocationOpen} onOpenChange={setIsAddLocationOpen}>
                    <DialogContent className="bg-white border border-[#E4E7EC] text-[#0F172A] rounded-4xl p-8 max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Add Location</DialogTitle>
                            <DialogDescription className="text-[#94A3B8] font-bold uppercase text-[10px] tracking-widest">
                                Save a new address for faster bookings
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 mt-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-[#475569] uppercase tracking-widest px-1">Label</Label>
                                <div className="flex gap-2">
                                    {["Home", "Work", "Other"].map(l => (
                                        <button
                                            key={l}
                                            onClick={() => setNewLoc(prev => ({ ...prev, label: l }))}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex-1",
                                                newLoc.label === l ? "bg-[#6B2FA0] border-[#6B2FA0] text-white" : "bg-white border-[#E4E7EC] text-[#94A3B8] hover:text-[#475569]"
                                            )}
                                        >
                                            {l}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-[#475569] uppercase tracking-widest px-1">House / Flat No.</Label>
                                    <Input
                                        className="h-12 bg-white border border-[#E4E7EC] text-[#0F172A] placeholder:text-[#94A3B8] rounded-xl focus-visible:ring-[#6B2FA0]/30 focus-visible:border-[#6B2FA0]"
                                        value={newLoc.houseNo}
                                        onChange={e => setNewLoc(prev => ({ ...prev, houseNo: e.target.value }))}
                                        placeholder="e.g. 101"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-[#475569] uppercase tracking-widest px-1">Building/Area</Label>
                                    <Input
                                        className="h-12 bg-white border border-[#E4E7EC] text-[#0F172A] placeholder:text-[#94A3B8] rounded-xl focus-visible:ring-[#6B2FA0]/30 focus-visible:border-[#6B2FA0]"
                                        value={newLoc.building}
                                        onChange={e => setNewLoc(prev => ({ ...prev, building: e.target.value }))}
                                        placeholder="e.g. Skyline"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-[#475569] uppercase tracking-widest px-1">Landmark (Optional)</Label>
                                <Input
                                    className="h-12 bg-white border border-[#E4E7EC] text-[#0F172A] placeholder:text-[#94A3B8] rounded-xl focus-visible:ring-[#6B2FA0]/30 focus-visible:border-[#6B2FA0]"
                                    value={newLoc.landmark}
                                    onChange={e => setNewLoc(prev => ({ ...prev, landmark: e.target.value }))}
                                    placeholder="e.g. Near Mall"
                                />
                            </div>

                            <div className="p-4 rounded-xl bg-[#F8F9FB] border border-[#E4E7EC] flex items-center gap-3">
                                <div className={cn("w-2 h-2 rounded-full", geo.loaded ? "bg-[#6B2FA0] animate-pulse" : "bg-[#94A3B8]")}></div>
                                <p className="text-[8px] font-black text-[#94A3B8] uppercase tracking-widest">
                                    {geo.loaded ? "GPS COORDINATES CAPTURED" : "DETECTING GPS LOCATION..."}
                                </p>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsAddLocationOpen(false)}
                                    className="flex-1 rounded-xl text-[#94A3B8] hover:text-[#475569] uppercase font-black text-xs"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSaveLocation}
                                    disabled={isCreatingLocation || !geo.loaded}
                                    className="flex-1 bg-[#6B2FA0] hover:bg-[#6B2FA0] text-white rounded-xl uppercase font-black text-xs shadow-none border-0"
                                >
                                    {isCreatingLocation ? <Loader size="sm" /> : "Save Location"}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                <div className="p-6 border-t border-[#E4E7EC] bg-[#F8F9FB] flex flex-col gap-4">
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="w-full h-14 rounded-2xl border border-[#E4E7EC] bg-white hover:bg-[#FEF2F2] hover:border-[#FCA5A5] text-[#94A3B8] hover:text-[#DC2626] font-black uppercase tracking-widest transition-all"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader size="sm" />
                                <span>Sign Out...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </div>
                        )}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}
