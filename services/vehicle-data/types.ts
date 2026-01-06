export type VehicleType = 'two_wheeler' | 'three_wheeler' | 'sedan' | 'xuv_suv' | 'heavy_vehicle';

export interface Brand {
    id: string;
    name: string;
    type: VehicleType;
    logoUrl?: string;
}

export interface Model {
    id: string;
    name: string;
    brandId: string;
    type: VehicleType;
}

export interface Vehicle {
    id?: string;
    type: VehicleType;
    brandId: string;
    modelId: string;
    variant?: string;
    manufacturingYear: number;
    fuelType: string;
    registrationNumber?: string;
    isDefault?: boolean;
}
