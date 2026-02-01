import prisma from "@/lib/prisma";

/**
 * Trust Score Calculation Logic
 * 
 * Components:
 * - Experience (WorkExperience): 35% when any experience is verified
 * - Education: 35% when any education is verified
 * - Certifications: 30% (only counted if user has certifications)
 * 
 * Rules:
 * 1. If user has no certifications, max score is 100% (Experience 35% + Education 35% + 30% bonus)
 * 2. If user uploads certifications but they're pending, score drops proportionally
 * 3. Each verified certification adds to the 30% pool
 */

export interface TrustScoreBreakdown {
    totalScore: number;
    experienceScore: number;
    experienceVerified: boolean;
    educationScore: number;
    educationVerified: boolean;
    certificationScore: number;
    certificationsVerified: number;
    certificationsTotal: number;
    certificationsPending: number;
    hasNoCertifications: boolean;
    level: "Building" | "Emerging" | "Established" | "Trusted" | "Elite";
}

export function getTrustLevel(score: number): TrustScoreBreakdown["level"] {
    if (score >= 90) return "Elite";
    if (score >= 75) return "Trusted";
    if (score >= 50) return "Established";
    if (score >= 25) return "Emerging";
    return "Building";
}

export async function calculateTrustScore(userId: string): Promise<TrustScoreBreakdown> {
    // Fetch user data with related records
    const [experiences, education, certifications] = await Promise.all([
        prisma.workExperience.findMany({
            where: { userId },
            select: { id: true, status: true }
        }),
        prisma.education.findMany({
            where: { userId },
            select: { id: true, status: true }
        }),
        prisma.certification.findMany({
            where: { userId },
            select: { id: true, status: true }
        })
    ]);

    // Calculate Experience Score (35%)
    const hasExperience = experiences.length > 0;
    const experienceVerified = experiences.some(exp => exp.status === "VERIFIED");
    const experienceScore = experienceVerified ? 35 : 0;

    // Calculate Education Score (35%)
    const hasEducation = education.length > 0;
    const educationVerified = education.some(edu => edu.status === "VERIFIED");
    const educationScore = educationVerified ? 35 : 0;

    // Calculate Certification Score (30%)
    const hasNoCertifications = certifications.length === 0;
    const certificationsVerified = certifications.filter(cert => cert.status === "VERIFIED").length;
    const certificationsPending = certifications.filter(cert => cert.status === "PENDING").length;
    const certificationsTotal = certifications.length;

    let certificationScore = 0;

    if (hasNoCertifications) {
        // If no certifications uploaded, give bonus 30% (only if experience and education are verified)
        if (experienceVerified && educationVerified) {
            certificationScore = 30;
        } else if (experienceVerified || educationVerified) {
            // Partial bonus - give 15% if at least one is verified
            certificationScore = 15;
        }
    } else {
        // Calculate certification score based on verified vs total
        if (certificationsTotal > 0) {
            // Each verified certification contributes to the 30% pool
            certificationScore = Math.round((certificationsVerified / certificationsTotal) * 30);
        }
    }

    const totalScore = experienceScore + educationScore + certificationScore;
    const level = getTrustLevel(totalScore);

    return {
        totalScore,
        experienceScore,
        experienceVerified,
        educationScore,
        educationVerified,
        certificationScore,
        certificationsVerified,
        certificationsTotal,
        certificationsPending,
        hasNoCertifications,
        level
    };
}

/**
 * Update user's trust score in the database
 */
export async function updateUserTrustScore(userId: string): Promise<number> {
    const breakdown = await calculateTrustScore(userId);

    await prisma.user.update({
        where: { id: userId },
        data: { trustScore: breakdown.totalScore }
    });

    return breakdown.totalScore;
}

/**
 * Get verification status summary for a user
 */
export interface VerificationSummary {
    experience: {
        total: number;
        verified: number;
        pending: number;
        items: Array<{
            id: string;
            company: string;
            role: string;
            status: string;
        }>;
    };
    education: {
        total: number;
        verified: number;
        pending: number;
        items: Array<{
            id: string;
            institution: string;
            degree: string;
            status: string;
        }>;
    };
    certifications: {
        total: number;
        verified: number;
        pending: number;
        items: Array<{
            id: string;
            title: string;
            issuingOrganization: string;
            status: string;
        }>;
    };
}

export async function getVerificationSummary(userId: string): Promise<VerificationSummary> {
    const [experiences, education, certifications] = await Promise.all([
        prisma.workExperience.findMany({
            where: { userId },
            select: { id: true, company: true, role: true, status: true }
        }),
        prisma.education.findMany({
            where: { userId },
            select: { id: true, institution: true, degree: true, status: true }
        }),
        prisma.certification.findMany({
            where: { userId },
            select: { id: true, title: true, issuingOrganization: true, status: true }
        })
    ]);

    return {
        experience: {
            total: experiences.length,
            verified: experiences.filter(e => e.status === "VERIFIED").length,
            pending: experiences.filter(e => e.status === "PENDING").length,
            items: experiences.map(e => ({
                id: e.id,
                company: e.company,
                role: e.role,
                status: e.status
            }))
        },
        education: {
            total: education.length,
            verified: education.filter(e => e.status === "VERIFIED").length,
            pending: education.filter(e => e.status === "PENDING").length,
            items: education.map(e => ({
                id: e.id,
                institution: e.institution,
                degree: e.degree,
                status: e.status
            }))
        },
        certifications: {
            total: certifications.length,
            verified: certifications.filter(c => c.status === "VERIFIED").length,
            pending: certifications.filter(c => c.status === "PENDING").length,
            items: certifications.map(c => ({
                id: c.id,
                title: c.title,
                issuingOrganization: c.issuingOrganization,
                status: c.status
            }))
        }
    };
}
