
import React from 'react';
import clsx from 'clsx';

interface AutoSliderProps {
    slides: string[];
    className?: string;
    slideClassName?: string;
    direction?: 'vertical' | 'horizontal';
    showName?: boolean;
    showNavigation?: boolean;
    showTagline?: boolean;
    slideHeight?: number;
    slideWidth?: number;
    autoSlideTime?: number;
    hideOnMobile?: boolean;
}

const AutoSlider: React.FC<AutoSliderProps> = ({ slides, className }) => {
    return (
        <div className={clsx("flex overflow-hidden h-[60px] items-center text-sm font-semibold text-gray-700", className)}>
            <div className="animate-pulse">
                {slides[0]}
            </div>
        </div>
    );
};

export default AutoSlider;
