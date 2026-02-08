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
        if (statusLower === 'optimal' || statusLower === 'healthy' || statusLower === 'good') return 'var(--theme-green)';
        if (statusLower === 'medium') return '#EAB308'; // Yellow-500
        if (statusLower === 'bad') return 'var(--theme-red)';
        return 'var(--theme-green)';
    }

    const statusColor = getStatusColor(status);

    return (
        <div className="bg-vehicle-card-bg/80 border border-vehicle-card-border rounded-xl p-4 mb-2 backdrop-blur-sm">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h4 className="text-gray-400 text-xs uppercase tracking-wider mb-1">{label}</h4>
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold">{value}</span>
                        {status && (
                            <span
                                className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
                                style={{ backgroundColor: `${statusColor}20`, color: statusColor }}
                            >
                                {status}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {showProgress && percentage !== undefined && (
                <div className="mt-4">
                    <div className="h-1.5 w-full bg-[#1E3A4A] rounded-full overflow-hidden">
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
                <p className="text-[10px] text-gray-500 mt-2 uppercase">
                    {subLabel}
                </p>
            )}
        </div>
    );
};
