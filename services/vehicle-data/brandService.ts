import { Brand, Model, VehicleType } from './types';
import { carMakes } from './car-makes.service';
import { carModelsIndia } from './car-models.service';
import { bikeMakes } from './bike-makes';
import { bikeModelsIndia } from './bike-models';
import { getBrandLogo } from './getBrandLogo';
import { VEHICLE_TYPE } from '../../app/beService/vehicle-service';
import { FUEL_TYPE } from '../../app/beService/vehicle-service';


export const getBrands = async (type: VehicleType): Promise<Brand[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (type === VEHICLE_TYPE.CAR) {
        return carMakes.map(make => ({
            id: make.id,
            name: make.name,
            type: VEHICLE_TYPE.CAR,
            logoUrl: getBrandLogo(make.domain)
        }));
    } else {
        return bikeMakes.map(make => ({
            id: make.id,
            name: make.name,
            type: VEHICLE_TYPE.BIKE,
            logoUrl: getBrandLogo(make.domain)
        }));
    }
};

export const getModels = async (brandId: string): Promise<Model[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    let models: string[] = [];
    let type: VehicleType = VEHICLE_TYPE.CAR;

    if (brandId in carModelsIndia) {
        models = carModelsIndia[brandId];
        type = VEHICLE_TYPE.CAR;
    } else if (brandId in bikeModelsIndia) {
        models = bikeModelsIndia[brandId];
        type = 'bike';
    }

    return models.map(name => ({
        id: name, // Using name as ID for now since we don't have separate IDs
        name: name,
        brandId: brandId,
        type: type
    }));
};
