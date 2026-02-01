import { z } from "zod";

// Auth Validations
export const registerSchema = z
    .object({
        firstName: z
            .string()
            .min(2, "First name must be at least 2 characters")
            .max(50, "First name must be less than 50 characters"),
        lastName: z
            .string()
            .min(2, "Last name must be at least 2 characters")
            .max(50, "Last name must be less than 50 characters"),
        email: z.string().email("Invalid email address"),
        phoneNumber: z
            .string()
            .regex(/^(\+234|0)[789]\d{9}$/, "Invalid Nigerian phone number"),
        dateOfBirth: z.string().refine((date) => {
            const birthDate = new Date(date);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            return age >= 18;
        }, "You must be at least 18 years old"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                "Password must contain at least one uppercase letter, one lowercase letter, and one number"
            ),
        confirmPassword: z.string(),
        linkedInUrl: z
            .string()
            .url("Invalid URL")
            .regex(/linkedin\.com/, "Must be a LinkedIn URL")
            .optional()
            .or(z.literal("")),
        agreeToTerms: z
            .boolean()
            .refine((val) => val === true, "You must agree to the terms and conditions"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean().optional(),
});

// Certification Validations
export const certificationSchema = z.object({
    title: z
        .string()
        .min(3, "Certification title must be at least 3 characters")
        .max(200, "Certification title must be less than 200 characters"),
    issuingOrganization: z
        .string()
        .min(2, "Organization name must be at least 2 characters")
        .max(200, "Organization name must be less than 200 characters"),
    issueDate: z.string().refine((date) => {
        const issueDate = new Date(date);
        const today = new Date();
        return issueDate <= today;
    }, "Issue date cannot be in the future"),
    expiryDate: z
        .string()
        .optional()
        .refine(
            (date) => {
                if (!date) return true;
                const expiryDate = new Date(date);
                const today = new Date();
                return expiryDate > today;
            },
            "Expiry date must be in the future"
        ),
    credentialId: z
        .string()
        .min(3, "Credential ID must be at least 3 characters")
        .max(100, "Credential ID must be less than 100 characters"),
    document: z
        .any()
        .refine((file) => file instanceof File, "Document is required")
        .refine(
            (file) => file?.size <= 5 * 1024 * 1024,
            "File size must be less than 5MB"
        )
        .refine(
            (file) =>
                ["application/pdf", "image/jpeg", "image/png"].includes(file?.type),
            "Only PDF, JPEG, and PNG files are allowed"
        ),
});

// Profile Update Validation
export const profileUpdateSchema = z.object({
    firstName: z
        .string()
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name must be less than 50 characters"),
    lastName: z
        .string()
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name must be less than 50 characters"),
    phoneNumber: z
        .string()
        .regex(/^(\+234|0)[789]\d{9}$/, "Invalid Nigerian phone number"),
    linkedInUrl: z
        .string()
        .url("Invalid URL")
        .regex(/linkedin\.com/, "Must be a LinkedIn URL")
        .optional()
        .or(z.literal("")),
    bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

// Admin Verification Decision
export const verificationDecisionSchema = z.object({
    status: z.enum(["verified", "failed"]),
    rejectionReason: z.string().optional(),
}).refine(
    (data) => {
        if (data.status === "failed") {
            return !!data.rejectionReason;
        }
        return true;
    },
    {
        message: "Rejection reason is required when failing a verification",
        path: ["rejectionReason"],
    }
);

// Export types
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type CertificationFormData = z.infer<typeof certificationSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type VerificationDecisionData = z.infer<typeof verificationDecisionSchema>;
