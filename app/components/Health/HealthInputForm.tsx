"use client"

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Gauge, Calendar as CalendarIcon, Info, Sparkles } from "lucide-react"

const schema = yup.object({
    kilometers_driven: yup.number().required("Total kilometers is required").positive("Must be positive").typeError("Must be a number"),
    last_service_date: yup.string().required("Last service date is required"),
}).required()

interface HealthInputFormProps {
    onSubmit: (data: { kilometers_driven: number, last_service_date: string }) => void;
    isLoading?: boolean;
}

export const HealthInputForm = ({ onSubmit, isLoading }: HealthInputFormProps) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
                <h2 className="text-3xl font-bold text-white mb-2">Tell us about your ride</h2>
                <p className="text-gray-400 text-sm">
                    This information helps us analyze your engine health and predict upcoming maintenance needs.
                </p>
            </div>

            <div className="space-y-4 pt-4">
                <div className="space-y-2">
                    <Label htmlFor="kilometers_driven" className="text-gray-300 text-sm font-medium">
                        Total Kilometers Driven
                    </Label>
                    <div className="relative">
                        <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <Input
                            id="kilometers_driven"
                            {...register("kilometers_driven")}
                            placeholder="e.g. 15,000 km"
                            className="pl-10 h-12 bg-white/5 border-vehicle-card-border text-white placeholder:text-gray-500"
                        />
                    </div>
                    {errors.kilometers_driven && <p className="text-red-500 text-xs">{errors.kilometers_driven.message}</p>}
                    <p className="text-[10px] text-gray-500 flex items-center gap-1">
                        <Info className="w-3 h-3" /> Check your dashboard odometer for accuracy
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="last_service_date" className="text-gray-300 text-sm font-medium">
                        Last Service Date
                    </Label>
                    <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <Input
                            id="last_service_date"
                            type="date"
                            {...register("last_service_date")}
                            className="pl-10 h-12 bg-white/5 border-vehicle-card-border text-white placeholder:text-gray-500"
                        />
                    </div>
                    {errors.last_service_date && <p className="text-red-500 text-xs">{errors.last_service_date.message}</p>}
                    <p className="text-[10px] text-gray-500 flex items-center gap-1">
                        <Info className="w-3 h-3" /> If unknown, estimate to the closest month
                    </p>
                </div>
            </div>

            <div className="bg-vehicle-card-bg/50 border border-vehicle-card-border rounded-xl p-4 mt-8">
                <div className="flex gap-3">
                    <div className="bg-theme-green/20 p-2 rounded-lg h-fit">
                        <Gauge className="w-5 h-5 text-theme-green" />
                    </div>
                    <div>
                        <h4 className="text-white text-sm font-bold mb-1">Why this matters?</h4>
                        <p className="text-gray-400 text-xs leading-relaxed">
                            Our AI engine uses these data points to calculate your current <span className="text-white font-medium">Health Score</span> and generate a personalized maintenance blueprint.
                        </p>
                    </div>
                </div>
            </div>

            <div className="pt-8">
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-theme-green hover:bg-theme-green/90 text-white font-bold h-14 rounded-xl text-lg flex items-center justify-center gap-2"
                >
                    {isLoading ? "Calculating..." : (
                        <>
                            Calculate Health Score <Sparkles className="w-5 h-5" />
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}
