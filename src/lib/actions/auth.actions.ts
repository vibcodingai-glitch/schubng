"use server";

import * as z from "zod";
import prisma from "@/lib/prisma";
import { registerSchema, loginSchema } from "@/lib/validations";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function registerUser(values: z.infer<typeof registerSchema>) {
    console.log("registerUser received values:", JSON.stringify(values, null, 2));
    const validatedFields = registerSchema.safeParse(values);

    if (!validatedFields.success) {
        console.error("Validation failed:", validatedFields.error.flatten());
        return { error: "Invalid fields! " + JSON.stringify(validatedFields.error.flatten().fieldErrors) };
    }

    const {
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        linkedInUrl,
        jobTitle,
        yearsOfExperience,
        industry,
        state,
        currentCompany
    } = validatedFields.data;

    const supabase = await createClient();

    // 1. Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name: firstName,
                last_name: lastName,
                phone: phoneNumber,
            },
        },
    });

    if (authError) {
        console.error("Supabase Auth Error:", authError);
        return { error: authError.message };
    }

    if (!authData.user) {
        return { error: "Registration failed. No user returned from Supabase." };
    }

    try {
        // 2. Create user in public PostgreSQL table (Prisma)
        // Check if user already exists (idempotency)
        const existingUser = await prisma.user.findUnique({
            where: { id: authData.user.id },
        });

        if (!existingUser) {
            await prisma.user.create({
                data: {
                    id: authData.user.id, // Link to Supabase Auth ID
                    firstName,
                    lastName,
                    email,
                    // passwordHash: No longer needed locally, or store a dummy if schema requires it? 
                    // Schema allows null? No, String? is nullable. Confirmed in schema view.
                    phone: phoneNumber,
                    linkedinUrl: linkedInUrl,
                    plan: "FREE",
                    trustScore: 0,
                    // Profile fields
                    currentRole: jobTitle,
                    yearsOfExperience,
                    industry,
                    location: state,
                    currentCompany,
                },
            });
        }

        return { success: "Account created! Please check your email if verification is enabled." };
    } catch (error) {
        console.error("Prisma Creation Error:", error);
        // If Prisma fails, we might get a mismatch.
        // ideally we should delete auth user, but for now let's just report error.
        return { error: "Account created in Auth but failed to sync profile. Please contact support." };
    }
}

export async function loginUser(values: z.infer<typeof loginSchema>) {
    const validatedFields = loginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { email, password } = validatedFields.data;

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error("Login Error:", error);
        return { error: error.message };
    }

    return { success: true };
}

export async function signOutUser() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
}

export async function signInWithOAuth(provider: "google" | "linkedin") {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
        },
    });

    if (error) {
        console.error("OAuth Error:", error);
        redirect("/login?error=OAuthFailed");
    }

    if (data.url) {
        redirect(data.url);
    }
}
