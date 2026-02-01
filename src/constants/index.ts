// Certification Status Badge Configurations
export const CERTIFICATION_STATUS = {
    verified: {
        label: "Verified",
        color: "bg-emerald-100 text-emerald-700 border-emerald-300",
        icon: "✓",
    },
    pending: {
        label: "Pending Review",
        color: "bg-amber-100 text-amber-700 border-amber-300",
        icon: "⏱",
    },
    failed: {
        label: "Verification Failed",
        color: "bg-red-100 text-red-700 border-red-300",
        icon: "✗",
    },
    unverified: {
        label: "Unverified",
        color: "bg-slate-100 text-slate-600 border-slate-300",
        icon: "○",
    },
} as const;

// Trust Score Ranges
export const TRUST_SCORE_RANGES = {
    excellent: { min: 80, max: 100, label: "Excellent", color: "text-emerald-600" },
    good: { min: 60, max: 79, label: "Good", color: "text-blue-600" },
    fair: { min: 40, max: 59, label: "Fair", color: "text-amber-600" },
    poor: { min: 0, max: 39, label: "Poor", color: "text-red-600" },
} as const;

// Verification Fee (in Naira)
export const VERIFICATION_FEE = {
    amount: 5000,
    currency: "NGN",
    description: "One-time certification verification fee",
} as const;

// Common Supply Chain Certifications
export const COMMON_CERTIFICATIONS = [
    "CSCP - Certified Supply Chain Professional",
    "CPIM - Certified in Production and Inventory Management",
    "CSCP - Certified Supply Chain Professional (APICS)",
    "CLTD - Certified in Logistics, Transportation and Distribution",
    "Six Sigma Green Belt",
    "Six Sigma Black Belt",
    "CIPS - Chartered Institute of Procurement & Supply",
    "PMP - Project Management Professional",
    "CSCMP - Council of Supply Chain Management Professionals",
    "ISM - Institute for Supply Management Certification",
] as const;

// Nigerian States
export const NIGERIAN_STATES = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
    "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT",
    "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi",
    "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo",
    "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
] as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;

// File Upload Limits
export const FILE_UPLOAD = {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
    allowedExtensions: [".pdf", ".jpg", ".jpeg", ".png"],
} as const;

// Routes
export const ROUTES = {
    home: "/",
    login: "/login",
    register: "/register",
    dashboard: "/dashboard",
    profile: "/dashboard/profile",
    certifications: "/dashboard/certifications",
    newCertification: "/dashboard/certifications/add",
    verifications: "/dashboard/verifications",
    settings: "/dashboard/settings",
    billing: "/dashboard/billing",
    adminDashboard: "/admin",
    adminQueue: "/admin/queue",
    adminVerifications: "/admin/verifications",
    adminProfessionals: "/admin/professionals",
} as const;

// API Endpoints (for future use)
export const API_ENDPOINTS = {
    auth: {
        register: "/api/auth/register",
        login: "/api/auth/login",
        logout: "/api/auth/logout",
        me: "/api/auth/me",
    },
    certifications: {
        list: "/api/certifications",
        create: "/api/certifications",
        update: (id: string) => `/api/certifications/${id}`,
        delete: (id: string) => `/api/certifications/${id}`,
    },
    payments: {
        initialize: "/api/payments/initialize",
        verify: "/api/payments/verify",
    },
    admin: {
        queue: "/api/admin/queue",
        verify: "/api/admin/verify",
        professionals: "/api/admin/professionals",
    },
} as const;
