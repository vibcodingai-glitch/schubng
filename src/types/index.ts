// ============================================
// User Types
// ============================================

export type UserRole = "professional" | "admin";

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    headline?: string;
    summary?: string;
    profilePhoto?: string;
    location?: {
        state: string;
        city?: string;
    };
    linkedInUrl?: string;
    currentRole?: string;
    currentCompany?: string;
    industry?: string;
    yearsOfExperience?: string;
    plan: 'free' | 'verified_pro';
    trustScore: number;
    isProfilePublic: boolean;
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string;
}

export interface Professional extends User {
    username: string;
    certifications: Certification[];
    experiences: WorkExperience[];
    education: Education[];
    skills: string[];
}

// ============================================
// Certification Types
// ============================================

export type VerificationStatus =
    | 'unverified'
    | 'pending'
    | 'in_review'
    | 'verified'
    | 'failed'
    | 'expired';

export type CertificationStatus = VerificationStatus;

export interface Certification {
    id: string;
    userId: string;
    type: string;
    customName?: string;
    issuingBody: string;
    credentialId: string;
    issueDate: string;
    expiryDate?: string | null;
    documentUrl?: string;
    verificationStatus: VerificationStatus;
    verifiedDate?: string;
    failureReason?: string;
    createdAt: string;
    updatedAt: string;
}

// ============================================
// Verification Types
// ============================================

export interface VerificationRequest {
    id: string;
    certificationId: string;
    userId: string;
    status: 'submitted' | 'payment_confirmed' | 'in_review' | 'awaiting_info' | 'completed';
    result?: 'verified' | 'failed';
    assignedAdminId?: string;
    submittedAt: string;
    completedAt?: string;
    failureReason?: string;
    timeline: VerificationTimelineEvent[];
    adminNotes?: AdminNote[];
}

export interface VerificationTimelineEvent {
    step: string;
    label: string;
    completedAt: string | null;
}

export interface AdminNote {
    id: string;
    adminId: string;
    adminName: string;
    content: string;
    createdAt: string;
}

// Verification Queue Item
export interface VerificationQueueItem {
    certification: Certification;
    professional: Professional;
    submittedAt: Date;
}

// ============================================
// Work Experience Types
// ============================================

export interface WorkExperience {
    id: string;
    userId: string;
    company: string;
    role: string;
    startDate: string;
    endDate?: string | null;
    isCurrent: boolean;
    location?: string;
    description?: string;
}

// ============================================
// Education Types
// ============================================

export interface Education {
    id: string;
    userId: string;
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startYear: number;
    endYear?: number;
}

// ============================================
// Transaction Types
// ============================================

export type PaymentStatus = "pending" | "successful" | "failed";

export interface Transaction {
    id: string;
    userId: string;
    type: 'verification' | 'subscription' | 'bundle';
    amount: number;
    currency: 'NGN';
    status: PaymentStatus;
    reference: string;
    description: string;
    createdAt: string;
}

export interface Payment {
    id: string;
    professionalId: string;
    certificationId: string;
    amount: number;
    currency: "NGN";
    reference: string;
    status: PaymentStatus;
    paystackReference?: string;
    paidAt?: Date;
    createdAt: Date;
}

// ============================================
// Admin Types
// ============================================

export interface AdminUser {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'super_admin';
    avatar?: string;
    permissions?: string[];
}

export interface Admin extends User {
    name: string;
    permissions: string[];
}

// ============================================
// Trust Score Types
// ============================================

export interface TrustScore {
    score: number;
    level: "high" | "medium" | "low";
    history: {
        date: Date;
        score: number;
        reason: string;
    }[];
}

// ============================================
// Form Types
// ============================================

export interface RegisterFormData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    password: string;
    confirmPassword: string;
    linkedInUrl?: string;
    agreeToTerms: boolean;
}

export interface LoginFormData {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface CertificationFormData {
    title: string;
    issuingOrganization: string;
    issueDate: string;
    expiryDate?: string;
    credentialId: string;
    document: File;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// ============================================
// Constants
// ============================================

export const CERTIFICATION_TYPES = [
    {
        category: "APICS/ASCM",
        certifications: [
            { id: "cscp", name: "CSCP - Certified Supply Chain Professional", issuingBody: "APICS/ASCM" },
            { id: "cpim", name: "CPIM - Certified in Planning and Inventory Management", issuingBody: "APICS/ASCM" },
            { id: "cltd", name: "CLTD - Certified in Logistics, Transportation and Distribution", issuingBody: "APICS/ASCM" },
            { id: "ctsc", name: "CTSC - Certified in Transformation for Supply Chain", issuingBody: "APICS/ASCM" },
        ]
    },
    {
        category: "CIPS",
        certifications: [
            { id: "cips3", name: "CIPS Level 3 - Advanced Certificate", issuingBody: "CIPS" },
            { id: "cips4", name: "CIPS Level 4 - Diploma", issuingBody: "CIPS" },
            { id: "cips5", name: "CIPS Level 5 - Advanced Diploma", issuingBody: "CIPS" },
            { id: "cips6", name: "CIPS Level 6 - Professional Diploma", issuingBody: "CIPS" },
        ]
    },
    {
        category: "ISM",
        certifications: [
            { id: "cpsm", name: "CPSM - Certified Professional in Supply Management", issuingBody: "ISM" },
            { id: "csm", name: "CSM - Certified Supply Manager", issuingBody: "ISM" },
        ]
    },
    {
        category: "PMI",
        certifications: [
            { id: "pmp", name: "PMP - Project Management Professional", issuingBody: "PMI" },
            { id: "capm", name: "CAPM - Certified Associate in Project Management", issuingBody: "PMI" },
            { id: "pgmp", name: "PgMP - Program Management Professional", issuingBody: "PMI" },
        ]
    },
    {
        category: "Six Sigma",
        certifications: [
            { id: "lssyb", name: "Lean Six Sigma Yellow Belt", issuingBody: "ASQ/IASSC" },
            { id: "lssgb", name: "Lean Six Sigma Green Belt", issuingBody: "ASQ/IASSC" },
            { id: "lssbb", name: "Lean Six Sigma Black Belt", issuingBody: "ASQ/IASSC" },
        ]
    },
    {
        category: "Logistics & Transportation",
        certifications: [
            { id: "ctl", name: "CTL - Certification in Transportation and Logistics", issuingBody: "ASCM" },
            { id: "cclp", name: "CCLP - Certified in Logistics, Transport & Distribution", issuingBody: "CILT" },
        ]
    },
];

export const NIGERIAN_STATES = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa",
    "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo",
    "Ekiti", "Enugu", "FCT", "Gombe", "Imo", "Jigawa", "Kaduna",
    "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa",
    "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers",
    "Sokoto", "Taraba", "Yobe", "Zamfara"
];

export const INDUSTRIES = [
    "Oil & Gas",
    "FMCG / Consumer Goods",
    "Manufacturing",
    "Logistics / 3PL",
    "Telecommunications",
    "Banking & Financial Services",
    "Pharmaceuticals",
    "Aviation",
    "Retail",
    "Construction",
    "Automotive",
    "Healthcare",
    "Technology",
    "Agriculture",
    "Real Estate",
    "Hospitality",
    "Education",
    "Government / Public Sector",
];

export const JOB_ROLES = [
    "Supply Chain Manager",
    "Procurement Manager",
    "Logistics Manager",
    "Operations Manager",
    "Warehouse Manager",
    "Demand Planning Manager",
    "Inventory Control Manager",
    "Distribution Manager",
    "Category Manager",
    "Strategic Sourcing Manager",
    "Supply Chain Analyst",
    "Procurement Specialist",
    "Logistics Coordinator",
    "Supply Chain Director",
    "Chief Procurement Officer",
    "VP of Operations",
];

export const EXPERIENCE_LEVELS = [
    "Less than 1 year",
    "1-3 years",
    "3-5 years",
    "5-10 years",
    "10-15 years",
    "15+ years"
];

export const SUPPLY_CHAIN_SKILLS = [
    "Procurement",
    "Inventory Management",
    "S&OP (Sales & Operations Planning)",
    "Demand Planning",
    "Forecasting",
    "Supplier Relationship Management",
    "Contract Negotiation",
    "SAP",
    "Oracle",
    "Microsoft Dynamics",
    "Warehouse Management Systems (WMS)",
    "Transportation Management Systems (TMS)",
    "Lean Manufacturing",
    "Six Sigma",
    "Process Improvement",
    "Data Analysis",
    "ERP Systems",
    "Vendor Management",
    "Cost Reduction",
    "Risk Management",
    "Quality Assurance",
    "Project Management",
];

export const VERIFICATION_STATUS_CONFIG: Record<VerificationStatus, { label: string; color: string; icon: string }> = {
    unverified: { label: "Unverified", color: "slate", icon: "Circle" },
    pending: { label: "Pending", color: "amber", icon: "Clock" },
    in_review: { label: "In Review", color: "blue", icon: "Eye" },
    verified: { label: "Verified", color: "emerald", icon: "CheckCircle" },
    failed: { label: "Failed", color: "red", icon: "XCircle" },
    expired: { label: "Expired", color: "orange", icon: "AlertTriangle" }
};

export const PRICING = {
    singleVerification: 20000,
    bundle3: 50000,
    bundle5: 75000,
    verifiedPro: {
        monthly: 4500,
        annually: 45000
    }
};

export const ROUTES = {
    home: "/",
    about: "/about",
    pricing: "/pricing",
    contactUs: "/contact",
    login: "/login",
    register: "/register",
    dashboard: "/dashboard",
    profile: "/dashboard/profile",
    certifications: "/dashboard/certifications",
    verification: "/dashboard/verification",
    billing: "/dashboard/billing",
    settings: "/dashboard/settings",
    publicProfile: (username: string) => `/p/${username}`,
    admin: {
        dashboard: "/admin",
        verifications: "/admin/verifications",
        verificationDetail: (id: string) => `/admin/verifications/${id}`,
        users: "/admin/users",
        transactions: "/admin/transactions",
        settings: "/admin/settings",
    }
};
