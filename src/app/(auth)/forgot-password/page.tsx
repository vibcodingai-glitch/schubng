"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Key, CheckCircle2, Loader2, Link as LinkIcon } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);

        // Mock API call
        setTimeout(() => {
            console.log("Password reset requested for:", data.email);
            setSubmittedEmail(data.email);
            setIsSuccess(true);
            setIsLoading(false);
        }, 1500);
    };

    const handleReset = () => {
        setIsSuccess(false);
        setSubmittedEmail("");
        reset();
    };

    return (
        <AuthLayout>
            <Card className="border-none shadow-xl animate-slide-up">
                <CardHeader className="text-center pb-4">
                    {!isSuccess && (
                        <Link
                            href="/login"
                            className="absolute top-6 left-6 text-slate-500 hover:text-slate-900 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    )}
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                            {isSuccess ? (
                                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                            ) : (
                                <Key className="w-8 h-8 text-slate-400" />
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    {!isSuccess ? (
                        <div className="space-y-6">
                            <div className="text-center space-y-2">
                                <h2 className="text-2xl font-bold">Forgot your password?</h2>
                                <p className="text-sm text-slate-600">
                                    No worries, we'll send you reset instructions.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email address"
                                        {...register("email")}
                                        disabled={isLoading}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500">{errors.email.message}</p>
                                    )}
                                </div>

                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        "Send Reset Link"
                                    )}
                                </Button>
                            </form>

                            <div className="text-center text-sm text-slate-600">
                                Remember your password?{" "}
                                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Sign in
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 text-center">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-emerald-600">Check your email</h2>
                                <p className="text-slate-600">
                                    We've sent a password reset link to
                                </p>
                                <p className="font-semibold text-slate-900">{submittedEmail}</p>
                            </div>

                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-600">
                                <p className="mb-2">Didn't receive the email? Check your spam folder or</p>
                                <button
                                    onClick={handleReset}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    try another email address
                                </button>
                            </div>

                            <Link href="/login">
                                <Button className="w-full">Back to Sign In</Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </AuthLayout>
    );
}
