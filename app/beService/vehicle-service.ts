import { baseApi } from '../store/api/baseApi';



export enum VEHICLE_TYPE {
    TWO_WHEELER = "two_wheeler",
    THREE_WHEELER = "three_wheeler",
    FOUR_WHEELER = "four_wheeler",
    XUV_SUV = "xuv_suv",
    HEAVY_VEHICLE = "heavy_vehicle"
}

export enum FUEL_TYPE {
    PETROL = "petrol",
    DIESEL = "diesel",
    ELECTRIC = "electric",
    HYBRID = "hybrid",
    CNG = "cng"
}

export interface CreateVehicleRequest {
    vehicle_type: VEHICLE_TYPE;
    brand: string;
    model: string;
    year: number;
    fuel_type: string;
    registration_number?: string;
    vehicle_model_id?: string;
    odometer_reading?: number;
    baseline_last_service_date?: string;
    baseline_odometer_reading?: number;
    last_service_type?: string;
    last_service_odometer?: number;
    known_issues?: string[];
    purchase_type?: 'new' | 'used';
}

export const vehicleApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addVehicle: builder.mutation<{ success: boolean; vehicle: CreateVehicleRequest & { id: string; created_at: string } }, CreateVehicleRequest>({
            query: (body) => ({
                url: '/vehicles',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const { useAddVehicleMutation } = vehicleApi;
