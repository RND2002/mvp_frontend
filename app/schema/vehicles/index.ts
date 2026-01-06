import * as yup from 'yup';

export const vehicleSchema = yup.object({
    vehicle_type: yup.string().oneOf(['two_wheeler', 'three_wheeler', 'sedan', 'xuv_suv', 'heavy_vehicle']).required('Vehicle type is required'),
    brand: yup.string().required('Brand is required'),
    model: yup.string().required('Model is required'),
    year: yup
        .number()
        .typeError('Year must be a number')
        .required('Manufacturing year is required')
        .min(1900, 'Invalid year')
        .max(new Date().getFullYear(), 'Year cannot be in the future'),
    fuel_type: yup.string().required('Fuel type is required'),
    registration_number: yup.string().required('Registration Number is required'),
});

export const vehicleStep1Schema = yup.object({ vehicle_type: vehicleSchema.fields.vehicle_type });
export const vehicleStep2Schema = yup.object({ brand: vehicleSchema.fields.brand });
export const vehicleStep3Schema = yup.object({ model: vehicleSchema.fields.model });
export const vehicleStep4Schema = yup.object({
    year: vehicleSchema.fields.year,
    fuel_type: vehicleSchema.fields.fuel_type,
    registration_number: vehicleSchema.fields.registration_number,
});

export const stepSchemas = {
    1: vehicleStep1Schema,
    2: vehicleStep2Schema,
    3: vehicleStep3Schema,
    4: vehicleStep4Schema,
};

export type VehicleFormData = yup.InferType<typeof vehicleSchema>;
