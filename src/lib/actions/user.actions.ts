"use server";

import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { profileUpdateSchema, workExperienceSchema, educationSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { calculateTrustScore, getVerificationSummary, updateUserTrustScore, type TrustScoreBreakdown, type VerificationSummary } from "@/lib/trust-score";

export async function getCurrentUser() {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) return null;

    try {
        const user = await prisma.user.findUnique({
            where: { id: authUser.id },
            include: {
                education: true,
                workExperience: true,
                certifications: true,
            },
        });
        return user;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}

export async function updateUserProfile(data: any) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) return { error: "Unauthorized" };

    const parsed = profileUpdateSchema.safeParse(data);

    if (!parsed.success) {
        console.error(parsed.error);
        return { error: "Invalid data format" };
    }

    try {
        const {
            firstName, lastName, phoneNumber, linkedInUrl,
            headline, summary, state, city, skills
        } = data;

        const location = city && state ? `${city}, ${state}` : data.location;

        await prisma.user.update({
            where: { id: authUser.id },
            data: {
                firstName,
                lastName,
                phone: phoneNumber,
                linkedinUrl: linkedInUrl,
                headline,
                summary,
                location,
                skills,
            },
        });

        revalidatePath("/dashboard/profile");
        return { success: "Profile updated successfully" };
    } catch (error) {
        console.error("Error updating profile:", error);
        return { error: "Failed to update profile" };
    }
}

export async function uploadProfilePhoto(formData: FormData) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {

        return { error: "Unauthorized" };
    }

    const file = formData.get("file") as File;

    if (!file || file.size === 0) {

        return { error: "No file provided" };
    }



    if (file.size > 2 * 1024 * 1024) {
        return { error: "File size must be less than 2MB" };
    }

    try {
        // Convert File to ArrayBuffer for server-side upload
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const fileExt = file.name.split('.').pop() || 'png';
        const fileName = `${authUser.id}/avatar-${Date.now()}.${fileExt}`;



        // Upload to 'avatars' bucket
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: true,
            });

        if (uploadError) {
            console.error("uploadProfilePhoto: Supabase upload error:", uploadError);
            return { error: `Upload failed: ${uploadError.message}` };
        }



        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);



        // Update user profile
        await prisma.user.update({
            where: { id: authUser.id },
            data: { profilePhotoUrl: publicUrl }
        });

        revalidatePath("/dashboard/profile");
        return { success: "Photo updated successfully", url: publicUrl };

    } catch (error: any) {
        console.error("uploadProfilePhoto: Caught error:", error);
        return { error: error?.message || "Failed to upload photo" };
    }
}

export async function addWorkExperience(data: any) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) return { error: "Unauthorized" };

    const parsed = workExperienceSchema.safeParse(data);
    if (!parsed.success) return { error: "Invalid data" };

    try {
        const { company, role, location, startDate, endDate, isCurrent, description } = parsed.data;

        await prisma.workExperience.create({
            data: {
                userId: authUser.id,
                company,
                role,
                location: location || null,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                isCurrent,
                description: description || null,
            },
        });

        revalidatePath("/dashboard/profile");
        return { success: "Experience added successfully" };
    } catch (error) {
        console.error("Error adding experience:", error);
        return { error: "Failed to add experience" };
    }
}

export async function deleteWorkExperience(id: string) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) return { error: "Unauthorized" };

    try {
        await prisma.workExperience.delete({
            where: { id, userId: authUser.id }, // Ensure ownership
        });

        revalidatePath("/dashboard/profile");
        return { success: "Experience deleted successfully" };
    } catch (error) {
        console.error("Error deleting experience:", error);
        return { error: "Failed to delete experience" };
    }
}

export async function addEducation(data: any) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) return { error: "Unauthorized" };

    const parsed = educationSchema.safeParse(data);
    if (!parsed.success) return { error: "Invalid data" };

    try {
        const { institution, degree, fieldOfStudy, startYear, endYear } = parsed.data;

        await prisma.education.create({
            data: {
                userId: authUser.id,
                institution,
                degree,
                fieldOfStudy,
                startYear,
                endYear,
            },
        });

        revalidatePath("/dashboard/profile");
        return { success: "Education added successfully" };
    } catch (error) {
        console.error("Error adding education:", error);
        return { error: "Failed to add education" };
    }
}

export async function deleteEducation(id: string) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) return { error: "Unauthorized" };

    try {
        await prisma.education.delete({
            where: { id, userId: authUser.id }, // Ensure ownership
        });

        revalidatePath("/dashboard/profile");
        return { success: "Education deleted successfully" };
    } catch (error) {
        console.error("Error deleting education:", error);
        return { error: "Failed to delete education" };
    }
}

export async function searchUsers(query: string) {
    if (!query || query.trim().length === 0) return [];

    try {
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { firstName: { contains: query, mode: 'insensitive' } },
                    { lastName: { contains: query, mode: 'insensitive' } },
                    { headline: { contains: query, mode: 'insensitive' } },
                    { currentRole: { contains: query, mode: 'insensitive' } },
                    { currentCompany: { contains: query, mode: 'insensitive' } },
                ],
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                headline: true,
                profilePhotoUrl: true,
                currentRole: true,
                currentCompany: true,
                trustScore: true,
                skills: true,
                email: true,
                industry: true,
                location: true,
            },
            take: 10,
        });
        return users;
    } catch (error) {
        console.error("Error searching users:", error);
        return [];
    }
}

export async function getPublicUserProfile(userId: string) {
    if (!userId) return null;
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                certifications: {
                    where: { status: "VERIFIED" },
                    orderBy: { issueDate: "desc" }
                },
                workExperience: {
                    orderBy: { startDate: "desc" }
                },
                education: {
                    orderBy: { startYear: "desc" }
                },
                _count: {
                    select: {
                        followers: true,
                        following: true
                    }
                }
            }
        });

        if (!user) return null;

        let isConnected = false;
        if (authUser) {
            const connection = await prisma.connection.findUnique({
                where: {
                    followerId_followingId: {
                        followerId: authUser.id,
                        followingId: userId
                    }
                }
            });
            isConnected = !!connection;
        }

        // Transform to the shape expected by PublicProfileClient
        return {
            username: user.id, // Using ID as username for now
            fullName: `${user.firstName} ${user.lastName}`,
            profilePhotoUrl: user.profilePhotoUrl,
            headline: user.headline || "",
            location: user.location || "",
            memberSince: user.createdAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            about: user.summary || "",
            isConnected,
            connectionsCount: user._count.followers,
            trustScore: {
                score: user.trustScore,
                level: user.trustScore > 80 ? "Excellent" : user.trustScore > 60 ? "Good" : "Growing",
                color: user.trustScore > 80 ? "text-blue-600" : "text-emerald-500",
                bg: user.trustScore > 80 ? "bg-blue-600" : "bg-emerald-500"
            },
            verified: user.plan === "VERIFIED_PRO", // or based on trust score
            certifications: user.certifications.map(c => ({
                id: c.id,
                name: c.title,
                issuer: c.issuingOrganization,
                issueDate: c.issueDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                expiryDate: c.expiryDate ? c.expiryDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : null,
                verified: c.status === "VERIFIED",
                logo: c.issuingOrganization.substring(0, 2).toUpperCase()
            })),
            experience: user.workExperience.map(e => ({
                id: e.id,
                title: e.role,
                company: e.company,
                duration: `${e.startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${e.isCurrent ? "Present" : e.endDate?.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
                location: e.location || "",
                description: e.description ? [e.description] : []
            })),
            education: user.education.map(e => ({
                id: e.id,
                degree: e.degree,
                field: e.fieldOfStudy,
                institution: e.institution,
                years: `${e.startYear} - ${e.endYear || "Present"}`
            })),
            skills: user.skills || [],
            contact: {
                email: user.isPublic ? user.email : "", // Respect privacy
                phone: user.isPublic ? user.phone : "",
                linkedin: user.linkedinUrl || "",
                public: user.isPublic
            }
        };

    } catch (error) {
        console.error("Error fetching public profile:", error);
        return null;
    }
}

export async function toggleConnection(targetUserId: string) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) return { error: "Unauthorized" };
    if (authUser.id === targetUserId) return { error: "Cannot connect with yourself" };

    try {
        const existingConnection = await prisma.connection.findUnique({
            where: {
                followerId_followingId: {
                    followerId: authUser.id,
                    followingId: targetUserId
                }
            }
        });

        if (existingConnection) {
            await prisma.connection.delete({
                where: {
                    followerId_followingId: {
                        followerId: authUser.id,
                        followingId: targetUserId
                    }
                }
            });
            revalidatePath(`/p/${targetUserId}`); // Invalidate path might not work with dynamic route ID if it was slug, but here it is ID? No, path is /p/[username] which uses ID in my implementation?
            // Actually the route is /p/[username]. If I'm passing ID as username, revalidatePath(`/p/${targetUserId}`) should work if targetUserId is what's in URL.
            // But wait, the public profile uses `params.username`. In my previous step `getPublicUserProfile` I treated `userId` as incoming `username`.
            return { success: true, isConnected: false };
        } else {
            await prisma.connection.create({
                data: {
                    followerId: authUser.id,
                    followingId: targetUserId
                }
            });
            revalidatePath(`/p/${targetUserId}`);
            return { success: true, isConnected: true };
        }
    } catch (error) {
        console.error("Error toggling connection:", error);
        return { error: "Failed to update connection" };
    }
}

export async function getSuggestedConnections(limit: number = 3) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) return [];

    try {
        // Get IDs of users already following
        const following = await prisma.connection.findMany({
            where: { followerId: authUser.id },
            select: { followingId: true }
        });
        const followingIds = following.map(f => f.followingId);

        // Add self to exclusion list
        followingIds.push(authUser.id);

        const suggestions = await prisma.user.findMany({
            where: {
                id: { notIn: followingIds }
            },
            take: limit,
            orderBy: { createdAt: "desc" }, // Newly joined users? Or random? Random is hard in prisma without raw query. Let's do desc created for now.
            select: {
                id: true,
                firstName: true,
                lastName: true,
                headline: true,
                profilePhotoUrl: true
            }
        });

        return suggestions;
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        return [];
    }
}

/**
 * Get the user's trust score breakdown
 */
export async function getUserTrustScoreBreakdown(userId?: string): Promise<TrustScoreBreakdown | null> {
    try {
        let targetUserId = userId;

        if (!targetUserId) {
            const supabase = await createClient();
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) return null;
            targetUserId = authUser.id;
        }

        return await calculateTrustScore(targetUserId);
    } catch (error) {
        console.error("Error getting trust score breakdown:", error);
        return null;
    }
}

/**
 * Get the user's verification summary
 */
export async function getUserVerificationSummary(userId?: string): Promise<VerificationSummary | null> {
    try {
        let targetUserId = userId;

        if (!targetUserId) {
            const supabase = await createClient();
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) return null;
            targetUserId = authUser.id;
        }

        return await getVerificationSummary(targetUserId);
    } catch (error) {
        console.error("Error getting verification summary:", error);
        return null;
    }
}

/**
 * Recalculate and update user's trust score
 */
export async function recalculateUserTrustScore(userId?: string): Promise<number | null> {
    try {
        let targetUserId = userId;

        if (!targetUserId) {
            const supabase = await createClient();
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) return null;
            targetUserId = authUser.id;
        }

        const newScore = await updateUserTrustScore(targetUserId);
        revalidatePath("/dashboard");
        revalidatePath(`/p/${targetUserId}`);
        return newScore;
    } catch (error) {
        console.error("Error recalculating trust score:", error);
        return null;
    }
}
