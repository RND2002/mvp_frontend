import React from 'react';
import { useOnboarding } from './OnboardingContext';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export const OnboardingProgress = () => {
    const { currentStep, totalSteps } = useOnboarding();

    return (
        <div className="flex items-center justify-center w-full max-w-sm mx-auto mb-2">
            {Array.from({ length: totalSteps }).map((_, index) => {
                const stepNumber = index + 1;
                const isCompleted = stepNumber < currentStep;
                const isCurrent = stepNumber === currentStep;

                return (
                    <React.Fragment key={stepNumber}>
                        {/* Step Circle */}
                        <div
                            className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300",
                                isCompleted
                                    ? "bg-[#6B2FA0] border-[#6B2FA0] text-white"
                                    : isCurrent
                                        ? "border-[#6B2FA0] text-[#6B2FA0] font-bold"
                                        : "border-[#E4E7EC] text-[#94A3B8]"
                            )}
                        >
                            {isCompleted ? <Check size={16} /> : <span>{stepNumber}</span>}
                        </div>

                        {/* Connector Line */}
                        {stepNumber < totalSteps && (
                            <div
                                className={cn(
                                    "flex-1 h-0.5 mx-2 transition-all duration-300",
                                    stepNumber < currentStep ? "bg-[#6B2FA0]" : "bg-[#E4E7EC]"
                                )}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};
