import { Button } from "@/components/ui/button"

interface AddVehicleButtonProps {
    onClick: () => void;
}

export const AddVehicleButton = ({ onClick }: AddVehicleButtonProps) => {
    return (
        <Button
            variant="outline"
            size="sm"
            onClick={onClick}
            className="text-xs border-[#E4E7EC] text-green-500 hover:text-green-400 bg-transparent"
        >
            + Add New
        </Button>
    )
}
