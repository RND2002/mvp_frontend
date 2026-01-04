import * as yup from "yup"

export const loginSchema = yup.object({
    phone: yup.string().optional(),
    email: yup.string().email("Invalid email").optional(),
}).test('at-least-one', 'Provide phone or email', (value) => {
    return !!(value.phone || value.email);
});

type InferredType = yup.InferType<typeof loginSchema>;

// Force keys to be required (though values can be undefined) to match useForm/Control behavior
export type LoginSchemaType = {
    [K in keyof InferredType]-?: InferredType[K]
};
