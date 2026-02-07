"use server";

import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Promote a user to Admin role
 * Can only be performed by an existing Admin
 */
export async function promoteUserToAdmin(userId: string) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
        return { error: "Unauthorized" };
    }

    try {
        // Verify current user is an admin
        const currentUser = await prisma.user.findUnique({
            where: { id: authUser.id },
            select: { role: true }
        });

        if (currentUser?.role !== "ADMIN") {
            return { error: "Permission denied. Only admins can promote users." };
        }

        // Update target user role
        await prisma.user.update({
            where: { id: userId },
            data: { role: "ADMIN" }
        });

        revalidatePath("/admin/users");
        return { success: "User promoted to Admin successfully" };
    } catch (error) {
        console.error("Error promoting user:", error);
        return { error: "Failed to promote user" };
    }
}

/**
 * Fetch all users with pagination and search
 */
export async function getUsers(page: number = 1, limit: number = 20, search: string = "") {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
        throw new Error("Unauthorized");
    }

    // Verify current user is an admin
    const currentUser = await prisma.user.findUnique({
        where: { id: authUser.id },
        select: { role: true }
    });

    if (currentUser?.role !== "ADMIN") {
        throw new Error("Permission denied");
    }

    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
        where.OR = [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
        ];
    }

    try {
        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    plan: true,
                    trustScore: true,
                    profilePhotoUrl: true,
                    createdAt: true,
                    // status: true, // Assuming status exists or derived
                    location: true,
                    phone: true,
                    lastLoginAt: true,
                    role: true,
                    certifications: {
                        select: {
                            status: true
                        }
                    }
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.user.count({ where })
        ]);

        // Transform data to match UserData interface if needed
        const formattedUsers = users.map(user => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            plan: user.plan,
            trustScore: user.trustScore,
            profilePhoto: user.profilePhotoUrl,
            joined: user.createdAt,
            status: "active", // Placeholder as status wasn't in schema snippet exactly like this, or maybe it was
            certs: {
                total: user.certifications.length,
                verified: user.certifications.filter(c => c.status === "VERIFIED").length
            },
            location: user.location,
            phone: user.phone,
            lastLogin: user.lastLoginAt,
            role: user.role
        }));

        return {
            users: formattedUsers,
            total,
            pages: Math.ceil(total / limit)
        };

    } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users");
    }
}

/**
 * Fetch verification requests for the admin queue
 */
export async function getVerificationQueue() {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
        throw new Error("Unauthorized");
    }

    // Verify current user is an admin
    const currentUser = await prisma.user.findUnique({
        where: { id: authUser.id },
        select: { role: true }
    });

    if (currentUser?.role !== "ADMIN") {
        throw new Error("Permission denied");
    }

    try {
        const queue = await prisma.verificationRequest.findMany({
            where: {
                status: "QUEUED"
            },
            include: {
                certification: { include: { user: true } },
                education: { include: { user: true } },
                workExperience: { include: { user: true } },
                assignedAdmin: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            },
            orderBy: { createdAt: 'asc' }
        });

        return queue.map(item => {
            const target = item.certification || item.education || item.workExperience;
            const user = target?.user;

            return {
                id: item.id,
                createdAt: item.createdAt,
                status: item.status,
                type: item.certificationId ? 'Certification' : item.educationId ? 'Education' : 'Work Experience',
                title: item.certification?.title || item.education?.degree || item.workExperience?.role || 'Unknown Title',
                issuer: item.certification?.issuingOrganization || item.education?.institution || item.workExperience?.company || 'Unknown Org',
                user: user ? {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    profilePhoto: user.profilePhotoUrl
                } : { firstName: 'Unknown', lastName: 'User', email: '', profilePhoto: null }
            };
        });
    } catch (error) {
        console.error("Error fetching verification queue:", error);
        throw new Error("Failed to fetch verification queue");
    }
}

/**
 * Fetch transactions with pagination
 */
export async function getTransactions(page: number = 1, limit: number = 20) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
        throw new Error("Unauthorized");
    }

    // Verify current user is an admin
    const currentUser = await prisma.user.findUnique({
        where: { id: authUser.id },
        select: { role: true }
    });

    if (currentUser?.role !== "ADMIN") {
        throw new Error("Permission denied");
    }

    const skip = (page - 1) * limit;

    try {
        const [transactions, total] = await Promise.all([
            prisma.transaction.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    }
                }
            }),
            prisma.transaction.count()
        ]);

        return {
            transactions: transactions.map(tx => ({
                id: tx.id,
                user: `${tx.user.firstName} ${tx.user.lastName}`,
                userEmail: tx.user.email,
                amount: tx.amount.toNumber(),
                currency: tx.currency,
                type: tx.type,
                status: tx.status,
                reference: tx.reference,
                createdAt: tx.createdAt
            })),
            total,
            pages: Math.ceil(total / limit)
        };
    } catch (error) {
        console.error("Error fetching transactions:", error);
        throw new Error("Failed to fetch transactions");
    }
}

/**
 * Fetch stats for the admin dashboard
 */
export async function getAdminDashboardStats() {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
        throw new Error("Unauthorized");
    }

    // Verify current user is an admin
    const currentUser = await prisma.user.findUnique({
        where: { id: authUser.id },
        select: { role: true }
    });

    if (currentUser?.role !== "ADMIN") {
        throw new Error("Permission denied");
    }

    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        const startOfWeek = new Date(now.setDate(now.getDate() - 7));

        const [
            totalUsers,
            newUsersThisWeek,
            pendingVerificationsCount,
            verifiedThisMonth,
            verifiedLastMonth,
            totalRevenue,
            transactionsCount,
            pendingVerifications,
            recentVerifications
        ] = await Promise.all([
            // User Stats
            prisma.user.count(),
            prisma.user.count({ where: { createdAt: { gte: startOfWeek } } }),

            // Pending Verifications
            prisma.verificationRequest.count({ where: { status: "QUEUED" } }),

            // Verified Stats (Completed Requests)
            prisma.verificationRequest.count({
                where: {
                    status: "COMPLETED",
                    updatedAt: { gte: startOfMonth }
                }
            }),
            prisma.verificationRequest.count({
                where: {
                    status: "COMPLETED",
                    updatedAt: { gte: startOfLastMonth, lte: endOfLastMonth }
                }
            }),

            // Revenue
            prisma.transaction.aggregate({
                _sum: { amount: true },
                where: { status: "SUCCESSFUL" } // Assuming verified/successful transactions
            }),
            prisma.transaction.count(),

            // Pending Queue List (Top 5)
            prisma.verificationRequest.findMany({
                where: { status: "QUEUED" },
                take: 5,
                orderBy: { createdAt: 'asc' },
                include: {
                    certification: { include: { user: true } },
                    education: { include: { user: true } },
                    workExperience: { include: { user: true } }
                }
            }),

            // Recent Verifications List (Top 5)
            prisma.verificationRequest.findMany({
                where: { status: { not: "QUEUED" } },
                take: 5,
                orderBy: { updatedAt: 'desc' },
                include: {
                    certification: { include: { user: true } },
                    education: { include: { user: true } },
                    workExperience: { include: { user: true } },
                    assignedAdmin: true
                }
            })
        ]);

        const verifiedGrowth = verifiedThisMonth - verifiedLastMonth;

        return {
            totalUsers,
            userGrowth: newUsersThisWeek,
            pendingVerificationsCount,
            verifiedThisMonth,
            verifiedGrowth,
            revenue: totalRevenue._sum.amount ? totalRevenue._sum.amount.toNumber() : 0,
            transactionsCount,
            pendingVerifications: pendingVerifications.map(item => {
                const target = item.certification || item.education || item.workExperience;
                const user = target?.user;
                return {
                    id: item.id,
                    user: user ? `${user.firstName} ${user.lastName}` : 'Unknown User',
                    userAvatar: user?.profilePhotoUrl || null,
                    type: item.certificationId ? 'Certification' : item.educationId ? 'Education' : 'Work Experience',
                    title: item.certification?.title || item.education?.degree || item.workExperience?.role || 'Unknown Title',
                    submittedAt: item.createdAt,
                    status: item.status
                };
            }),
            recentVerifications: recentVerifications.map(item => {
                const target = item.certification || item.education || item.workExperience;
                const user = target?.user;
                return {
                    id: item.id,
                    user: user ? `${user.firstName} ${user.lastName}` : 'Unknown User',
                    title: item.certification?.title || item.education?.degree || item.workExperience?.role || 'Unknown Title',
                    status: item.status,
                    admin: item.assignedAdmin ? `${item.assignedAdmin.firstName} ${item.assignedAdmin.lastName}` : 'System',
                    updatedAt: item.updatedAt
                };
            })
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        throw new Error("Failed to fetch dashboard stats");
    }
}

/**
 * Update the status of a credential item (Certification, Education, or WorkExperience)
 */
export async function updateItemStatus(
    type: 'certification' | 'education' | 'workExperience',
    id: string,
    status: 'VERIFIED' | 'REJECTED' | 'PENDING',
    note?: string
) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
        return { error: "Unauthorized" };
    }

    const currentUser = await prisma.user.findUnique({
        where: { id: authUser.id },
        select: { role: true }
    });

    if (currentUser?.role !== "ADMIN") {
        return { error: "Permission denied" };
    }

    try {
        const updateData: any = { status };
        if (status === 'VERIFIED') {
            updateData.verifiedAt = new Date();
        } else {
            updateData.verifiedAt = null;
        }

        // Handle specific fields
        if (type === 'certification' && status === 'REJECTED' && note) {
            updateData.rejectionReason = note;
        }

        // Perform the update dynamically based on type
        let result;
        if (type === 'certification') {
            result = await prisma.certification.update({ where: { id }, data: updateData });
        } else if (type === 'education') {
            result = await prisma.education.update({ where: { id }, data: updateData });
        } else if (type === 'workExperience') {
            result = await prisma.workExperience.update({ where: { id }, data: updateData });
        } else {
            return { error: "Invalid item type" };
        }

        // Also update any associated VerificationRequest to COMPLETED if verified/rejected
        if (status !== 'PENDING') {
            // Find requests for this item
            const whereClause: any = {};
            if (type === 'certification') whereClause.certificationId = id;
            if (type === 'education') whereClause.educationId = id;
            if (type === 'workExperience') whereClause.workExperienceId = id;

            await prisma.verificationRequest.updateMany({
                where: {
                    ...whereClause,
                    status: 'QUEUED'
                },
                data: {
                    status: 'COMPLETED',
                    notes: note,
                    assignedAdminId: authUser.id,
                    updatedAt: new Date()
                }
            });
        }

        // Recalculate Trust Score if status changed to VERIFIED (or was unverified)
        // We always recalculate to be safe
        let userId = "";
        if (type === 'certification') {
            const item = await prisma.certification.findUnique({ where: { id }, select: { userId: true } });
            if (item) userId = item.userId;
        } else if (type === 'education') {
            const item = await prisma.education.findUnique({ where: { id }, select: { userId: true } });
            if (item) userId = item.userId;
        } else if (type === 'workExperience') {
            const item = await prisma.workExperience.findUnique({ where: { id }, select: { userId: true } });
            if (item) userId = item.userId;
        }

        if (userId) {
            await recalculateTrustScore(userId);
        }

        revalidatePath(`/admin/users`);
        revalidatePath(`/admin/verifications`);
        return { success: true, data: result };
    } catch (error) {
        console.error("Error updating item status:", error);
        return { error: "Failed to update item status" };
    }
}

/**
 * Recalculate and update the trust score for a user
 */
async function recalculateTrustScore(userId: string) {
    // 1. Get all verified items
    const [certifications, education, workExperience] = await Promise.all([
        prisma.certification.findMany({ where: { userId, status: 'VERIFIED' } }),
        prisma.education.findMany({ where: { userId, status: 'VERIFIED' } }),
        prisma.workExperience.findMany({ where: { userId, status: 'VERIFIED' } })
    ]);

    // 2. Define weights
    // Base Identity: 20
    // Certification: 15 points each
    // Education: 20 points
    // Work Experience: 20 points

    let score = 20; // Base score

    score += certifications.length * 15;
    score += education.length * 20;
    score += workExperience.length * 20;

    // Cap at 100
    if (score > 100) score = 100;

    // 3. Update User
    await prisma.user.update({
        where: { id: userId },
        data: { trustScore: score }
    });
}


/**
 * Update user status (e.g. ban/unban via trust score)
 */
export async function updateUserStatus(userId: string, isBanned: boolean) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
        return { error: "Unauthorized" };
    }

    const currentUser = await prisma.user.findUnique({
        where: { id: authUser.id },
        select: { role: true }
    });

    if (currentUser?.role !== "ADMIN") {
        return { error: "Permission denied" };
    }

    try {
        const trustScore = isBanned ? -1 : 0; // Reset to 0 if unbanned (will be recalculated on next verification)
        // Ideally we should recalculate on unban too, but let's stick to this for now.

        await prisma.user.update({
            where: { id: userId },
            data: { trustScore }
        });

        if (!isBanned) {
            await recalculateTrustScore(userId);
        }

        revalidatePath(`/admin/users`);
        revalidatePath(`/admin/users/${userId}`);
        return { success: true };
    } catch (error) {
        console.error("Error updating user status:", error);
        return { error: "Failed to update user status" };
    }
}

/**
 * Fetch a single user by ID for admin details view
 */
export async function getUserById(userId: string) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
        return null;
    }

    // Verify current user is an admin
    const currentUser = await prisma.user.findUnique({
        where: { id: authUser.id },
        select: { role: true }
    });

    if (currentUser?.role !== "ADMIN") {
        return null;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                certifications: { orderBy: { issueDate: 'desc' } },
                education: { orderBy: { startYear: 'desc' } },
                workExperience: { orderBy: { startDate: 'desc' } },
                transactions: { orderBy: { createdAt: 'desc' }, take: 10 },
                activityLogs: { orderBy: { createdAt: 'desc' }, take: 20 }
            }
        });

        if (!user) return null;

        return {
            ...user,
            location: user.location,
            phone: user.phone,
            headline: user.headline,
            role: user.role
        };
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return null;
    }
}

/**
 * Fetch a single verification request by ID
 */
export async function getVerificationRequestById(requestId: string) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
        return null;
    }

    // Verify current user is an admin
    const currentUser = await prisma.user.findUnique({
        where: { id: authUser.id },
        select: { role: true }
    });

    if (currentUser?.role !== "ADMIN") {
        return null;
    }

    try {
        const request = await prisma.verificationRequest.findUnique({
            where: { id: requestId },
            include: {
                certification: { include: { user: true } },
                education: { include: { user: true } },
                workExperience: { include: { user: true } },
                assignedAdmin: true
            }
        });

        if (!request) return null;

        const target = request.certification || request.education || request.workExperience;
        const user = target?.user;

        return {
            id: request.id,
            status: request.status,
            createdAt: request.createdAt,
            updatedAt: request.updatedAt,
            notes: request.notes,
            admin: request.assignedAdmin ? `${request.assignedAdmin.firstName} ${request.assignedAdmin.lastName}` : 'Unassigned',
            user: user ? {
                id: user.id,
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                image: user.profilePhotoUrl
            } : null,
            item: target ? {
                id: target.id,
                type: request.certificationId ? 'certification' : request.educationId ? 'education' : 'workExperience',
                title: request.certification?.title || request.education?.institution || request.workExperience?.company,
                subtitle: request.certification?.issuingOrganization || request.education?.degree || request.workExperience?.role,
                description: request.certification?.credentialId || request.education?.fieldOfStudy || request.workExperience?.description,
                documentUrl: target.documentUrl,
                status: target.status
            } : null
        };
    } catch (error) {
        console.error("Error fetching verification request:", error);
        return null;
    }
}

/**
 * Update verification request status
 */
export async function updateVerificationStatus(
    requestId: string,
    status: 'VERIFIED' | 'REJECTED',
    notes?: string
) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
        throw new Error("Unauthorized");
    }

    // Verify current user is an admin
    const currentUser = await prisma.user.findUnique({
        where: { id: authUser.id },
        select: { role: true }
    });

    if (currentUser?.role !== "ADMIN") {
        throw new Error("Permission denied");
    }

    try {
        const request = await prisma.verificationRequest.findUnique({
            where: { id: requestId },
            include: {
                certification: true,
                education: true,
                workExperience: true
            }
        });

        if (!request) {
            throw new Error("Request not found");
        }

        // Update VerificationRequest status
        await prisma.verificationRequest.update({
            where: { id: requestId },
            data: {
                status: status === 'VERIFIED' ? 'COMPLETED' : 'REJECTED',
                notes,
                assignedAdminId: authUser.id,
                updatedAt: new Date()
            }
        });

        // Determine item type and ID
        let type: 'certification' | 'education' | 'workExperience';
        let itemId: string;
        let userId: string = "";

        if (request.certificationId) {
            type = 'certification';
            itemId = request.certificationId;
            userId = request.certification?.userId || "";
        } else if (request.educationId) {
            type = 'education';
            itemId = request.educationId;
            userId = request.education?.userId || "";
        } else if (request.workExperienceId) {
            type = 'workExperience';
            itemId = request.workExperienceId;
            userId = request.workExperience?.userId || "";
        } else {
            throw new Error("Invalid request type");
        }

        // Update item status
        const itemStatus = status === 'VERIFIED' ? 'VERIFIED' : 'REJECTED';
        const itemUpdateData: any = { status: itemStatus };

        if (status === 'VERIFIED') {
            itemUpdateData.verifiedAt = new Date();
        } else {
            itemUpdateData.rejectionReason = notes;
            itemUpdateData.verifiedAt = null;
        }

        if (type === 'certification') {
            await prisma.certification.update({ where: { id: itemId }, data: itemUpdateData });
        } else if (type === 'education') {
            await prisma.education.update({ where: { id: itemId }, data: itemUpdateData });
        } else if (type === 'workExperience') {
            await prisma.workExperience.update({ where: { id: itemId }, data: itemUpdateData });
        }

        // Recalculate trust score if verified
        if (userId && status === 'VERIFIED') {
            await recalculateTrustScore(userId);
        }

        revalidatePath("/admin/verifications");
        revalidatePath(`/admin/verifications/${requestId}`);
        if (userId) revalidatePath(`/admin/users/${userId}`);

        return { success: true };
    } catch (error) {
        console.error("Error updating verification status:", error);
        throw new Error("Failed to update verification status");
    }
}
