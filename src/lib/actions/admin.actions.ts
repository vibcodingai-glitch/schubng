"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Ensure only admins can access these actions
async function checkAdmin() {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    // In real app, we should check role from DB as session might be stale or not include role yet
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
    });

    if (user?.role !== "ADMIN") throw new Error("Forbidden: Admin access only");
    return session.user;
}

export async function getVerificationQueue() {
    try {
        await checkAdmin();

        const queue = await prisma.verificationRequest.findMany({
            where: {
                status: "QUEUED", // Only fetch pending items
            },
            include: {
                certification: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: "asc" }
        });
        return queue;
    } catch (error) {
        console.error("Error fetching verification queue:", error);
        return [];
    }
}

export async function getVerificationRequest(id: string) {
    try {
        await checkAdmin();
        const request = await prisma.verificationRequest.findUnique({
            where: { id },
            include: {
                certification: {
                    include: {
                        user: true
                    }
                },
                assignedAdmin: true
            }
        });
        return request;
    } catch (error) {
        console.error("Error fetching verification request:", error);
        return null;
    }
}

export async function verifyRequest(requestId: string, status: "APPROVED" | "REJECTED", notes?: string) {
    try {
        const adminUser = await checkAdmin();

        // Transaction to update both NotificationRequest and Certification
        await prisma.$transaction(async (tx) => {
            const request = await tx.verificationRequest.findUnique({
                where: { id: requestId },
                include: { certification: true }
            });

            if (!request) throw new Error("Request not found");

            // Update Request Status
            await tx.verificationRequest.update({
                where: { id: requestId },
                data: {
                    status: "COMPLETED",
                    notes: notes,
                    assignedAdminId: adminUser.id
                }
            });

            // Update Certification Status
            await tx.certification.update({
                where: { id: request.certificationId },
                data: {
                    status: status === "APPROVED" ? "VERIFIED" : "REJECTED",
                    rejectionReason: status === "REJECTED" ? notes : null,
                    verifiedAt: status === "APPROVED" ? new Date() : null,
                }
            });

            // TODO: Create notification for user
        });

        revalidatePath("/admin/verifications");
        return { success: `Certification ${status === "APPROVED" ? "Verified" : "Rejected"}` };
    } catch (error) {
        console.error("Error verifying request:", error);
        return { error: "Failed to process verification" };
    }
}
