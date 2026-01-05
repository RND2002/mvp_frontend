import * as yup from "yup"

export const loginSchema = yup.object({
    method: yup.string().oneOf(['phone', 'email']).required(),
    phone: yup.string().when('method', {
        is: 'phone',
        then: (schema) => schema.required("Phone number is required"),
        otherwise: (schema) => schema.optional()
    }),
    email: yup.string().when('method', {
        is: 'email',
        then: (schema) => schema.email("Invalid email").required("Email is required"),
        otherwise: (schema) => schema.optional()
    }),
});

type InferredType = yup.InferType<typeof loginSchema>;

// Force keys to be required (though values can be undefined) to match useForm/Control behavior
export type LoginSchemaType = {
    [K in keyof InferredType]-?: InferredType[K]
};
