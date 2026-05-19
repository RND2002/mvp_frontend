"use client"

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Gauge, Calendar as CalendarIcon, Info, Sparkles } from "lucide-react"

const today = new Date().toISOString().split("T")[0];

const schema = yup.object({
    kilometers_driven: yup.number().required("Total kilometers is required").positive("Must be positive").typeError("Must be a number"),
    last_service_date: yup.string()
        .required("Last service date is required")
        .test("not-future", "Service date cannot be in the future", (value) => {
            if (!value) return true;
            const inputDate = new Date(value);
            const todayDate = new Date();
            // Start of today to allow selecting today
            todayDate.setHours(23, 59, 59, 999);
            return inputDate <= todayDate;
        }),
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
                <h2 className="text-3xl font-bold text-text-primary mb-2">Tell us about your ride</h2>
                <p className="text-text-secondary text-sm">
                    This information helps us analyze your engine health and predict upcoming maintenance needs.
                </p>
            </div>

            <div className="space-y-4 pt-4">
                <div className="space-y-2">
                    <Label htmlFor="kilometers_driven" className="text-text-primary text-sm font-medium">
                        Total Kilometers Driven
                    </Label>
                    <div className="relative">
                        <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
                        <Input
                            id="kilometers_driven"
                            {...register("kilometers_driven")}
                            placeholder="e.g. 15,000 km"
                            className="pl-10 h-12 bg-bg-tertiary border-border-default text-text-primary placeholder:text-text-secondary"
                        />
                    </div>
                    {errors.kilometers_driven && <p className="text-red-500 text-xs">{errors.kilometers_driven.message}</p>}
                    <p className="text-[10px] text-text-secondary flex items-center gap-1">
                        <Info className="w-3 h-3" /> Check your dashboard odometer for accuracy
                     </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="last_service_date" className="text-text-primary text-sm font-medium">
                        Last Service Date
                    </Label>
                    <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
                        <Input
                            id="last_service_date"
                            type="date"
                            max={today}
                            {...register("last_service_date")}
                            className="pl-10 h-12 bg-bg-tertiary border-border-default text-text-primary placeholder:text-text-secondary"
                        />
                    </div>
                    {errors.last_service_date && <p className="text-red-500 text-xs">{errors.last_service_date.message}</p>}
                    <p className="text-[10px] text-text-secondary flex items-center gap-1">
                        <Info className="w-3 h-3" /> If unknown, estimate to the closest month
                    </p>
                </div>
            </div>

            <div className="bg-bg-secondary border border-border-default rounded-xl p-4 mt-8">
                <div className="flex gap-3">
                    <div className="bg-theme-green/20 p-2 rounded-lg h-fit">
                        <Gauge className="w-5 h-5 text-theme-green" />
                    </div>
                    <div>
                        <h4 className="text-text-primary text-sm font-bold mb-1">Why this matters?</h4>
                        <p className="text-text-secondary text-xs leading-relaxed">
                            Our AI engine uses these data points to calculate your current <span className="text-text-primary font-medium">Health Score</span> and generate a personalized maintenance blueprint.
                        </p>
                    </div>
                </div>
            </div>

            <div className="pt-8">
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-theme-green hover:bg-theme-green/90 text-black font-bold h-14 rounded-xl text-lg flex items-center justify-center gap-2"
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
