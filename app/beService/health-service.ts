import { baseApi } from '../store/api/baseApi';

export interface HealthMetric {
    score: number;
    status: string;
    basis?: string;
}

export interface VehicleHealthReport {
    success: boolean;
    health: {
        vehicleId: string;
        overall: {
            score: number | null;
            status: string;
            confidence: string;
            source: string;
            last_service_date: string | null;
            odometer_reading: number;
            km_since_service: number;
            days_since_service: number;
            message: string | null;
        } | null;
        systems: {
            [key: string]: HealthMetric;
        } | null;
        recommendations: string[];
    };
}

export const healthApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getVehicleHealth: builder.query<VehicleHealthReport, string>({
            query: (vehicleId) => `/vehicles/${vehicleId}/health`,
            providesTags: (result, error, id) => [{ type: 'User', id: `HEALTH_${id}` }],
        }),
        updateVehicle: builder.mutation<any, {
            id: string;
            baseline_odometer_reading: number;
            baseline_last_service_date: string;
        }>({
            query: ({ id, ...body }) => ({
                url: `/vehicles/${id}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'User', id: `HEALTH_${id}` }],
        }),
    }),
});

export const { useGetVehicleHealthQuery, useUpdateVehicleMutation } = healthApi;
