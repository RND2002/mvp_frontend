import { baseApi } from '../store/api/baseApi';

export interface HealthMetric {
    score: number;
    status: string;
    basis?: string;
    severity?: string;
    due_in_km?: number | null;
    due_in_days?: number | null;
    last_serviced_date?: string | null;
    last_serviced_odometer?: number | null;
    predicted_next_date?: string | null;
    predicted_next_odometer?: number | null;
}

export interface HealthRecommendation {
    component: string;
    message: string;
    urgency: 'critical' | 'high' | 'medium' | 'low' | string;
    due_in_km: number | null;
    due_in_days: number | null;
}

export type VehicleIssueSeverity = 'low' | 'medium' | 'high' | 'critical';
export type VehicleIssueStatus = 'open' | 'resolved' | 'ignored';

export interface AddOdometerRequest {
    vehicleId: string;
    reading: number;
    source?: 'user_input' | 'booking' | 'manual_entry';
}

export interface AddServiceRecordRequest {
    vehicleId: string;
    service_date: string;
    odometer_at_service: number;
    service_type: string;
    components_serviced: string[];
    cost?: number;
    garage_name?: string;
    source?: 'manual_entry' | 'booking';
}

export interface ReportVehicleIssueRequest {
    vehicleId: string;
    issue_type: string;
    description: string;
    severity: VehicleIssueSeverity;
}

export interface ResolveVehicleIssueRequest {
    vehicleId: string;
    issueId: string;
    status: VehicleIssueStatus;
    resolved_at?: string;
}

export interface VehicleTimelineItem {
    id: string;
    type: 'service_record' | 'booking' | 'issue' | string;
    title?: string;
    description?: string;
    status?: string;
    date?: string;
    created_at?: string;
    service_date?: string;
    scheduled_at?: string;
    service_type?: string;
    issue_type?: string;
    odometer_reading?: number;
    odometer_at_service?: number;
    cost?: number;
    final_price?: number;
    garage_name?: string;
    components_serviced?: string[];
    raw?: unknown;
}

export interface VehicleTimelineResponse {
    success: boolean;
    timeline: VehicleTimelineItem[];
}

export interface VehicleHealthReport {
    success: boolean;
    health: {
        id?: string;
        vehicle_id?: string;
        vehicleId?: string;
        generated_at?: string;
        overall_score?: number;
        overall_status?: string;
        estimated_km_per_day?: number | string | null;
        components?: Record<string, HealthMetric>;
        recommendations?: HealthRecommendation[];
        next_service_date?: string | null;
        next_service_km?: number | string | null;
        confidence?: string;
        overall?: {
            score: number | null;
            status: string;
            confidence: string;
            source?: string;
            last_service_date?: string | null;
            odometer_reading?: number;
            km_since_service?: number;
            days_since_service?: number;
            message?: string | null;
        } | null;
        systems?: Record<string, HealthMetric> | null;
    };
}

export const healthApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getVehicleHealth: builder.query<VehicleHealthReport, string>({
            query: (vehicleId) => `/vehicles/${vehicleId}/health`,
            providesTags: (result, error, id) => [{ type: 'User', id: `HEALTH_${id}` }],
        }),
        updateVehicle: builder.mutation<VehicleHealthReport, {
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
        addVehicleOdometer: builder.mutation<VehicleHealthReport, AddOdometerRequest>({
            query: ({ vehicleId, ...body }) => ({
                url: `/vehicles/${vehicleId}/odometer`,
                method: 'POST',
                body: {
                    source: 'user_input',
                    ...body,
                },
            }),
            invalidatesTags: (result, error, { vehicleId }) => [{ type: 'User', id: `HEALTH_${vehicleId}` }],
        }),
        addVehicleServiceRecord: builder.mutation<VehicleHealthReport, AddServiceRecordRequest>({
            query: ({ vehicleId, ...body }) => ({
                url: `/vehicles/${vehicleId}/service-records`,
                method: 'POST',
                body: {
                    source: 'manual_entry',
                    ...body,
                },
            }),
            invalidatesTags: (result, error, { vehicleId }) => [{ type: 'User', id: `HEALTH_${vehicleId}` }],
        }),
        reportVehicleIssue: builder.mutation<VehicleHealthReport, ReportVehicleIssueRequest>({
            query: ({ vehicleId, ...body }) => ({
                url: `/vehicles/${vehicleId}/issues`,
                method: 'POST',
                body,
            }),
            invalidatesTags: (result, error, { vehicleId }) => [{ type: 'User', id: `HEALTH_${vehicleId}` }],
        }),
        resolveVehicleIssue: builder.mutation<VehicleHealthReport, ResolveVehicleIssueRequest>({
            query: ({ vehicleId, issueId, ...body }) => ({
                url: `/vehicles/${vehicleId}/issues/${issueId}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (result, error, { vehicleId }) => [{ type: 'User', id: `HEALTH_${vehicleId}` }],
        }),
        getVehicleTimeline: builder.query<VehicleTimelineResponse, string>({
            query: (vehicleId) => `/vehicles/${vehicleId}/timeline`,
            providesTags: (result, error, id) => [{ type: 'User', id: `TIMELINE_${id}` }],
        }),
    }),
});

export const {
    useGetVehicleHealthQuery,
    useUpdateVehicleMutation,
    useAddVehicleOdometerMutation,
    useAddVehicleServiceRecordMutation,
    useReportVehicleIssueMutation,
    useResolveVehicleIssueMutation,
    useGetVehicleTimelineQuery,
} = healthApi;
