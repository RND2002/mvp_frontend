
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
            transformResponse: (response: any, meta, arg) => {
                const results = response.results || [];

                if (arg.type === 'brand') {
                    return {
                        success: response.success,
                        brands: results.map((b: any) => ({
                            id: b.id,
                            name: b.name,
                            domain: b.domain,
                            type: arg.vehicle_type, // Preserve requested vehicle type
                            logoUrl: b.domain ? getBrandLogo(b.domain) : undefined
                        }))
                    };
                }

                if (arg.type === 'model') {
                    return {
                        success: response.success,
                        models: results.map((m: any) => ({
                            id: m.id,
                            name: m.name || m.model, // Support both 'name' and 'model' fields
                            brandId: arg.brand,
                            type: m.vehicle_type || arg.vehicle_type,
                            year: m.year,
                            fuel_type: m.fuel_type
                        }))
                    };
                }

                return response;
            }
        }),
    }),
});

export const { useGetVehicleKeyDataQuery } = carModelApi;
