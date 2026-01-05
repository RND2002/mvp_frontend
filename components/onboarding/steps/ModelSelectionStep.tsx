import React, { useEffect, useState } from 'react';
import { useOnboarding } from '../OnboardingContext';
import { getModels } from '@/services/vehicle-data/brandService';
import { Model } from '@/services/vehicle-data/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ModelSelectionStep = () => {
    const { form, nextStep } = useOnboarding();
    const { setValue, watch, formState: { errors } } = form;
    const brand = watch('brand');
    const selectedModel = watch('model');

    const [models, setModels] = useState<Model[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchModels = async () => {
            if (brand) {
                setLoading(true);
                const data = await getModels(brand);
                setModels(data);
                setLoading(false);
            }
        };
        fetchModels();
    }, [brand]);

    const filteredModels = models.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (model: string) => {
        setValue('model', model, { shouldValidate: true });
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
                {loading ? (
                    <div className="flex items-center justify-center h-full p-4">Loading models...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {filteredModels.map((model) => (
                            <Button
                                key={model.id}
                                variant="outline"
                                className={`h-16 justify-start px-4 bg-vehicle-card-bg border-vehicle-card-border text-white hover:bg-vehicle-card-bg/80 hover:border-green-500 hover:text-white ${selectedModel === model.id ? 'border-green-500 bg-vehicle-card-bg' : ''}`}
                                onClick={() => handleSelect(model.id)}
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
