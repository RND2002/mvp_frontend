"use client"

import { useSelector } from "react-redux"
import { RootState } from "@/app/store/store"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"

export const VehicleHealthCard = () => {
    const { selectedVehicle } = useSelector((state: RootState) => state.vehicle)
    const [score, setScore] = useState(56)

    useEffect(() => {
        if (selectedVehicle) {
            const sum = String(selectedVehicle.id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
            const mockScore = (sum % 70) + 30
            setScore(mockScore)
        }
    }, [selectedVehicle])

    const getHealthStatus = (value: number) => {
        if (value <= 33) return { label: "Very Bad", color: "#EF4444" } // Red
        if (value <= 66) return { label: "Average", color: "#FFFFFF" } // White
        return { label: "Excellent", color: "#6B2FA0" } // Green
    }

    const status = getHealthStatus(score)
    const radius = 80
    const strokeWidth = 12
    const normalizedRadius = radius - strokeWidth * 2
    const circumference = normalizedRadius * 2 * Math.PI
    const strokeDashoffset = circumference - (score / 100) * (circumference / 2) // Half circle logic needs adjustment
    const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
        const angleInRadians = (angleInDegrees - 180) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
        const start = polarToCartesian(x, y, radius, endAngle);
        const end = polarToCartesian(x, y, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        const d = [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");
        return d;
    }

    return (
        <Card className="bg-white border-[#E4E7EC] text-white overflow-hidden relative">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-[#475569] text-sm font-medium uppercase tracking-wider">
                            Vehicle Healths
                        </h3>
                        <h2 className="text-2xl font-bold mt-1">
                            {selectedVehicle
                                ? `${selectedVehicle.brand.toUpperCase()} ${selectedVehicle.model.toUpperCase()}`
                                : "No Vehicle Selected"}
                        </h2>
                        {selectedVehicle && (
                            <p className="text-sm text-[#475569]">
                                {selectedVehicle.registration_number}
                            </p>
                        )}
                    </div>
                    <div>
                        {/* Status Badge */}
                        {selectedVehicle && (
                            <span
                                className="px-3 py-1 rounded-full text-xs font-bold border"
                                style={{
                                    borderColor: status.color,
                                    color: status.color,
                                    backgroundColor: `${status.color}15` // 10% opacity
                                }}
                            >
                                {status.label}
                            </span>
                        )}
                    </div>
                </div>

                {selectedVehicle ? (
                    <div className="flex flex-col items-center justify-center mt-2 relative">
                        {/* Gauge Container */}
                        <div className="relative w-[200px] h-[110px]">
                            {/* Background Arc */}
                            <svg width="200" height="110" viewBox="0 0 200 110">
                                <path
                                    d={describeArc(100, 100, 80, 0, 180)}
                                    fill="none"
                                    stroke="#0D212C"
                                    strokeWidth="15"
                                    strokeLinecap="round"
                                />
                                {/* Progress Arc */}
                                <path
                                    d={describeArc(100, 100, 80, 0, (score / 100) * 180)}
                                    fill="none"
                                    stroke={status.color}
                                    strokeWidth="15"
                                    strokeLinecap="round"
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>

                            {/* Score Display in Center */}
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center mb-2">
                                <span className="text-4xl font-bold block" style={{ color: status.color }}>
                                    {score}%
                                </span>
                                <span className="text-xs text-[#475569] uppercase">Health Score</span>
                            </div>
                        </div>

                        {/* Legend / Range Indicators */}
                        <div className="grid grid-cols-3 gap-2 w-full mt-4 text-center text-[10px] text-[#475569]">
                            <div className={`rounded p-1 ${score <= 33 ? 'bg-red-500/10 text-red-500 font-bold' : ''}`}>
                                0-33<br />Bad
                            </div>
                            <div className={`rounded p-1 ${score > 33 && score <= 66 ? 'bg-[#F5EDFC] text-white font-bold' : ''}`}>
                                34-66<br />Average
                            </div>
                            <div className={`rounded p-1 ${score > 66 ? 'bg-green-500/10 text-green-500 font-bold' : ''}`}>
                                67-100<br />Good
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-[150px] flex items-center justify-center text-[#475569] text-sm italic">
                        Select a vehicle to view health insights
                    </div>
                )}
            </CardContent>

            {/* Decorative decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl -ml-12 -mb-12 pointer-events-none"></div>
        </Card>
    )
}
