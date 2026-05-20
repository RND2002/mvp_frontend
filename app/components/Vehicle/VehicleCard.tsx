import { Vehicle } from "@/app/store/slices/vehicleSlice"

interface VehicleCardProps {
    vehicle: Vehicle;
    isSelected: boolean;
    onSelect: (id: string) => void;
}

export const VehicleCard = ({ vehicle, isSelected, onSelect }: VehicleCardProps) => {
    return (
        <div
            onClick={() => onSelect(vehicle.id)}
            className={`
                relative flex items-center p-3 rounded-lg border cursor-pointer transition-all
                ${isSelected
                    ? 'bg-sky-500/10 border-sky-500/50'
                    : 'bg-white/30 border-[#E4E7EC]/30 hover:bg-white/50'}
            `}
        >
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-white">
                        {vehicle.brand?.toUpperCase()} {vehicle.model?.toUpperCase()}
                    </span>
                </div>
                <div className="text-sm text-[#475569] mt-1">
                    {vehicle.registration_number?.toUpperCase() || 'No reg. number'} • {vehicle.year}
                </div>
            </div>
            {isSelected && (
                <div className="h-4 w-4 rounded-full bg-sky-500 border-2 border-white/20 shadow-[0_0_10px_rgba(14,165,233,0.5)]" />
            )}
        </div>
    )
}
