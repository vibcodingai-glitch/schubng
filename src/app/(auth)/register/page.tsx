"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Link as LinkIcon } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { StepIndicator } from "@/components/shared/StepIndicator";
import { PasswordStrength } from "@/components/shared/PasswordStrength";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { NIGERIAN_STATES } from "@/constants";

// Step 1 Schema
const step1Schema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phoneNumber: z.string().min(10, "Please enter a valid phone number").max(15, "Phone number is too long"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain an uppercase letter")
        .regex(/[0-9]/, "Password must contain a number")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain a special character"),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
        message: "You must agree to the terms and conditions",
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

// Step 2 Schema
const step2Schema = z.object({
    jobTitle: z.string().min(1, "Please select your job title"),
    yearsOfExperience: z.string().min(1, "Please select your years of experience"),
    industry: z.string().min(1, "Please select your industry"),
    state: z.string().min(1, "Please select your state"),
    currentCompany: z.string().optional(),
    hearAboutUs: z.string().optional(),
});

type Step1FormData = z.infer<typeof step1Schema>;
type Step2FormData = z.infer<typeof step2Schema>;

const jobTitles = [
    "Supply Chain Manager",
    "Procurement Manager",
    "Logistics Manager",
    "Warehouse Manager",
    "Demand Planner",
    "Supply Planner",
    "S&OP Manager",
    "Inventory Manager",
    "Purchasing Officer",
    "Operations Manager",
    "Supply Chain Analyst",
    "Logistics Coordinator",
    "Category Manager",
    "Vendor Manager",
    "Other",
];

const experienceLevels = [
    "Less than 1 year",
    "1-3 years",
    "3-5 years",
    "5-10 years",
    "10-15 years",
    "15+ years",
];

const industries = [
    "Oil & Gas",
    "FMCG / Consumer Goods",
    "Manufacturing",
    "Logistics / 3PL",
    "Retail",
    "Telecommunications",
    "Healthcare / Pharma",
    "Agriculture / Agribusiness",
    "Construction",
    "Banking / Finance",
    "E-commerce",
    "Government / Public Sector",
    "Other",
];

const hearAboutUsOptions = [
    "LinkedIn",
    "Twitter/X",
    "Google Search",
    "Friend/Colleague",
    "Industry Event",
    "Other",
];

export default function RegisterPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [step1Data, setStep1Data] = useState<Step1FormData | null>(null);

    const step1Form = useForm<Step1FormData>({
        resolver: zodResolver(step1Schema),
    });

    const step2Form = useForm<Step2FormData>({
        resolver: zodResolver(step2Schema),
    });

    const onStep1Submit = (data: Step1FormData) => {
        setStep1Data(data);
        setCurrentStep(2);
    };

    const onStep2Submit = async (data: Step2FormData) => {
        console.log("onStep2Submit triggered with:", data);
        setIsLoading(true);

        if (!step1Data) {
            console.error("Missing step1Data");
            toast({
                title: "Error",
                description: "Missing account data. Please go back to step 1.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        const completeData = {
            ...step1Data,
            ...data,
            // Map step 2 fields if they are not in valid schema or add to schema
            // For now passing basic fields required by registerSchema
            confirmPassword: step1Data.password,
            agreeToTerms: true
        };

        // Note: The registerSchema validates strict fields. 
        // We might need to adjust the server action to accept optional profile data 
        // or update registerSchema to be flexible.
        // For this implementation, I will call the action.

        try {
            // Import dynamically to avoid client/server issues if needed, or just import at top
            const { registerUser } = await import("@/lib/actions/auth.actions");

            // We need to match the registerSchema exactly. 
            // In a real app we would merge step1 and step2 properly.
            // For now, let's send what we have that matches the schema.

            const payload = {
                ...step1Data,
                ...data, // Include Step 2 data
                confirmPassword: step1Data.password,
                agreeToTerms: true,
                // Ensure optional fields are handled or let Zod handle defaults if configured
                linkedInUrl: "", // Optional in schema, explicit empty string if not in form
            };

            const result = await registerUser(payload as any);

            if (result.error) {
                toast({
                    title: "Registration Failed",
                    description: result.error,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Account created!",
                    description: "Welcome to SupplyChain Hub. Logging you in...",
                });

                // Auto login after reg? Or redirect to login?
                // For now, redirect to login
                router.push("/login?registered=true");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const steps = [
        { label: "Account" },
        { label: "Profile" },
    ];

    return (
        <AuthLayout>
            <Card className="border-none shadow-xl animate-slide-up">
                <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                            <LinkIcon className="w-7 h-7 text-white" />
                        </div>
                    </div>
                    <StepIndicator currentStep={currentStep} totalSteps={2} steps={steps} />
                </CardHeader>

                <CardContent>
                    {currentStep === 1 ? (
                        <div className="space-y-4">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold">Create your account</h2>
                                <p className="text-sm text-slate-600">Start your verification journey</p>
                            </div>

                            <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-4">
                                {/* Name Fields */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            placeholder="John"
                                            {...step1Form.register("firstName")}
                                        />
                                        {step1Form.formState.errors.firstName && (
                                            <p className="text-sm text-red-500">
                                                {step1Form.formState.errors.firstName.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            placeholder="Doe"
                                            {...step1Form.register("lastName")}
                                        />
                                        {step1Form.formState.errors.lastName && (
                                            <p className="text-sm text-red-500">
                                                {step1Form.formState.errors.lastName.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@company.com"
                                        {...step1Form.register("email")}
                                    />
                                    {step1Form.formState.errors.email && (
                                        <p className="text-sm text-red-500">
                                            {step1Form.formState.errors.email.message}
                                        </p>
                                    )}
                                </div>

                                {/* Phone Number */}
                                <div className="space-y-2">
                                    <Label htmlFor="phoneNumber">Phone Number</Label>
                                    <div className="flex gap-2">
                                        <div className="w-20 flex items-center justify-center bg-slate-100 border border-input rounded-md text-sm font-medium text-slate-600">
                                            +234
                                        </div>
                                        <Input
                                            id="phoneNumber"
                                            placeholder="801 234 5678"
                                            {...step1Form.register("phoneNumber")}
                                            className="flex-1"
                                        />
                                    </div>
                                    {step1Form.formState.errors.phoneNumber && (
                                        <p className="text-sm text-red-500">
                                            {step1Form.formState.errors.phoneNumber.message}
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            {...step1Form.register("password")}
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
                                    <PasswordStrength password={step1Form.watch("password") || ""} />
                                    {step1Form.formState.errors.password && (
                                        <p className="text-sm text-red-500">
                                            {step1Form.formState.errors.password.message}
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            {...step1Form.register("confirmPassword")}
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
                                    {step1Form.formState.errors.confirmPassword && (
                                        <p className="text-sm text-red-500">
                                            {step1Form.formState.errors.confirmPassword.message}
                                        </p>
                                    )}
                                </div>

                                {/* Terms */}
                                <div className="flex items-start gap-2">
                                    <Controller
                                        control={step1Form.control}
                                        name="agreeToTerms"
                                        render={({ field }) => (
                                            <Checkbox
                                                id="agreeToTerms"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        )}
                                    />
                                    <Label
                                        htmlFor="agreeToTerms"
                                        className="text-sm font-normal cursor-pointer leading-relaxed"
                                    >
                                        I agree to the{" "}
                                        <Link
                                            href="/terms"
                                            target="_blank"
                                            className="text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            Terms of Service
                                        </Link>{" "}
                                        and{" "}
                                        <Link
                                            href="/privacy"
                                            target="_blank"
                                            className="text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            Privacy Policy
                                        </Link>
                                    </Label>
                                </div>
                                {step1Form.formState.errors.agreeToTerms && (
                                    <p className="text-sm text-red-500">
                                        {step1Form.formState.errors.agreeToTerms.message}
                                    </p>
                                )}

                                {/* Submit */}
                                <Button type="submit" className="w-full">
                                    Continue
                                </Button>
                            </form>

                            {/* Footer */}
                            <div className="mt-6 text-center text-sm text-slate-600">
                                Already have an account?{" "}
                                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Sign in
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold">Tell us about yourself</h2>
                                <p className="text-sm text-slate-600">This helps us personalize your experience</p>
                            </div>

                            <form onSubmit={step2Form.handleSubmit(onStep2Submit, (errors) => console.error("Step 2 Validation Errors:", errors))} className="space-y-4">
                                {/* Job Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="jobTitle">Current Job Title</Label>
                                    <Controller
                                        control={step2Form.control}
                                        name="jobTitle"
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select your job title" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {jobTitles.map((title) => (
                                                        <SelectItem key={title} value={title}>
                                                            {title}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {step2Form.formState.errors.jobTitle && (
                                        <p className="text-sm text-red-500">
                                            {step2Form.formState.errors.jobTitle.message}
                                        </p>
                                    )}
                                </div>

                                {/* Years of Experience */}
                                <div className="space-y-2">
                                    <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                                    <Controller
                                        control={step2Form.control}
                                        name="yearsOfExperience"
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select your experience level" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {experienceLevels.map((level) => (
                                                        <SelectItem key={level} value={level}>
                                                            {level}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {step2Form.formState.errors.yearsOfExperience && (
                                        <p className="text-sm text-red-500">
                                            {step2Form.formState.errors.yearsOfExperience.message}
                                        </p>
                                    )}
                                </div>

                                {/* Industry */}
                                <div className="space-y-2">
                                    <Label htmlFor="industry">Industry</Label>
                                    <Controller
                                        control={step2Form.control}
                                        name="industry"
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select your industry" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {industries.map((industry) => (
                                                        <SelectItem key={industry} value={industry}>
                                                            {industry}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {step2Form.formState.errors.industry && (
                                        <p className="text-sm text-red-500">
                                            {step2Form.formState.errors.industry.message}
                                        </p>
                                    )}
                                </div>

                                {/* State */}
                                <div className="space-y-2">
                                    <Label htmlFor="state">State</Label>
                                    <Controller
                                        control={step2Form.control}
                                        name="state"
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select your state" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {NIGERIAN_STATES.map((state) => (
                                                        <SelectItem key={state} value={state}>
                                                            {state}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {step2Form.formState.errors.state && (
                                        <p className="text-sm text-red-500">
                                            {step2Form.formState.errors.state.message}
                                        </p>
                                    )}
                                </div>

                                {/* Current Company (Optional) */}
                                <div className="space-y-2">
                                    <Label htmlFor="currentCompany">
                                        Current Company <span className="text-slate-400 text-xs">(Optional)</span>
                                    </Label>
                                    <Input
                                        id="currentCompany"
                                        placeholder="Company name"
                                        {...step2Form.register("currentCompany")}
                                    />
                                </div>

                                {/* How did you hear about us (Optional) */}
                                <div className="space-y-2">
                                    <Label htmlFor="hearAboutUs">
                                        How did you hear about us? <span className="text-slate-400 text-xs">(Optional)</span>
                                    </Label>
                                    <Controller
                                        control={step2Form.control}
                                        name="hearAboutUs"
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select an option" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {hearAboutUsOptions.map((option) => (
                                                        <SelectItem key={option} value={option}>
                                                            {option}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setCurrentStep(1)}
                                        disabled={isLoading}
                                        className="flex-1"
                                    >
                                        Back
                                    </Button>
                                    <Button type="submit" disabled={isLoading} className="flex-1">
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            "Create Account"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}
                </CardContent>
            </Card>
        </AuthLayout>
    );
}
