import { baseApi } from '../store/api/baseApi';

export interface HealthMetric {
    value: string | number;
    status: 'optimal' | 'healthy' | 'medium' | 'bad' | 'good';
    label?: string;
    subLabel?: string;
    percentage?: number;
}

export interface VehicleHealthReport {
    overall_score: number;
    overall_status: string;
    last_updated: string;
    engine: {
        temperature: HealthMetric;
        oil_level: HealthMetric;
    };
    tyres: {
        front_psi: HealthMetric;
        rear_psi: HealthMetric;
        tread_depth: HealthMetric;
    };
    braking: {
        brake_pad_wear: HealthMetric;
        brake_fluid_status: HealthMetric;
    };
    electricals: {
        battery_voltage: HealthMetric;
    };
}

export const healthApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getVehicleHealth: builder.query<VehicleHealthReport, string>({
            query: (vehicleId) => `/vehicles/${vehicleId}/health`,
            providesTags: (result, error, id) => [{ type: 'User', id: `HEALTH_${id}` }],
        }),
        calculateHealthScore: builder.mutation<VehicleHealthReport, {
            vehicle_id: string;
            kilometers_driven: number;
            last_service_date: string;
        }>({
            query: (body) => ({
                url: `/vehicles/${body.vehicle_id}/calculate-health`,
                method: 'POST',
                body,
            }),
            invalidatesTags: (result, error, { vehicle_id }) => [{ type: 'User', id: `HEALTH_${vehicle_id}` }],
        }),
    }),
});

export const { useGetVehicleHealthQuery, useCalculateHealthScoreMutation } = healthApi;
