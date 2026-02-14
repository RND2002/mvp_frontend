import { VEHICLE_TYPE } from "@/app/beService/vehicle-service";

export type VehicleType = VEHICLE_TYPE;

export interface Brand {
    id: string;
    name: string;
    type: VehicleType;
    logoUrl?: string;
    domain?: string;
}

export interface Model {
    id: string;
    name: string;
    brandId: string;
    type: VehicleType;
    year?: number;
    fuel_type?: string;
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
