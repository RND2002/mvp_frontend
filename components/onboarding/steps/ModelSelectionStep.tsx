import React, { useState } from 'react';
import { useOnboarding } from '../OnboardingContext';
import { useGetVehicleKeyDataQuery } from '@/app/beService/car-model-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export const ModelSelectionStep = () => {
    const { form, nextStep } = useOnboarding();
    const { setValue, watch, formState: { errors } } = form;
    const brand = watch('brand');
    const selectedModel = watch('model'); // This holds the ID

    const [search, setSearch] = useState('');

    const { data, isLoading, isError } = useGetVehicleKeyDataQuery(
        { type: 'model', brand: brand },
        { skip: !brand }
    );

    const models = data?.models || [];

    const filteredModels = models.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (modelId: string, modelName: string) => {
        setValue('vehicle_model_id', modelId);
        setValue('model', modelName, { shouldValidate: true });

        // Find the selected model to pre-fill other fields
        const model = models.find(m => m.id === modelId);
        if (model) {
            if (model.year) {
                setValue('year', model.year);
            }
            if (model.fuel_type) {
                setValue('fuel_type', model.fuel_type);
            }
        }

        nextStep();
    };

    return (
        <div className="flex flex-col gap-4 w-full h-full">
            {errors.model && (
                <div className="text-red-500 text-sm font-semibold">{errors.model.message}</div>
            )}
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Select Model</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search models..."
                        className="pl-9 bg-[#F8F9FB] border-[#E4E7EC] text-white placeholder:text-[#475569]"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <ScrollArea className={cn("flex-1 min-h-0 border border-[#E4E7EC] rounded-md p-2", errors.model && "border-red-500")}>
                {isLoading ? (
                    <div className="flex items-center justify-center h-full p-4">
                        <Loader2 className="w-6 h-6 animate-spin text-green-500" />
                        <span className="ml-2 text-muted-foreground">Loading models...</span>
                    </div>
                ) : isError ? (
                    <div className="flex items-center justify-center h-full p-4 text-red-400">
                        Failed to load models. Please try again.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {filteredModels.map((model) => (
                            <Button
                                key={model.id}
                                variant="outline"
                                className={`h-16 justify-start px-4 bg-[#F8F9FB] border-[#E4E7EC] text-white hover:bg-[#F5EDFC] hover:border-green-500 hover:text-white ${selectedModel === model.name ? 'border-green-500 bg-green-500/10' : ''}`}
                                onClick={() => handleSelect(model.id, model.name)}
                            >
                                <div className="flex flex-col items-start">
                                    <span className="text-base font-medium">{model.name}</span>
                                    {(model.year || model.fuel_type) && (
                                        <span className="text-xs text-muted-foreground">
                                            {model.year} {model.fuel_type && `• ${model.fuel_type}`}
                                        </span>
                                    )}
                                </div>
                            </Button>
                        ))}
                        {filteredModels.length === 0 && (
                            <div className="col-span-full text-center text-muted-foreground p-4">
                                No models found.
                            </div>
                        )}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
};
