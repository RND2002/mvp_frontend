import { Brand, Model, VehicleType } from './types';
import { carMakes } from './car-makes.service';
import { carModelsIndia } from './car-models.service';
import { bikeMakes } from './bike-makes';
import { bikeModelsIndia } from './bike-models';
import { getBrandLogo } from './getBrandLogo';
import { VEHICLE_TYPE } from '../../app/beService/vehicle-service';

export const getBrands = async (type: VehicleType): Promise<Brand[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (type === VEHICLE_TYPE.TWO_WHEELER || type === VEHICLE_TYPE.THREE_WHEELER) {
        return bikeMakes.map(make => ({
            id: make.id,
            name: make.name,
            type: type, // Pass the selected type (e.g. two_wheeler or three_wheeler)
            logoUrl: getBrandLogo(make.domain)
        }));
    } else {
        // Fallback for sedan, xuv_suv, heavy_vehicle -> show car brands
        // Note: Heavy vehicles might need a different list but we use carMakes for now as per plan
        return carMakes.map(make => ({
            id: make.id,
            name: make.name,
            type: type, // Pass the selected type
            logoUrl: getBrandLogo(make.domain)
        }));
    }
};

export const getModels = async (brandId: string): Promise<Model[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    let models: string[] = [];
    let type: VehicleType = VEHICLE_TYPE.SEDAN; // Default to SEDAN for car database matches

    if (brandId in carModelsIndia) {
        models = carModelsIndia[brandId];
        type = VEHICLE_TYPE.SEDAN; // Map generic car models to SEDAN type for compatibility
    } else if (brandId in bikeModelsIndia) {
        models = bikeModelsIndia[brandId];
        type = VEHICLE_TYPE.TWO_WHEELER; // Map generic bike models to TWO_WHEELER
    }

    return models.map(name => ({
        id: name, // Using name as ID for now since we don't have separate IDs
        name: name,
        brandId: brandId,
        type: type
    }));
};
