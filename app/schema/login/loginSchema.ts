import * as yup from "yup"

export const loginSchema = yup.object({
    phone: yup.string()
        .required("Phone number is required")
        .matches(/^\+91\d{10}$/, "Phone number must be a valid 10-digit Indian number"),
})
