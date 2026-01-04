import * as yup from 'yup';

export const vehicleSchema = yup.object({
    type: yup.string().oneOf(['car', 'bike']).required('Vehicle type is required'),
    brand_id: yup.string().required('Brand is required'), // changed to snake_case for API consistency if needed, but form usually uses camelCase. User asked for snake_case types for API. Let's keep form camelCase for UI and map it, OR use snake_case everywhere. User said "declare type in mutation itself... id, type, brand...".
    // Let's stick to the previous schema properties but ensuring we map to snake_case payload for API.
    // Actually, for the FORM, it's easier to keep camelCase or whatever the UI uses. 
    // But commonly APIs expect snake_case.
    // Let's keep the form matching the UI state (camelCase) and transform before sending, 
    // UNLESS user wants the schema to directly match the API payload.
    // User said "also for yup schemas use schema folder dedicated for it".
    // I will keep the properties as is for now to avoid breaking UI bindings, and map in the mutation.
    brandId: yup.string().required('Brand is required'),
    modelId: yup.string().required('Model is required'),
    manufacturingYear: yup
        .number()
        .typeError('Year must be a number')
        .required('Manufacturing year is required')
        .min(1900, 'Invalid year')
        .max(new Date().getFullYear(), 'Year cannot be in the future'),
    fuelType: yup.string().required('Fuel type is required'),
    registrationNumber: yup.string().optional(),
    variant: yup.string().optional(),
});

export type VehicleFormData = yup.InferType<typeof vehicleSchema>;
