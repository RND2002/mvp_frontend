import { baseApi } from '../store/api/baseApi';



export enum VEHICLE_TYPE {
    TWO_WHEELER = "two_wheeler",
    THREE_WHEELER = "three_wheeler",
    SEDAN = "sedan",
    XUV_SUV = "xuv_suv",
    HEAVY_VEHICLE = "heavy_vehicle"
}

export enum FUEL_TYPE {
    PETROL = "petrol",
    DIESEL = "diesel",
    ELECTRIC = "electric",
    HYBRID = "hybrid"
}

export const vehicleApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addVehicle: builder.mutation<{ success: boolean; vehicle: any }, {
            vehicle_type: VEHICLE_TYPE;
            brand: string;
            model: string;
            year: number;
            fuel_type: string;
            registration_number?: string;
            vehicle_model_id?: string;
        }>({
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
