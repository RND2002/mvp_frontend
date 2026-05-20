import React, { useState } from 'react';
import { useOnboarding } from '../OnboardingContext';
import { useGetVehicleKeyDataQuery } from '@/app/beService/car-model-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export const BrandSelectionStep = () => {
    const { form, nextStep } = useOnboarding();
    const { setValue, watch, formState: { errors } } = form;
    const type = watch('vehicle_type');
    const selectedBrand = watch('brand');

    const [search, setSearch] = useState('');

    const { data, isLoading, isError } = useGetVehicleKeyDataQuery(
        { type: 'brand', vehicle_type: type },
        { skip: !type }
    );

    const brands = data?.brands || [];

    const filteredBrands = brands.filter(b =>
        b.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (brand: string) => {
        setValue('brand', brand, { shouldValidate: true });
        nextStep();
    };

    return (
        <div className="flex flex-col gap-4 w-full h-full">
            {errors.brand && (
                <div className="text-red-500 text-sm font-semibold">{errors.brand.message}</div>
            )}
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Select Brand</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search brands..."
                        className="pl-9 bg-[#F8F9FB] border-[#E4E7EC] text-white placeholder:text-[#475569]"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <ScrollArea className={cn("flex-1 min-h-0 border border-[#E4E7EC] rounded-md p-2", errors.brand && "border-red-500")}>
                {isLoading ? (
                    <div className="flex items-center justify-center h-full p-4">
                        <Loader2 className="w-6 h-6 animate-spin text-green-500" />
                        <span className="ml-2 text-muted-foreground">Loading brands...</span>
                    </div>
                ) : isError ? (
                    <div className="flex items-center justify-center h-full p-4 text-red-400">
                        Failed to load brands. Please try again.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {filteredBrands.map((brand) => (
                            <Button
                                key={brand.id}
                                variant="outline"
                                className={`h-24 flex flex-col gap-2 bg-[#F8F9FB] border-[#E4E7EC] text-white hover:bg-[#F5EDFC] hover:border-green-500 hover:text-white ${selectedBrand === brand.id ? 'border-green-500 bg-green-500/10' : ''}`}
                                onClick={() => handleSelect(brand.id)}
                            >
                                {brand.logoUrl && (
                                    <img
                                        src={brand.logoUrl}
                                        alt={`${brand.name} logo`}
                                        className="h-8 w-auto object-contain mb-1"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                )}
                                <span className="text-sm font-medium text-wrap text-center capitalize">{brand.name}</span>
                            </Button>
                        ))}
                        {filteredBrands.length === 0 && (
                            <div className="col-span-full text-center text-muted-foreground p-4">
                                No brands found.
                            </div>
                        )}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
};
