"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Link as LinkIcon } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

import { loginSchema, type LoginFormData } from "@/lib/validations";

export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);

        try {
            // Use browser client for login to ensure cookies are properly set
            const { createClient } = await import("@/lib/supabase/client");
            const supabase = createClient();

            const { error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });

            if (error) {
                console.error("Login error from Supabase:", error.message, error.code, error);
                toast({
                    title: "Login Failed",
                    description: error.message,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Success",
                    description: "Logging you in...",
                });
                router.push("/dashboard");
                router.refresh(); // Refresh to ensure session applies
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };


    const handleOAuthLogin = async (provider: "google" | "linkedin") => {
        setIsLoading(true);
        try {
            const { signInWithOAuth } = await import("@/lib/actions/auth.actions");
            await signInWithOAuth(provider);
        } catch (error) {
            console.error("OAuth Error:", error);
            // Redirect errors are expected here due to server action redirect
        } finally {
            // Usually won't reach here if redirected, but good for safety
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <Card className="border-none shadow-xl animate-slide-up">
                <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                            <LinkIcon className="w-7 h-7 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                    <CardDescription>Sign in to your account</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@company.com"
                                {...register("email")}
                                disabled={isLoading}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
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
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Controller
                                    control={control}
                                    name="rememberMe"
                                    render={({ field }) => (
                                        <Checkbox
                                            id="rememberMe"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    )}
                                />
                                <Label
                                    htmlFor="rememberMe"
                                    className="text-sm font-normal cursor-pointer"
                                >
                                    Remember me
                                </Label>
                            </div>
                            <Link
                                href="/forgot-password"
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-slate-500">Or continue with</span>
                            </div>
                        </div>

                        {/* Social Login Buttons */}
                        <div className="space-y-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                disabled={isLoading}
                                onClick={() => handleOAuthLogin("google")}
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Continue with Google
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                disabled={isLoading}
                                onClick={() => handleOAuthLogin("linkedin")}
                            >
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                                Continue with LinkedIn
                            </Button>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center text-sm text-slate-600">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                            Create account
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </AuthLayout>
    );
}
