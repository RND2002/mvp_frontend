import React, { useState } from 'react';
import { useOnboarding } from '../OnboardingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getManufacturingYears } from '@/services/vehicle-data/years';

const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
const YEARS = getManufacturingYears();

import { Controller } from 'react-hook-form';
import { cn } from '@/lib/utils';

export const DetailsStep = () => {
    const { form } = useOnboarding();
    const { control, formState: { errors } } = form;

    return (
        <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold">Vehicle Details</h2>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-300">
                        Manufacturing Year
                    </label>
                    <Controller
                        control={control}
                        name="year"
                        render={({ field }) => (
                            <ScrollArea className={cn("h-[144px] w-full border border-secondary-theme rounded-md p-2", errors.year && "border-red-500")}>
                                <div className="grid grid-cols-4 gap-2">
                                    {YEARS.map((year) => (
                                        <Button
                                            key={year}
                                            type="button"
                                            variant="outline"
                                            onClick={() => field.onChange(year)}
                                            className={`h-9 px-2 text-xs ${field.value == year ? "bg-green-500 border-green-500 text-white hover:bg-green-600" : "bg-white/5 border-secondary-theme text-white hover:bg-white/10"}`}
                                        >
                                            {year}
                                        </Button>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                    />
                    {errors.year && <p className="text-red-500 text-xs">{errors.year.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-300">
                        Fuel Type
                    </label>
                    <Controller
                        control={control}
                        name="fuel_type"
                        render={({ field }) => (
                            <div className="flex flex-wrap gap-2">
                                {FUEL_TYPES.map((fuel) => (
                                    <Button
                                        key={fuel}
                                        type="button"
                                        variant="outline"
                                        className={`h-9 px-3 ${field.value === fuel ? "bg-green-500 border-green-500 text-white hover:bg-green-600" : "bg-white/5 border-secondary-theme text-white hover:bg-white/10"}`}
                                        onClick={() => field.onChange(fuel)}
                                    >
                                        {fuel}
                                    </Button>
                                ))}
                            </div>
                        )}
                    />
                    {errors.fuel_type && <p className="text-red-500 text-xs">{errors.fuel_type.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-300">
                        Registration Number
                    </label>
                    <Controller
                        control={control}
                        name="registration_number"
                        render={({ field }) => (
                            <Input
                                {...field}
                                value={field.value || ''}
                                className={cn(
                                    "bg-white/5 border-secondary-theme text-white placeholder:text-gray-500",
                                    errors.registration_number && "border-red-500 focus-visible:ring-red-500/50"
                                )}
                                placeholder="e.g. MH 02 AB 1234"
                                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                            />
                        )}
                    />
                    {errors.registration_number && <p className="text-red-500 text-xs">{errors.registration_number.message}</p>}
                </div>
            </div>
        </div>
    );
};
