"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { VehicleFormData, vehicleSchema, stepSchemas } from '@/app/schema/vehicles';
import { useForm, UseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

interface OnboardingContextType {
    currentStep: number;
    totalSteps: number;
    form: UseFormReturn<VehicleFormData>;
    nextStep: () => Promise<void>;
    prevStep: () => void;
    goToStep: (step: number) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;

    const form = useForm<VehicleFormData>({
        resolver: yupResolver(vehicleSchema),
        mode: "onChange",
        defaultValues: {
            vehicle_type: undefined,
            brand: '',
            model: '',
            year: undefined,
            fuel_type: '',
            registration_number: '',
        }
    });

    const nextStep = async () => {
        // specific validation for current step
        const schema = stepSchemas[currentStep as keyof typeof stepSchemas];
        if (schema) {
            // Validate only fields for this step
            const fields = Object.keys(schema.fields) as Array<keyof VehicleFormData>;
            const valid = await form.trigger(fields);

            if (valid) {
                if (currentStep < totalSteps) {
                    setCurrentStep((prev) => prev + 1);
                }
            }
        } else {
            // Fallback
            if (currentStep < totalSteps) {
                setCurrentStep((prev) => prev + 1);
            }
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const goToStep = (step: number) => {
        if (step >= 1 && step <= totalSteps) {
            setCurrentStep(step);
        }
    };

    return (
        <OnboardingContext.Provider
            value={{
                currentStep,
                totalSteps,
                form,
                nextStep,
                prevStep,
                goToStep,
            }}
        >
            {children}
        </OnboardingContext.Provider>
    );
};

export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (context === undefined) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
};
