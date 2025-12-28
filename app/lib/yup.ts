import * as yup from "yup";
import { isValidPhoneNumber } from "react-phone-number-input";

// Unicode letters, spaces, apostrophe, hyphen
const nameRegex = /^[\p{L}\s'-]+$/u;
const wordCount = (value: string) =>
    value ? value.trim().split(/\s+/).length : 0;

export const letsTalkForSchema = yup.object({
    name: yup
        .string()
        .required("First Name is required")
        .min(3, "First Name must be at least 3 characters")
        .test(
            "no-special-chars",
            "First Name is invalid",
            (val) => !!val && nameRegex.test(val)
        ),

    phone: yup
        .string()
        .required("Phone number is required")
        .test(
            "is-phone",
            "Enter a valid phone number",
            (val) => !!val && isValidPhoneNumber(val)
        ),

    email: yup
        .string()
        .required("Email is required")
        .email("Enter a valid email address")
        .test(
            "contains-dot",
            "Email must contain '.'",
            (val) => !!val && val.includes(".")
        ),

    country: yup
        .string()
        .required("Country is required")
        .min(2, "Country must be at least 2 characters"),

    message: yup
        .string()
        .required("Message is required")
        .test("max-words", "Message cannot exceed 500 words", (val = "") => {
            const words = val.trim().split(/\s+/).filter(Boolean);
            return words.length <= 500;
        }),
});

export const jobApplicationSchema = yup.object({
    firstName: yup
        .string()
        .required("First Name is required")
        .min(2, "First Name must be at least 2 characters")
        .test(
            "valid-firstname",
            "First Name is invalid",
            (val) => !!val && nameRegex.test(val)
        ),

    lastName: yup
        .string()
        .required("Last Name is required")
        .min(2, "Last Name must be at least 2 characters")
        .test(
            "valid-lastname",
            "Last Name is invalid",
            (val) => !!val && nameRegex.test(val)
        ),

    email: yup
        .string()
        .required("Email is required")
        .email("Enter a valid email address")
        .test(
            "contains-dot",
            "Email must contain '.'",
            (val) => !!val && val.includes(".")
        ),

    phone: yup
        .string()
        .required("Phone number is required")
        .test(
            "valid-phone",
            "Enter a valid phone number",
            (val) => !!val && val.length >= 8
        ),

    message: yup
        .string()
        .required("Message is required")
        .test("max-words", "Message cannot exceed 500 words", (val = "") => {
            const words = val.trim().split(/\s+/).filter(Boolean);
            return words.length <= 500;
        }),

    resume: yup
        .mixed<FileList>()
        .nullable()
        .required("Resume is required")
        .test("fileType", "Only PDF, DOC, DOCX allowed", (value) => {
            if (!value || value.length === 0) return false;
            const file = value[0];
            const allowed = [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ];
            return allowed.includes(file.type);
        })
        .test("fileSize", "File must be less than 5MB", (value) => {
            if (!value || value.length === 0) return false;
            return value[0].size <= 5 * 1024 * 1024;
        }),
});

export const contactFormSchema = yup.object({
    firstName: yup
        .string()
        .required("First Name is required")
        .min(3, "First Name must be at least 3 characters")
        .test(
            "no-special-chars",
            "First Name is invalid",
            (val) => !!val && nameRegex.test(val)
        ),
    lastName: yup
        .string()
        .required("Last Name is required")
        .min(3, "Last Name must be at least 3 characters")
        .test(
            "no-special-chars",
            "Last Name is invalid",
            (val) => !!val && nameRegex.test(val)
        ),

    phone: yup
        .string()
        .required("Phone number is required")
        .test(
            "is-phone",
            "Enter a valid phone number",
            (val) => !!val && isValidPhoneNumber(val)
        ),

    email: yup
        .string()
        .required("Email is required")
        .email("Enter a valid email address")
        .test(
            "contains-dot",
            "Email must contain '.'",
            (val) => !!val && val.includes(".")
        ),

    message: yup
        .string()
        .required("Message is required")
        .test("max-words", "Message cannot exceed 500 words", (val = "") => {
            const words = val.trim().split(/\s+/).filter(Boolean);
            return words.length <= 500;
        }),
});

export const reachOut = yup.object().shape({
    name: yup
        .string()
        .required("Name is required")
        .matches(/^[A-Za-z\s]+$/, "Name can only contain letters"),

    country: yup
        .string()
        .required("Country is required")
        .matches(/^[A-Za-z\s]+$/, "Country can only contain letters"),

    email: yup
        .string()
        .required("Email is required")
        .email("Please enter a valid email address"),

    phone: yup
        .string()
        .required("Phone number is required")
        .min(9, "Phone number must be at 9 ")
        .test("is-valid-phone", "Please enter a valid phone number", (value) =>
            value ? isValidPhoneNumber(value) : false
        ),

    message: yup
        .string()
        .required("Message is required")
        .test(
            "word-count",
            "Message cannot exceed 500 words",
            (value) => wordCount(value || "") <= 500
        ),

    privacyPolicy: yup
        .boolean()
        .required("You must accept the privacy policy")
        .oneOf([true], "You must accept the privacy policy"),
});
