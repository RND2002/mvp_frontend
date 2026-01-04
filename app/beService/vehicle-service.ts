import { baseApi } from '../store/api/baseApi';



export enum VEHICLE_TYPE {
    CAR = "car",
    BIKE = "bike"
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
            type: VEHICLE_TYPE;
            brand: string;
            model: string;
            year: number;
            fuel_type: string;
            registration_number?: string;
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
