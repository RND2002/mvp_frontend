import * as yup from 'yup';
import { VEHICLE_TYPE } from '@/app/beService/vehicle-service';

export const vehicleSchema = yup.object({
    vehicle_type: yup.mixed<VEHICLE_TYPE>().oneOf(Object.values(VEHICLE_TYPE)).required('Vehicle type is required'),
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
    vehicle_model_id: yup.string().optional().default(''),
    odometer_reading: yup.number().typeError('Odometer must be a number').positive('Odometer must be positive').optional(),
    baseline_last_service_date: yup.string().optional(),
    baseline_odometer_reading: yup.number().typeError('Service odometer must be a number').positive('Service odometer must be positive').optional(),
    last_service_type: yup.string().optional(),
    last_service_odometer: yup.number().typeError('Last service odometer must be a number').positive('Last service odometer must be positive').optional(),
    known_issues: yup.array().of(yup.string().required()).optional().default([]),
    purchase_type: yup.string().oneOf(['new', 'used']).optional(),
});

export const vehicleStep1Schema = yup.object({ vehicle_type: vehicleSchema.fields.vehicle_type });
export const vehicleStep2Schema = yup.object({ brand: vehicleSchema.fields.brand });
export const vehicleStep3Schema = yup.object({ model: vehicleSchema.fields.model });
export const vehicleStep4Schema = yup.object({
    year: vehicleSchema.fields.year,
    fuel_type: vehicleSchema.fields.fuel_type,
    registration_number: vehicleSchema.fields.registration_number,
    odometer_reading: vehicleSchema.fields.odometer_reading,
    baseline_last_service_date: vehicleSchema.fields.baseline_last_service_date,
    baseline_odometer_reading: vehicleSchema.fields.baseline_odometer_reading,
    last_service_type: vehicleSchema.fields.last_service_type,
    last_service_odometer: vehicleSchema.fields.last_service_odometer,
    known_issues: vehicleSchema.fields.known_issues,
    purchase_type: vehicleSchema.fields.purchase_type,
});

export const stepSchemas = {
    1: vehicleStep1Schema,
    2: vehicleStep2Schema,
    3: vehicleStep3Schema,
    4: vehicleStep4Schema,
};

export type VehicleFormData = yup.InferType<typeof vehicleSchema>;
