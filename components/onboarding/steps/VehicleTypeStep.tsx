import React from 'react';
import { useOnboarding } from '../OnboardingContext';
import { Card } from '@/components/ui/card'; // Assuming Card exists
import { cn } from '@/lib/utils';
import { Car, Bike } from 'lucide-react';

export const VehicleTypeStep = () => {
    const { form, nextStep } = useOnboarding();
    const { setValue, watch, formState: { errors } } = form;
    const type = watch('type');

    const handleSelect = (selectedType: 'car' | 'bike') => {
        setValue('type', selectedType, { shouldValidate: true });
        // Auto advance after selection
        setTimeout(() => nextStep(), 300);
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-center">What do you drive?</h2>
            <div className="grid grid-cols-2 gap-4">
                <Card
                    className={cn(
                        "cursor-pointer hover:border-green-500 transition-all p-6 flex flex-col items-center justify-center gap-4 h-40 bg-vehicle-card-bg border-vehicle-card-border text-white",
                        type === 'car' && "border-green-500 bg-green-500/10",
                        errors.type && "border-red-500"
                    )}
                    onClick={() => handleSelect('car')}
                >
                    <Car size={48} className={type === 'car' ? "text-green-500" : "text-gray-400"} />
                    <span className="font-semibold text-lg">Car</span>
                </Card>

                <Card
                    className={cn(
                        "cursor-pointer hover:border-green-500 transition-all p-6 flex flex-col items-center justify-center gap-4 h-40 bg-vehicle-card-bg border-vehicle-card-border text-white",
                        type === 'bike' && "border-green-500 bg-green-500/10",
                        errors.type && "border-red-500"
                    )}
                    onClick={() => handleSelect('bike')}
                >
                    <Bike size={48} className={type === 'bike' ? "text-green-500" : "text-gray-400"} />
                    <span className="font-semibold text-lg">Bike</span>
                </Card>
            </div>
            {errors.type && (
                <p className="text-center text-red-500 text-sm">{errors.type.message}</p>
            )}
        </div>
    );
};
