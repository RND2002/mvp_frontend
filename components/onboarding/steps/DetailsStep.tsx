import React from 'react';
import { useOnboarding } from '../OnboardingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getManufacturingYears } from '@/services/vehicle-data/years';

const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
const YEARS = getManufacturingYears();

import { Controller } from 'react-hook-form';
import { cn } from '@/lib/utils';

const SERVICE_TYPES = [
    { value: 'full_service', label: 'Full Service' },
    { value: 'oil_change', label: 'Oil Change' },
    { value: 'general_checkup', label: 'General Checkup' },
];

const PURCHASE_TYPES = [
    { value: 'new', label: 'New' },
    { value: 'used', label: 'Used' },
];

const KNOWN_ISSUES = [
    { value: 'brake_noise', label: 'Brake noise' },
    { value: 'engine_noise', label: 'Engine noise' },
    { value: 'battery_issue', label: 'Battery issue' },
    { value: 'tyre_wear', label: 'Tyre wear' },
];

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
                            <ScrollArea className={cn("h-[144px] w-full border border-[#E4E7EC] rounded-md p-2", errors.year && "border-red-500")}>
                                <div className="grid grid-cols-4 gap-2">
                                    {YEARS.map((year) => (
                                        <Button
                                            key={year}
                                            type="button"
                                            variant="outline"
                                            onClick={() => field.onChange(year)}
                                            className={`h-9 px-2 text-xs ${field.value == year ? "bg-green-500 border-green-500 text-white hover:bg-green-600" : "bg-[#F8F9FB] border-[#E4E7EC] text-white hover:bg-[#F5EDFC]"}`}
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
                                {FUEL_TYPES.map((fuel) => {
                                    const value = fuel.toLowerCase();
                                    return (
                                    <Button
                                        key={fuel}
                                        type="button"
                                        variant="outline"
                                        className={`h-9 px-3 ${field.value === value ? "bg-green-500 border-green-500 text-white hover:bg-green-600" : "bg-[#F8F9FB] border-[#E4E7EC] text-white hover:bg-[#F5EDFC]"}`}
                                        onClick={() => field.onChange(value)}
                                    >
                                        {fuel}
                                    </Button>
                                )})}
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
                                    "bg-[#F8F9FB] border-[#E4E7EC] text-white placeholder:text-[#475569]",
                                    errors.registration_number && "border-red-500 focus-visible:ring-red-500/50"
                                )}
                                placeholder="e.g. MH 02 AB 1234"
                                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                            />
                        )}
                    />
                    {errors.registration_number && <p className="text-red-500 text-xs">{errors.registration_number.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Current Odometer</label>
                        <Controller
                            control={control}
                            name="odometer_reading"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    value={field.value || ''}
                                    type="number"
                                    className="bg-[#F8F9FB] border-[#E4E7EC] text-white placeholder:text-[#475569]"
                                    placeholder="18450"
                                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                />
                            )}
                        />
                        {errors.odometer_reading && <p className="text-red-500 text-xs">{errors.odometer_reading.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Last Service Date</label>
                        <Controller
                            control={control}
                            name="baseline_last_service_date"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    value={field.value || ''}
                                    type="date"
                                    className="bg-[#F8F9FB] border-[#E4E7EC] text-white"
                                />
                            )}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Last Service Odometer</label>
                        <Controller
                            control={control}
                            name="baseline_odometer_reading"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    value={field.value || ''}
                                    type="number"
                                    className="bg-[#F8F9FB] border-[#E4E7EC] text-white placeholder:text-[#475569]"
                                    placeholder="16000"
                                    onChange={(e) => {
                                        const value = e.target.value ? Number(e.target.value) : undefined;
                                        field.onChange(value);
                                        form.setValue('last_service_odometer', value);
                                    }}
                                />
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Last Service Type</label>
                        <Controller
                            control={control}
                            name="last_service_type"
                            render={({ field }) => (
                                <div className="flex flex-wrap gap-2">
                                    {SERVICE_TYPES.map((type) => (
                                        <Button
                                            key={type.value}
                                            type="button"
                                            variant="outline"
                                            className={`h-9 px-3 ${field.value === type.value ? "bg-green-500 border-green-500 text-white hover:bg-green-600" : "bg-[#F8F9FB] border-[#E4E7EC] text-white hover:bg-[#F5EDFC]"}`}
                                            onClick={() => field.onChange(type.value)}
                                        >
                                            {type.label}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Purchase Type</label>
                    <Controller
                        control={control}
                        name="purchase_type"
                        render={({ field }) => (
                            <div className="flex flex-wrap gap-2">
                                {PURCHASE_TYPES.map((type) => (
                                    <Button
                                        key={type.value}
                                        type="button"
                                        variant="outline"
                                        className={`h-9 px-4 ${field.value === type.value ? "bg-green-500 border-green-500 text-white hover:bg-green-600" : "bg-[#F8F9FB] border-[#E4E7EC] text-white hover:bg-[#F5EDFC]"}`}
                                        onClick={() => field.onChange(type.value)}
                                    >
                                        {type.label}
                                    </Button>
                                ))}
                            </div>
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Known Issues</label>
                    <Controller
                        control={control}
                        name="known_issues"
                        render={({ field }) => {
                            const selected = field.value || [];
                            return (
                                <div className="flex flex-wrap gap-2">
                                    {KNOWN_ISSUES.map((issue) => {
                                        const isActive = selected.includes(issue.value);
                                        return (
                                            <Button
                                                key={issue.value}
                                                type="button"
                                                variant="outline"
                                                className={`h-9 px-3 ${isActive ? "bg-green-500 border-green-500 text-white hover:bg-green-600" : "bg-[#F8F9FB] border-[#E4E7EC] text-white hover:bg-[#F5EDFC]"}`}
                                                onClick={() => field.onChange(isActive ? selected.filter((value: string) => value !== issue.value) : [...selected, issue.value])}
                                            >
                                                {issue.label}
                                            </Button>
                                        );
                                    })}
                                </div>
                            );
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
