"use client"

interface HealthMetricCardProps {
    label: string;
    value: string | number;
    status?: 'optimal' | 'healthy' | 'medium' | 'bad' | 'good' | string;
    subLabel?: string;
    percentage?: number;
    showProgress?: boolean;
    color?: string;
}

export const HealthMetricCard = ({
    label,
    value,
    status,
    subLabel,
    percentage,
    showProgress = true,
    color
}: HealthMetricCardProps) => {
    const getStatusColor = (s?: string) => {
        if (color) return color;
        const statusLower = s?.toLowerCase();
        if (statusLower === 'optimal' || statusLower === 'healthy' || statusLower === 'good') return '#6B2FA0';
        if (statusLower === 'medium') return '#D97706'; // Amber-600
        if (statusLower === 'bad') return '#DC2626';
        return '#6B2FA0';
    }

    const statusColor = getStatusColor(status);

    return (
        <div className="bg-white border border-[#E4E7EC] rounded-xl p-4 mb-2 shadow-sm">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h4 className="text-[#475569] text-xs uppercase tracking-wider mb-1 font-bold">{label}</h4>
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-[#0F172A]">{value}</span>
                        {status && (
                            <span
                                className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
                                style={{ backgroundColor: `${statusColor}15`, color: statusColor }}
                            >
                                {status}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {showProgress && percentage !== undefined && (
                <div className="mt-4">
                    <div className="h-1.5 w-full bg-[#E4E7EC] rounded-full overflow-hidden">
                        <div
                            className="h-full transition-all duration-500"
                            style={{
                                width: `${percentage}%`,
                                backgroundColor: statusColor
                            }}
                        />
                    </div>
                </div>
            )}

            {subLabel && (
                <p className="text-[10px] text-[#94A3B8] mt-2 uppercase font-bold">
                    {subLabel}
                </p>
            )}
        </div>
    );
};
