
import { baseApi } from '../store/api/baseApi';
import { Brand, Model } from '@/services/vehicle-data/types';
import { getBrandLogo } from '@/services/vehicle-data/getBrandLogo';

export interface GetVehicleDataRequest {
    type: 'brand' | 'model';
    vehicle_type?: string;
    brand?: string;
}

export interface GetVehicleDataResponse {
    success: boolean;
    brands?: Brand[];
    models?: Model[];
}

export const carModelApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getVehicleKeyData: builder.query<GetVehicleDataResponse, GetVehicleDataRequest>({
            query: (params) => ({
                url: '/vehicle-model',
                method: 'GET',
                params: {
                    type: params.type,
                    vehicle_type: params.vehicle_type,
                    brand: params.brand
                }
            }),
            transformResponse: (response: GetVehicleDataResponse) => {
                // Enrich brands with logoUrl if missing from API but available locally
                if (response.brands) {
                    return {
                        ...response,
                        brands: response.brands.map(b => ({
                            ...b,
                            logoUrl: b.logoUrl || (b.domain ? getBrandLogo(b.domain) : undefined)
                        }))
                    };
                }
                return response;
            }
        }),
    }),
});

export const { useGetVehicleKeyDataQuery } = carModelApi;
