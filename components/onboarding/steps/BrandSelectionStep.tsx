import React, { useEffect, useState } from 'react';
import { useOnboarding } from '../OnboardingContext';
import { getBrands } from '@/services/vehicle-data/brandService';
import { Brand } from '@/services/vehicle-data/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export const BrandSelectionStep = () => {
    const { form, nextStep } = useOnboarding();
    const { setValue, watch, formState: { errors } } = form;
    const type = watch('type');
    const selectedBrand = watch('brand');

    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchBrands = async () => {
            if (type) {
                setLoading(true);
                const data = await getBrands(type);
                setBrands(data);
                setLoading(false);
            }
        };
        fetchBrands();
    }, [type]);

    const filteredBrands = brands.filter(b =>
        b.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (brand: string) => {
        setValue('brand', brand, { shouldValidate: true });
        nextStep();
    };

    return (
        <div className="flex flex-col gap-4 w-full h-full max-h-[600px]">
            {errors.brand && (
                <div className="text-red-500 text-sm font-semibold">{errors.brand.message}</div>
            )}
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Select Brand</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search brands..."
                        className="pl-9 bg-vehicle-card-bg border-vehicle-card-border text-white placeholder:text-gray-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <ScrollArea className={cn("flex-1 h-[300px] border border-vehicle-card-border rounded-md p-2", errors.brand && "border-red-500")}>
                {loading ? (
                    <div className="flex items-center justify-center h-full p-4">Loading brands...</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {filteredBrands.map((brand) => (
                            <Button
                                key={brand.id}
                                variant="outline"
                                className={`h-24 flex flex-col gap-2 bg-vehicle-card-bg border-vehicle-card-border text-white hover:bg-vehicle-card-bg/80 hover:border-green-500 hover:text-white ${selectedBrand === brand.id ? 'border-green-500 bg-vehicle-card-bg' : ''}`}
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
                                <span className="text-sm font-medium text-wrap text-center">{brand.name}</span>
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
