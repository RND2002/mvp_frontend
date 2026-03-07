import { useOnboarding } from '../OnboardingContext';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Bike, Car, Truck, CarFront, Bus } from 'lucide-react';
import { VEHICLE_TYPE } from '@/app/beService/vehicle-service';

export const VehicleTypeStep = () => {
    const { form, nextStep } = useOnboarding();
    const { setValue, watch, formState: { errors } } = form;
    const vehicle_type = watch('vehicle_type');

    const handleSelect = (selectedType: VEHICLE_TYPE) => {
        setValue('vehicle_type', selectedType, { shouldValidate: true });
        // Auto advance after selection
        setTimeout(() => nextStep(), 300);
    };

    const vehicleOptions = [
        {
            id: VEHICLE_TYPE.TWO_WHEELER,
            label: "Two Wheeler",
            icon: Bike,
        },
        {
            id: VEHICLE_TYPE.THREE_WHEELER,
            label: "Three Wheeler",
            icon: Bus,
        },
        {
            id: VEHICLE_TYPE.FOUR_WHEELER,
            label: "Four Wheeler",
            icon: Car,
        },
        {
            id: VEHICLE_TYPE.XUV_SUV,
            label: "XUV / SUV",
            icon: CarFront,
        },
        {
            id: VEHICLE_TYPE.HEAVY_VEHICLE,
            label: "Heavy Vehicle",
            icon: Truck,
        }
    ];

    return (
        <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-4">What do you drive?</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
                {vehicleOptions.map((option) => (
                    <Card
                        key={option.id}
                        className={cn(
                            "cursor-pointer hover:border-green-500 transition-all p-4 flex flex-col items-center justify-center gap-3 h-32 w-full bg-white/5 border border-secondary-theme text-white hover:bg-white/10",
                            vehicle_type === option.id && "border-green-500 bg-green-500/10",
                            errors.vehicle_type && "border-red-500"
                        )}
                        onClick={() => handleSelect(option.id)}
                    >
                        <option.icon
                            size={40}
                            className={cn(
                                "transition-colors duration-200",
                                vehicle_type === option.id ? "text-green-500" : "text-gray-400 group-hover:text-green-400"
                            )}
                        />
                        <span className="font-semibold text-lg">{option.label}</span>
                    </Card>
                ))}
            </div>
            {errors.vehicle_type && (
                <p className="text-center text-red-500 text-sm mt-2">
                    {errors.vehicle_type.message as string}
                </p>
            )}
        </div>
    );
};
