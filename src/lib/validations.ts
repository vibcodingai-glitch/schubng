import { z } from "zod";

// Registration Validation Schema
export const registerSchema = z.object({
    firstName: z.string()
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name must not exceed 50 characters")
        .regex(/^[a-zA-Z\s'-]+$/, "First name can only contain letters, spaces, hyphens, and apostrophes"),

    lastName: z.string()
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name must not exceed 50 characters")
        .regex(/^[a-zA-Z\s'-]+$/, "Last name can only contain letters, spaces, hyphens, and apostrophes"),

    email: z.string()
        .email("Please enter a valid email address")
        .toLowerCase(),

    phoneNumber: z.string()
        .min(10, "Please enter a valid phone number")
        .max(15, "Phone number is too long"),

    // dateOfBirth removed

    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password must not exceed 100 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),

    confirmPassword: z.string(),

    linkedInUrl: z.string()
        .url("Please enter a valid URL")
        .regex(/linkedin\.com/, "Please enter a valid LinkedIn profile URL")
        .optional()
        .or(z.literal("")),

    agreeToTerms: z.boolean()
        .refine((val) => val === true, "You must agree to the Terms and Conditions"),

    // Step 2 Fields
    jobTitle: z.string().optional(),
    yearsOfExperience: z.string().optional(),
    industry: z.string().optional(),
    state: z.string().optional(),
    currentCompany: z.string().optional(),
    hearAboutUs: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

// Login Validation Schema
export const loginSchema = z.object({
    email: z.string()
        .email("Please enter a valid email address")
        .toLowerCase(),

    password: z.string()
        .min(1, "Password is required"),

    rememberMe: z.boolean().optional(),
});

// Certification Upload Validation Schema
export const certificationSchema = z.object({
    title: z.string()
        .min(3, "Certification title must be at least 3 characters")
        .max(200, "Certification title must not exceed 200 characters"),

    issuingOrganization: z.string()
        .min(2, "Issuing organization must be at least 2 characters")
        .max(200, "Issuing organization must not exceed 200 characters"),

    issueDate: z.string()
        .min(1, "Issue date is required")
        .refine((date) => {
            const issueDate = new Date(date);
            const today = new Date();
            return issueDate <= today;
        }, "Issue date cannot be in the future"),

    expiryDate: z.string().optional().or(z.literal("")),

    credentialId: z.string()
        .min(3, "Credential ID must be at least 3 characters")
        .max(100, "Credential ID must not exceed 100 characters"),
}).refine((data) => {
    if (data.expiryDate && data.expiryDate !== "") {
        const issueDate = new Date(data.issueDate);
        const expiryDate = new Date(data.expiryDate);
        return expiryDate > issueDate;
    }
    return true;
}, {
    message: "Expiry date must be after issue date",
    path: ["expiryDate"],
});

// Work Experience Validation Schema
export const workExperienceSchema = z.object({
    company: z.string().min(1, "Company is required"),
    role: z.string().min(1, "Role is required"),
    location: z.string().optional().or(z.literal("")),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional().or(z.literal("")),
    isCurrent: z.boolean().default(false),
    description: z.string().optional().or(z.literal("")),
});

// Education Validation Schema
export const educationSchema = z.object({
    institution: z.string().min(1, "Institution is required"),
    degree: z.string().min(1, "Degree is required"),
    fieldOfStudy: z.string().min(1, "Field of study is required"),
    startYear: z.coerce.number().int().min(1900, "Invalid year"),
    endYear: z.coerce.number().int().optional(),
});

// Profile Update Validation Schema
export const profileUpdateSchema = z.object({
    firstName: z.string()
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name must not exceed 50 characters")
        .regex(/^[a-zA-Z\s'-]+$/, "First name can only contain letters, spaces, hyphens, and apostrophes"),

    lastName: z.string()
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name must not exceed 50 characters")
        .regex(/^[a-zA-Z\s'-]+$/, "Last name can only contain letters, spaces, hyphens, and apostrophes"),

    phoneNumber: z.string()
        .min(10, "Please enter a valid phone number")
        .max(15, "Phone number is too long"),

    linkedInUrl: z.string()
        .url("Please enter a valid URL")
        .regex(/linkedin\.com/, "Please enter a valid LinkedIn profile URL")
        .optional()
        .or(z.literal("")),

    headline: z.string().max(120).optional().or(z.literal("")),
    summary: z.string().max(2000).optional().or(z.literal("")),
    state: z.string().optional().or(z.literal("")),
    city: z.string().optional().or(z.literal("")),
    location: z.string().optional().or(z.literal("")),

    skills: z.array(z.string()).optional(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type CertificationFormData = z.infer<typeof certificationSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type WorkExperienceFormData = z.infer<typeof workExperienceSchema>;
export type EducationFormData = z.infer<typeof educationSchema>;
