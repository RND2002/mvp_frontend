import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { OnboardingProvider, useOnboarding } from './OnboardingContext';
import { OnboardingProgress } from './OnboardingProgress';
import { VehicleTypeStep } from './steps/VehicleTypeStep';
import { BrandSelectionStep } from './steps/BrandSelectionStep';
import { ModelSelectionStep } from './steps/ModelSelectionStep';
import { DetailsStep } from './steps/DetailsStep';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAddVehicleMutation } from '@/app/beService/vehicle-service';
import { toast } from 'sonner';
import { vehicleSchema } from '@/app/schema/vehicles';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Loader } from '@/components/ui/loader';
import { useDispatch } from 'react-redux';
import { addVehicle as addVehicleAction, selectVehicle } from '@/app/store/slices/vehicleSlice';

const WizardContent = ({ onClose }: { onClose?: () => void }) => {
    const { currentStep, totalSteps, nextStep, prevStep, form } = useOnboarding();
    const [addVehicle, { isLoading }] = useAddVehicleMutation();
    const dispatch = useDispatch();
    const { handleSubmit } = form;
    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(false);

    const handleNext = async () => {
        await nextStep();
    };

    const handleSkip = () => {
        if (onClose) onClose();
    };

    const onSubmit = async (data: any) => {
        try {
            const result = await addVehicle(data).unwrap();

            if (result?.vehicle) {
                dispatch(addVehicleAction(result.vehicle));
                dispatch(selectVehicle(result.vehicle.id));
            }

            toast.success("Vehicle added successfully!");

            setIsRedirecting(true);
            // Small delay to show success toast before redirect
            setTimeout(() => {
                if (onClose) onClose();
                router.push('/dashboard');
            }, 1000);

        } catch (error: any) {
            console.error("Submission error", error);
            if (error.name === 'ValidationError') {
                toast.error(error.message);
            } else {
                toast.error("Failed to add vehicle. Please try again.");
            }
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1: return <VehicleTypeStep />;
            case 2: return <BrandSelectionStep />;
            case 3: return <ModelSelectionStep />;
            case 4: return <DetailsStep />;
            default: return null;
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-gradient-to-br from-[#091A23] via-[#0D212C] to-[#000000] text-white p-4 mt-12 md:p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 container mx-auto max-w-4xl">
                <Button variant="ghost" size="sm" onClick={handleSkip} className="text-muted-foreground">
                    Skip Setup
                </Button>
                <div className="text-sm font-medium text-muted-foreground">
                    Step {currentStep} of {totalSteps}
                </div>
            </div>

            <OnboardingProgress />

            {/* Step Content with Animation */}
            <div className="flex-1 overflow-hidden relative min-h-[300px] container mx-auto max-w-4xl flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="w-full"
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer Navigation */}
            <div className="container mx-auto max-w-4xl flex justify-between items-center mt-6 pt-4 border-t pb-8">
                <Button
                    variant="ghost"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={currentStep === 1 ? "invisible" : ""}
                >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back
                </Button>

                {currentStep < totalSteps ? (
                    <Button onClick={handleNext}>
                        Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                ) : (
                    <Button onClick={handleSubmit(onSubmit)} loading={isLoading} className="text-white hover:text-green-400">
                        Finish Setup
                    </Button>
                )}
            </div>
            {isRedirecting && <Loader fullScreen text="Setting up your dashboard..." />}
        </div>
    );
};

interface VehicleOnboardingWizardProps {
    open: boolean;
    onClose: () => void;
}

export const VehicleOnboardingWizard = ({ open, onClose }: VehicleOnboardingWizardProps) => {
    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="max-w-[100vw] h-[100vh] w-screen border-none shadow-none bg-gradient-to-br from-[#091A23] via-[#0D212C] to-[#000000] text-white p-0 [&>button]:hidden rounded-none flex flex-col z-[9999]">
                <OnboardingProvider>
                    <WizardContent onClose={onClose} />
                </OnboardingProvider>
            </DialogContent>
        </Dialog>
    );
};
