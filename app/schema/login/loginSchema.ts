import * as yup from "yup";

export const loginSchema = yup.object({
  method: yup
    .mixed<"phone" | "email">()
    .oneOf(["phone", "email"])
    .required(),

  phone: yup
    .string()
    .defined() 
    .transform((value) => (value === "" ? undefined : value))
    .when("method", {
      is: "phone",
      then: (schema) => schema.required("Phone number is required"),
      otherwise: (schema) => schema.optional(),
    }),

  email: yup
    .string()
    .defined() 
    .transform((value) => (value === "" ? undefined : value))
    .when("method", {
      is: "email",
      then: (schema) =>
        schema.email("Invalid email").required("Email is required"),
      otherwise: (schema) => schema.optional(),
    }),

  password: yup
    .string()
    .defined()
    .transform((value) => (value === "" ? undefined : value))
    .when("method", {
      is: "email",
      then: (schema) =>
        schema.min(6, "Password must be at least 6 characters").required("Password is required"),
      otherwise: (schema) => schema.optional(),
    }),
});

export const MAIL_PROVIDERS: Record<string, string> = {
  "gmail.com": "https://mail.google.com",
  "yahoo.com": "https://mail.yahoo.com",
  "outlook.com": "https://outlook.live.com/mail",
  "hotmail.com": "https://outlook.live.com/mail",
  "icloud.com": "https://www.icloud.com/mail",
  "proton.me": "https://mail.proton.me",
  "protonmail.com": "https://mail.proton.me",
  "yopmail.com": "https://yopmail.com",
};
