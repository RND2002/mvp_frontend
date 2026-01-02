import { SVGProps } from "react";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export type IconProps = SVGProps<SVGSVGElement> & {
    width?: number | string;
    height?: number | string;
};

/* -------------------------------------------------------------------------- */
/*                                   ICONS                                    */
/* -------------------------------------------------------------------------- */

export const DoorstepIcon = ({
    width = 32,
    height = 32,
    className,
    ...props
}: IconProps) => (
    <svg viewBox="0 0 100 100" fill="#357ABD" width={width} height={height} className={`text-blue-400 ${className ?? ""}`} {...props}>
        <rect x="20" y="40" width="60" height="20" rx="4" fill="currentColor" />
        <circle cx="30" cy="65" r="6" fill="currentColor" />
        <circle cx="70" cy="65" r="6" fill="currentColor" />
        <path d="M50 30 L56 24 L62 30 Z" fill="currentColor" />
    </svg>
);

export const VisualizationIcon = ({
    width = 32,
    height = 32,
    className,
    ...props
}: IconProps) => (
    <svg viewBox="0 0 100 100" width={width} height={height} className={`text-red-400 ${className ?? ""}`} {...props}>
        <path d="M30 45 L50 30 L70 45 L70 65 L50 80 L30 65 Z" fill="none" stroke="currentColor" strokeWidth="4" />
        <path d="M30 45 L50 55 L70 45 M50 55 L50 80" stroke="currentColor" strokeWidth="3" />
    </svg>
);

export const TrackingIcon = ({
    width = 32,
    height = 32,
    className,
    ...props
}: IconProps) => (
    <svg viewBox="0 0 100 100" width={width} height={height} className={`text-emerald-400 ${className ?? ""}`} {...props}>
        <circle cx="50" cy="50" r="6" fill="currentColor" />
        <circle cx="50" cy="50" r="15" stroke="currentColor" fill="none" />
        <circle cx="50" cy="50" r="25" stroke="currentColor" fill="none" opacity="0.4" />
    </svg>
);

export const MechanicsIcon = ({
    width = 32,
    height = 32,
    className,
    ...props
}: IconProps) => (
    <svg viewBox="0 0 100 100" width={width} height={height} className={`text-yellow-400 ${className ?? ""}`} {...props}>
        <path d="M30 55 H70 V35 Q70 25 50 25 Q30 25 30 35 Z" fill="currentColor" />
        <polygon points="50,70 55,80 65,82 58,88 60,98 50,92 40,98 42,88 35,82 45,80" fill="currentColor" />
    </svg>
);

export const PricingIcon = ({
    width = 32,
    height = 32,
    className,
    ...props
}: IconProps) => (
    <svg viewBox="0 0 100 100" width={width} height={height} className={`text-blue-400 ${className ?? ""}`} {...props}>
        <rect x="30" y="30" width="40" height="40" rx="5" stroke="currentColor" fill="none" strokeWidth="3" />
        <line x1="35" y1="45" x2="65" y2="45" stroke="currentColor" strokeWidth="3" />
        <line x1="35" y1="55" x2="55" y2="55" stroke="currentColor" strokeWidth="2" />
    </svg>
);

export const PartsIcon = ({
    width = 32,
    height = 32,
    className,
    ...props
}: IconProps) => (
    <svg viewBox="0 0 100 100" width={width} height={height} className={`text-red-400 ${className ?? ""}`} {...props}>
        <rect x="30" y="30" width="40" height="30" rx="4" stroke="currentColor" fill="none" strokeWidth="3" />
        <rect x="42" y="38" width="16" height="10" rx="2" fill="currentColor" />
        <circle cx="42" cy="58" r="3" fill="currentColor" />
        <circle cx="58" cy="58" r="3" fill="currentColor" />
    </svg>
);

export const EmergencyIcon = ({
    width = 32,
    height = 32,
    className,
    ...props
}: IconProps) => (
    <svg viewBox="0 0 100 100" width={width} height={height} className={`text-red-400 ${className ?? ""}`} {...props}>
        <circle cx="50" cy="50" r="22" fill="currentColor" />
        <rect x="47" y="38" width="6" height="16" rx="2" fill="white" />
        <circle cx="50" cy="60" r="3" fill="white" />
    </svg>
);

export const GuaranteeIcon = ({
    width = 32,
    height = 32,
    className,
    ...props
}: IconProps) => (
    <svg viewBox="0 0 100 100" width={width} height={height} className={`text-emerald-400 ${className ?? ""}`} {...props}>
        <path d="M50 25 L30 38 V55 Q30 70 50 75 Q70 70 70 55 V38 Z" fill="currentColor" />
        <path d="M42 50 L48 56 L60 42" stroke="white" strokeWidth="4" fill="none" />
    </svg>
);

export const BookingIcon = ({
    width = 32,
    height = 32,
    className,
    ...props
}: IconProps) => (
    <svg viewBox="0 0 100 100" width={width} height={height} className={`text-blue-400 ${className ?? ""}`} {...props}>
        <rect x="30" y="28" width="40" height="44" rx="5" stroke="currentColor" fill="none" strokeWidth="3" />
        <line x1="35" y1="40" x2="65" y2="40" stroke="currentColor" strokeWidth="3" />
        <line x1="35" y1="50" x2="65" y2="50" stroke="currentColor" strokeWidth="3" />
        <line x1="35" y1="60" x2="55" y2="60" stroke="currentColor" strokeWidth="3" />
    </svg>
);

export const ModificationIcon = ({
    width = 32,
    height = 32,
    className,
    ...props
}: IconProps) => (
    <svg viewBox="0 0 100 100" width={width} height={height} className={`text-yellow-400 ${className ?? ""}`} {...props}>
        <path d="M30 60 L45 35 L50 42 L55 35 L70 60 Z" fill="currentColor" />
        <polygon points="48,50 50,47 52,50 51,53 49,53" fill="white" />
    </svg>
);

export const ReportsIcon = ({
    width = 32,
    height = 32,
    className,
    ...props
}: IconProps) => (
    <svg viewBox="0 0 100 100" width={width} height={height} className={`text-blue-400 ${className ?? ""}`} {...props}>
        <rect x="32" y="25" width="36" height="50" rx="5" stroke="currentColor" fill="none" strokeWidth="3" />
        <line x1="38" y1="38" x2="62" y2="38" stroke="currentColor" strokeWidth="3" />
        <line x1="38" y1="48" x2="58" y2="48" stroke="currentColor" strokeWidth="2" />
        <line x1="38" y1="58" x2="62" y2="58" stroke="currentColor" strokeWidth="2" />
    </svg>
);

export const MembershipIcon = ({
    width = 32,
    height = 32,
    className,
    ...props
}: IconProps) => (
    <svg viewBox="0 0 100 100" width={width} height={height} className={`text-yellow-400 ${className ?? ""}`} {...props}>
        <rect x="28" y="35" width="44" height="28" rx="5" stroke="currentColor" fill="none" strokeWidth="3" />
        <circle cx="50" cy="49" r="6" fill="currentColor" />
    </svg>
);
