"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Lock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { PasswordStrength } from "@/components/shared/PasswordStrength";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain an uppercase letter")
        .regex(/[0-9]/, "Password must contain a number")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain a special character"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isInvalid = searchParams.get("invalid") === "true";

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        setIsLoading(true);

        // Mock API call
        setTimeout(() => {
            console.log("Password reset complete:", data);
            setIsSuccess(true);
            setIsLoading(false);
        }, 1500);
    };

    // Invalid/Expired Token State
    if (isInvalid) {
        return (
            <AuthLayout>
                <Card className="border-none shadow-xl animate-slide-up">
                    <CardHeader className="text-center pb-4">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                                <XCircle className="w-8 h-8 text-red-600" />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-6 text-center">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-red-600">Reset link expired</h2>
                                <p className="text-slate-600">
                                    This password reset link has expired or is invalid.
                                </p>
                            </div>

                            <Link href="/forgot-password">
                                <Button className="w-full">Request New Link</Button>
                            </Link>

                            <div className="text-center text-sm text-slate-600">
                                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Back to Sign In
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </AuthLayout>
        );
    }

    // Success State
    if (isSuccess) {
        return (
            <AuthLayout>
                <Card className="border-none shadow-xl animate-slide-up">
                    <CardHeader className="text-center pb-4">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-6 text-center">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-emerald-600">Password reset successful</h2>
                                <p className="text-slate-600">
                                    Your password has been updated. You can now sign in with your new password.
                                </p>
                            </div>

                            <Link href="/login">
                                <Button className="w-full">Sign In</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </AuthLayout>
        );
    }

    // Default Form State
    return (
        <AuthLayout>
            <Card className="border-none shadow-xl animate-slide-up">
                <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                            <Lock className="w-8 h-8 text-slate-400" />
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold">Set new password</h2>
                            <p className="text-sm text-slate-600">
                                Your new password must be different from previous passwords.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* New Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        {...register("password")}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                <PasswordStrength password={watch("password") || ""} />
                                {errors.password && (
                                    <p className="text-sm text-red-500">{errors.password.message}</p>
                                )}
                            </div>

                            {/* Confirm New Password */}
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        {...register("confirmPassword")}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                                        tabIndex={-1}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Resetting...
                                    </>
                                ) : (
                                    "Reset Password"
                                )}
                            </Button>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </AuthLayout>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <AuthLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            </AuthLayout>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
