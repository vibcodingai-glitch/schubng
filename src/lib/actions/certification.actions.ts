"use server";

import prisma from "@/lib/prisma";
import { certificationSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function getCertifications() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.email) return [];

    // Get user from Prisma by email
    const dbUser = await prisma.user.findUnique({
        where: { email: user.email }
    });

    if (!dbUser) return [];

    try {
        const certs = await prisma.certification.findMany({
            where: { userId: dbUser.id },
            orderBy: { createdAt: "desc" },
        });
        return certs;
    } catch (error) {
        console.error("Error fetching certifications:", error);
        return [];
    }
}

export async function createCertification(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.email) return { error: "Unauthorized" };

    // Get user from Prisma by email
    const dbUser = await prisma.user.findUnique({
        where: { email: user.email }
    });

    if (!dbUser) return { error: "User not found" };

    const rawData = {
        title: formData.get("certName"),
        issuingOrganization: formData.get("issuingOrg"),
        credentialId: formData.get("credentialId"),
        issueDate: formData.get("issueDate"), // Constructed string YYYY-MM
        expiryDate: formData.get("expiryDate"), // Constructed string YYYY-MM or empty
        verificationUrl: formData.get("verificationUrl"),
        documentUrl: formData.get("documentUrl"), // Assuming client might upload and send URL or we handle file here
    };

    // Handle File Upload
    let documentUrl = "";
    const file = formData.get("file") as File;

    if (file && file.size > 0 && file.name !== "undefined") {
        try {
            // We already have supabase client from above

            // Convert File to ArrayBuffer for server-side upload
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const fileExt = file.name.split('.').pop();
            const fileName = `${dbUser.id}/${Date.now()}.${fileExt}`;
            const { data, error } = await supabase.storage
                .from('certifications')
                .upload(fileName, buffer, {
                    contentType: file.type,
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('certifications')
                .getPublicUrl(fileName);

            documentUrl = publicUrl;
        } catch (error) {
            console.error("Upload error:", error);
            // Non-blocking error for now? Or fail? Fail is better.
            return { error: "Failed to upload document. Please try again." };
        }
    } else {
        // Fallback for MVP if no file or keeping previous mock if testing without file
        // documentUrl = "https://chaincred-uploads.s3.amazonaws.com/mock-cert.pdf";
        // Let's make file mandatory? The schema says optional in some contexts but for verification it should be required.
        // For now, allow empty if not verifying?
    }

    // Validate using Zod
    const validatedFields = certificationSchema.safeParse({
        ...rawData,
        expiryDate: rawData.expiryDate || "",
    });

    if (!validatedFields.success) {
        return { error: "Invalid fields", details: validatedFields.error.flatten() };
    }

    const { title, issuingOrganization, credentialId, issueDate, expiryDate } = validatedFields.data;

    try {
        const newCert = await prisma.certification.create({
            data: {
                userId: dbUser.id,
                title,
                issuingOrganization,
                credentialId,
                issueDate: new Date(issueDate),
                expiryDate: expiryDate ? new Date(expiryDate) : null,
                documentUrl: documentUrl || null, // Use uploaded URL
                status: "PENDING",
            },
        });

        // Check if verification was requested (passed as a hidden field or inferred?)
        // The current form submits fields. We need to know if "verify" was clicked.
        // The FormData from client should include a flag `verify: true`.
        // Let's assume we add `requestVerification` to FormData in client.

        const requestVerification = formData.get("requestVerification") === "true";

        if (requestVerification) {
            await prisma.verificationRequest.create({
                data: {
                    certificationId: newCert.id,
                    status: "QUEUED",
                }
            });
        }

        revalidatePath("/dashboard/certifications");
        return { success: "Certification added successfully" };
    } catch (error) {
        console.error("Error creating certification:", error);
        return { error: "Failed to create certification" };
    }
}
