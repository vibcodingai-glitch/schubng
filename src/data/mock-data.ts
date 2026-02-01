/**
 * Mock Data for ChainCred Platform
 * 
 * Comprehensive test data with Nigerian context for development and testing.
 * Includes users, certifications, verification requests, transactions, and admin users.
 */

import {
    User,
    Professional,
    Certification,
    VerificationRequest,
    Transaction,
    AdminUser,
    WorkExperience,
    Education
} from "@/types";

// ============================================
// Sample Users
// ============================================

export const mockUsers: User[] = [
    {
        id: "usr_1",
        email: "emeka.okafor@shelltng.com",
        firstName: "Emeka",
        lastName: "Okafor",
        phone: "+234 803 456 7890",
        headline: "Supply Chain Director | CSCP | Leading End-to-End Supply Chain Transformation",
        summary: "Results-driven Supply Chain Director with 12+ years of experience optimizing supply chain operations across Oil & Gas and FMCG sectors in Nigeria. CSCP certified with proven track record in S&OP, demand planning, and cost optimization.",
        profilePhoto: "https://i.pravatar.cc/150?u=emeka",
        location: {
            state: "Lagos",
            city: "Lekki"
        },
        linkedInUrl: "https://linkedin.com/in/emekaokafor",
        currentRole: "Supply Chain Director",
        currentCompany: "Shell Nigeria",
        industry: "Oil & Gas",
        yearsOfExperience: "10-15 years",
        plan: "verified_pro",
        trustScore: 85,
        isProfilePublic: true,
        createdAt: "2024-01-15T08:30:00Z",
        updatedAt: "2024-11-20T14:22:00Z",
        lastLoginAt: "2024-11-28T07:15:00Z"
    },
    {
        id: "usr_2",
        email: "ada.nwachukwu@unilever.ng",
        firstName: "Ada",
        lastName: "Nwachukwu",
        phone: "+234 810 234 5678",
        headline: "Procurement Manager | CIPS Level 6 | Strategic Sourcing Specialist",
        summary: "Passionate procurement professional with expertise in strategic sourcing, vendor management, and contract negotiation. CIPS Level 6 certified with strong track record in FMCG sector.",
        profilePhoto: "https://i.pravatar.cc/150?u=ada",
        location: {
            state: "Lagos",
            city: "Victoria Island"
        },
        linkedInUrl: "https://linkedin.com/in/adanwachukwu",
        currentRole: "Procurement Manager",
        currentCompany: "Unilever Nigeria",
        industry: "FMCG / Consumer Goods",
        yearsOfExperience: "5-10 years",
        plan: "verified_pro",
        trustScore: 78,
        isProfilePublic: true,
        createdAt: "2024-02-10T10:15:00Z",
        updatedAt: "2024-11-25T16:40:00Z",
        lastLoginAt: "2024-11-27T09:30:00Z"
    },
    {
        id: "usr_3",
        email: "chidi.ugwu@dangote.com",
        firstName: "Chidi",
        lastName: "Ugwu",
        phone: "+234 805 678 9012",
        headline: "Logistics Manager | Future Supply Chain Leader",
        summary: "Dynamic logistics professional managing warehouse operations and distribution networks across Nigeria. Focused on operational excellence and continuous improvement.",
        location: {
            state: "Lagos",
            city: "Apapa"
        },
        currentRole: "Logistics Manager",
        currentCompany: "Dangote Group",
        industry: "Manufacturing",
        yearsOfExperience: "3-5 years",
        plan: "free",
        trustScore: 62,
        isProfilePublic: true,
        createdAt: "2024-05-22T11:00:00Z",
        updatedAt: "2024-11-15T13:20:00Z",
        lastLoginAt: "2024-11-26T08:45:00Z"
    },
    {
        id: "usr_4",
        email: "fatima.abubakar@mtn.ng",
        firstName: "Fatima",
        lastName: "Abubakar",
        phone: "+234 806 789 0123",
        headline: "Demand Planning Manager | S&OP Expert | PMP",
        summary: "Strategic demand planner with deep expertise in forecasting, S&OP, and supply chain analytics. PMP certified with experience in telecommunications and technology sectors.",
        profilePhoto: "https://i.pravatar.cc/150?u=fatima",
        location: {
            state: "FCT",
            city: "Abuja"
        },
        linkedInUrl: "https://linkedin.com/in/fatimaabubakar",
        currentRole: "Demand Planning Manager",
        currentCompany: "MTN Nigeria",
        industry: "Telecommunications",
        yearsOfExperience: "5-10 years",
        plan: "verified_pro",
        trustScore: 81,
        isProfilePublic: true,
        createdAt: "2024-03-05T09:45:00Z",
        updatedAt: "2024-11-22T10:15:00Z"
    },
    {
        id: "usr_5",
        email: "olumide.balogun@nestle.com",
        firstName: "Olumide",
        lastName: "Balogun",
        phone: "+234 807 890 1234",
        headline: "Operations Manager | Lean Six Sigma Green Belt",
        summary: "Process improvement champion driving operational efficiency through Lean Six Sigma methodologies. Experience in FMCG manufacturing and supply chain operations.",
        location: {
            state: "Ogun",
            city: "Sagamu"
        },
        currentRole: "Operations Manager",
        currentCompany: "Nestlé Nigeria",
        industry: "FMCG / Consumer Goods",
        yearsOfExperience: "3-5 years",
        plan: "free",
        trustScore: 58,
        isProfilePublic: false,
        createdAt: "2024-06-10T12:30:00Z",
        updatedAt: "2024-11-18T15:50:00Z"
    },
    {
        id: "usr_6",
        email: "ngozi.eze@ecobank.com",
        firstName: "Ngozi",
        lastName: "Eze",
        phone: "+234 808 901 2345",
        headline: "Procurement Specialist | Building Financial Services Supply Chain",
        summary: "Procurement specialist in banking sector with focus on IT procurement, vendor management, and contract administration.",
        profilePhoto: "https://i.pravatar.cc/150?u=ngozi",
        location: {
            state: "Lagos",
            city: "Ikoyi"
        },
        currentRole: "Procurement Specialist",
        currentCompany: "Ecobank Nigeria",
        industry: "Banking & Financial Services",
        yearsOfExperience: "1-3 years",
        plan: "free",
        trustScore: 45,
        isProfilePublic: true,
        createdAt: "2024-08-01T14:00:00Z",
        updatedAt: "2024-11-20T11:30:00Z"
    },
    {
        id: "usr_7",
        email: "ibrahim.mohammed@glo.com",
        firstName: "Ibrahim",
        lastName: "Mohammed",
        phone: "+234 809 012 3456",
        headline: "Supply Chain Analyst | Data-Driven Decision Making",
        summary: "Analytical supply chain professional leveraging data analytics and ERP systems to drive supply chain optimization and cost savings.",
        location: {
            state: "Kano",
            city: "Kano"
        },
        currentRole: "Supply Chain Analyst",
        currentCompany: "Globacom",
        industry: "Telecommunications",
        yearsOfExperience: "1-3 years",
        plan: "free",
        trustScore: 51,
        isProfilePublic: true,
        createdAt: "2024-07-15T10:20:00Z",
        updatedAt: "2024-11-19T09:45:00Z"
    },
    {
        id: "usr_8",
        email: "blessing.okonkwo@guinness.com",
        firstName: "Blessing",
        lastName: "Okonkwo",
        phone: "+234 810 123 4567",
        headline: "Warehouse Manager | Inventory Control Expert",
        summary: "Experienced warehouse manager specializing in inventory control, warehouse optimization, and team leadership in beverage manufacturing.",
        profilePhoto: "https://i.pravatar.cc/150?u=blessing",
        location: {
            state: "Anambra",
            city: "Onitsha"
        },
        currentRole: "Warehouse Manager",
        currentCompany: "Guinness Nigeria",
        industry: "FMCG / Consumer Goods",
        yearsOfExperience: "5-10 years",
        plan: "free",
        trustScore: 64,
        isProfilePublic: false,
        createdAt: "2024-04-20T08:15:00Z",
        updatedAt: "2024-11-21T14:00:00Z"
    },
    {
        id: "usr_9",
        email: "tunde.adeyemi@chevron.com",
        firstName: "Tunde",
        lastName: "Adeyemi",
        phone: "+234 811 234 5678",
        headline: "Chief Procurement Officer | CPSM | Strategic Sourcing Leader",
        summary: "Senior procurement executive with 15+ years experience leading procurement transformation in Oil & Gas. CPSM certified with expertise in strategic sourcing and supplier development.",
        profilePhoto: "https://i.pravatar.cc/150?u=tunde",
        location: {
            state: "Rivers",
            city: "Port Harcourt"
        },
        linkedInUrl: "https://linkedin.com/in/tundeadeyemi",
        currentRole: "Chief Procurement Officer",
        currentCompany: "Chevron Nigeria",
        industry: "Oil & Gas",
        yearsOfExperience: "15+ years",
        plan: "verified_pro",
        trustScore: 92,
        isProfilePublic: true,
        createdAt: "2023-11-10T07:00:00Z",
        updatedAt: "2024-11-27T16:30:00Z",
        lastLoginAt: "2024-11-28T06:00:00Z"
    },
    {
        id: "usr_10",
        email: "chioma.nnamdi@dhl.com",
        firstName: "Chioma",
        lastName: "Nnamdi",
        phone: "+234 812 345 6789",
        headline: "Distribution Manager | Last-Mile Delivery Optimization",
        summary: "Distribution expert focused on last-mile delivery optimization and route planning. Experience in logistics and 3PL operations.",
        location: {
            state: "Lagos",
            city: "Ikeja"
        },
        currentRole: "Distribution Manager",
        currentCompany: "DHL Nigeria",
        industry: "Logistics / 3PL",
        yearsOfExperience: "3-5 years",
        plan: "free",
        trustScore: 55,
        isProfilePublic: true,
        createdAt: "2024-09-05T13:45:00Z",
        updatedAt: "2024-11-23T12:10:00Z"
    }
];

// ============================================
// Sample Certifications
// ============================================

export const mockCertifications: Certification[] = [
    {
        id: "cert_1",
        userId: "usr_1",
        type: "CSCP",
        issuingBody: "APICS/ASCM",
        credentialId: "CSCP-2023-045892",
        issueDate: "2023-03-15",
        expiryDate: null,
        documentUrl: "https://placehold.co/600x800/e2e8f0/475569?text=CSCP+Certificate",
        verificationStatus: "verified",
        verifiedDate: "2023-04-20",
        createdAt: "2023-03-16T10:00:00Z",
        updatedAt: "2023-04-20T14:30:00Z"
    },
    {
        id: "cert_2",
        userId: "usr_2",
        type: "CIPS Level 6",
        issuingBody: "CIPS",
        credentialId: "CIPS6-2022-789012",
        issueDate: "2022-11-10",
        expiryDate: null,
        documentUrl: "https://placehold.co/600x800/e2e8f0/475569?text=CIPS+Certificate",
        verificationStatus: "verified",
        verifiedDate: "2022-12-05",
        createdAt: "2022-11-12T09:15:00Z",
        updatedAt: "2022-12-05T11:45:00Z"
    },
    {
        id: "cert_3",
        userId: "usr_3",
        type: "CLTD",
        issuingBody: "APICS/ASCM",
        credentialId: "CLTD-2024-123456",
        issueDate: "2024-06-01",
        expiryDate: null,
        documentUrl: "https://placehold.co/600x800/e2e8f0/475569?text=CLTD+Certificate",
        verificationStatus: "pending",
        createdAt: "2024-06-05T12:00:00Z",
        updatedAt: "2024-06-05T12:00:00Z"
    },
    {
        id: "cert_4",
        userId: "usr_4",
        type: "PMP",
        issuingBody: "PMI",
        credentialId: "PMP-2023-567890",
        issueDate: "2023-08-20",
        expiryDate: "2026-08-20",
        documentUrl: "https://placehold.co/600x800/e2e8f0/475569?text=PMP+Certificate",
        verificationStatus: "verified",
        verifiedDate: "2023-09-10",
        createdAt: "2023-08-22T14:30:00Z",
        updatedAt: "2023-09-10T10:20:00Z"
    },
    {
        id: "cert_5",
        userId: "usr_5",
        type: "Lean Six Sigma Green Belt",
        issuingBody: "ASQ/IASSC",
        credentialId: "LSSGB-2024-234567",
        issueDate: "2024-02-14",
        expiryDate: null,
        documentUrl: "https://placehold.co/600x800/e2e8f0/475569?text=LSS+Certificate",
        verificationStatus: "in_review",
        createdAt: "2024-02-20T11:00:00Z",
        updatedAt: "2024-02-25T09:15:00Z"
    },
    {
        id: "cert_6",
        userId: "usr_1",
        type: "CPIM",
        issuingBody: "APICS/ASCM",
        credentialId: "CPIM-2021-345678",
        issueDate: "2021-05-10",
        expiryDate: null,
        documentUrl: "https://placehold.co/600x800/e2e8f0/475569?text=CPIM+Certificate",
        verificationStatus: "verified",
        verifiedDate: "2021-06-15",
        createdAt: "2021-05-12T08:30:00Z",
        updatedAt: "2021-06-15T15:00:00Z"
    },
    {
        id: "cert_7",
        userId: "usr_9",
        type: "CPSM",
        issuingBody: "ISM",
        credentialId: "CPSM-2020-901234",
        issueDate: "2020-09-05",
        expiryDate: null,
        documentUrl: "https://placehold.co/600x800/e2e8f0/475569?text=CPSM+Certificate",
        verificationStatus: "verified",
        verifiedDate: "2020-10-01",
        createdAt: "2020-09-07T10:00:00Z",
        updatedAt: "2020-10-01T12:30:00Z"
    },
    {
        id: "cert_8",
        userId: "usr_6",
        type: "CIPS Level 3",
        issuingBody: "CIPS",
        credentialId: "CIPS3-2024-456789",
        issueDate: "2024-10-15",
        expiryDate: null,
        documentUrl: "https://placehold.co/600x800/e2e8f0/475569?text=CIPS+L3+Certificate",
        verificationStatus: "unverified",
        createdAt: "2024-10-18T09:00:00Z",
        updatedAt: "2024-10-18T09:00:00Z"
    },
    {
        id: "cert_9",
        userId: "usr_7",
        type: "CSCP",
        issuingBody: "APICS/ASCM",
        credentialId: "CSCP-2024-789012",
        issueDate: "2024-11-01",
        expiryDate: null,
        documentUrl: "https://placehold.co/600x800/e2e8f0/475569?text=CSCP+Certificate",
        verificationStatus: "failed",
        failureReason: "Credential ID could not be verified with issuing body. Please check the ID and resubmit.",
        createdAt: "2024-11-05T13:20:00Z",
        updatedAt: "2024-11-10T16:45:00Z"
    },
    {
        id: "cert_10",
        userId: "usr_2",
        type: "CIPS Level 4",
        issuingBody: "CIPS",
        credentialId: "CIPS4-2020-012345",
        issueDate: "2020-06-20",
        expiryDate: "2023-06-20",
        documentUrl: "https://placehold.co/600x800/e2e8f0/475569?text=CIPS+L4+Certificate",
        verificationStatus: "expired",
        verifiedDate: "2020-07-15",
        createdAt: "2020-06-22T11:30:00Z",
        updatedAt: "2023-06-21T00:00:00Z"
    },
];

// ============================================
// Sample Transactions
// ============================================

export const mockTransactions: Transaction[] = [
    {
        id: "txn_1",
        userId: "usr_1",
        type: "verification",
        amount: 20000,
        currency: "NGN",
        status: "successful",
        reference: "TXN-2023041512345",
        description: "Certification Verification - CSCP",
        createdAt: "2023-04-15T10:30:00Z"
    },
    {
        id: "txn_2",
        userId: "usr_2",
        type: "subscription",
        amount: 45000,
        currency: "NGN",
        status: "successful",
        reference: "TXN-2024021014567",
        description: "Verified Pro - Annual Subscription",
        createdAt: "2024-02-10T14:20:00Z"
    },
    {
        id: "txn_3",
        userId: "usr_4",
        type: "verification",
        amount: 20000,
        currency: "NGN",
        status: "successful",
        reference: "TXN-2023082015678",
        description: "Certification Verification - PMP",
        createdAt: "2023-08-20T16:45:00Z"
    },
    {
        id: "txn_4",
        userId: "usr_9",
        type: "bundle",
        amount: 75000,
        currency: "NGN",
        status: "successful",
        reference: "TXN-2023110712890",
        description: "5 Verification Credits Bundle",
        createdAt: "2023-11-07T09:15:00Z"
    },
    {
        id: "txn_5",
        userId: "usr_3",
        type: "verification",
        amount: 20000,
        currency: "NGN",
        status: "pending",
        reference: "TXN-2024060513456",
        description: "Certification Verification - CLTD",
        createdAt: "2024-06-05T12:00:00Z"
    }
];

// ============================================
// Admin Users
// ============================================

export const mockAdminUsers: AdminUser[] = [
    {
        id: "adm_1",
        email: "john.admin@chaincred.ng",
        name: "John Adebayo",
        role: "super_admin",
        avatar: "https://i.pravatar.cc/150?u=johnadmin"
    },
    {
        id: "adm_2",
        email: "sarah.reviewer@chaincred.ng",
        name: "Sarah Okoye",
        role: "admin",
        avatar: "https://i.pravatar.cc/150?u=sarahadmin"
    }
];

// ============================================
// Work Experience Samples
// ============================================

export const mockWorkExperiences: WorkExperience[] = [
    {
        id: "exp_1",
        userId: "usr_1",
        company: "Shell Nigeria",
        role: "Supply Chain Director",
        startDate: "2020-01",
        endDate: null,
        isCurrent: true,
        location: "Lagos, Nigeria",
        description: "Leading end-to-end supply chain operations for the Nigerian market, managing a team of 35+ professionals."
    },
    {
        id: "exp_2",
        userId: "usr_1",
        company: "Chevron Nigeria",
        role: "Supply Chain Manager",
        startDate: "2015-06",
        endDate: "2019-12",
        isCurrent: false,
        location: "Port Harcourt, Nigeria",
        description: "Managed procurement and logistics operations for upstream oil and gas projects."
    }
];

// ============================================
// Education Samples
// ============================================

export const mockEducation: Education[] = [
    {
        id: "edu_1",
        userId: "usr_1",
        institution: "University of Lagos",
        degree: "Bachelor of Science",
        fieldOfStudy: "Industrial Chemistry",
        startYear: 2007,
        endYear: 2011
    },
    {
        id: "edu_2",
        userId: "usr_2",
        institution: "Lagos Business School",
        degree: "Master of Business Administration",
        fieldOfStudy: "Supply Chain Management",
        startYear: 2018,
        endYear: 2020
    }
];

// Helper function to get user by ID
export function getUserById(id: string): User | undefined {
    return mockUsers.find(user => user.id === id);
}

// Helper function to get certifications by user ID
export function getCertificationsByUserId(userId: string): Certification[] {
    return mockCertifications.filter(cert => cert.userId === userId);
}

// Helper function to get transactions by user ID
export function getTransactionsByUserId(userId: string): Transaction[] {
    return mockTransactions.filter(txn => txn.userId === userId);
}
