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
        // Set both ID and Name if needed. The backend expects model name in 'model' field historically?
        // Wait, the new requirement is to save `vehicle_model_id`.
        // I will set `vehicle_model_id` to the UUID.
        // And I should probably keep `model` as the name for display or backward compatibility until migration is full.
        // But the previous code was: setValue('model', modelId). 
        // If `model` field is used for display in next steps, it might break if it's an ID.
        // Let's check `DetailsStep.tsx` or `VehicleOnboardingWizard` later.
        // For now, I will set `vehicle_model_id` and `model` (as name) to be safe?
        // Or assume `model` field in form currently holds the name?
        // In previous `getModels` implementation: `id: name, name: name`. So `model` form field held the NAME.
        // Now `id` is UUID.
        // So I should set `vehicle_model_id` = modelId.
        // AND `model` = modelName.

        setValue('vehicle_model_id', modelId);
        setValue('model', modelName, { shouldValidate: true });
        nextStep();
    };

    return (
        <div className="flex flex-col gap-4 w-full h-full max-h-[600px]">
            {errors.model && (
                <div className="text-red-500 text-sm font-semibold">{errors.model.message}</div>
            )}
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Select Model</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search models..."
                        className="pl-9 bg-vehicle-card-bg border-vehicle-card-border text-white placeholder:text-gray-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <ScrollArea className={cn("flex-1 min-h-0 border border-vehicle-card-border rounded-md p-2", errors.model && "border-red-500")}>
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
                                className={`h-16 justify-start px-4 bg-vehicle-card-bg border-vehicle-card-border text-white hover:bg-vehicle-card-bg/80 hover:border-green-500 hover:text-white ${selectedModel === model.name ? 'border-green-500 bg-vehicle-card-bg' : ''}`}
                                onClick={() => handleSelect(model.id, model.name)}
                            >
                                <span className="text-base font-medium">{model.name}</span>
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
