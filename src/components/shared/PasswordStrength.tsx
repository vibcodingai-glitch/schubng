"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
    password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
    const requirements = [
        { label: "At least 8 characters", test: (pwd: string) => pwd.length >= 8 },
        { label: "One uppercase letter", test: (pwd: string) => /[A-Z]/.test(pwd) },
        { label: "One number", test: (pwd: string) => /[0-9]/.test(pwd) },
        { label: "One special character", test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
    ];

    const metRequirements = requirements.filter((req) => req.test(password));
    const strength = metRequirements.length;

    const getStrengthLabel = () => {
        if (strength === 0) return { label: "", color: "" };
        if (strength === 1) return { label: "Weak", color: "text-red-500" };
        if (strength === 2) return { label: "Fair", color: "text-orange-500" };
        if (strength === 3) return { label: "Good", color: "text-yellow-500" };
        return { label: "Strong", color: "text-emerald-500" };
    };

    const getStrengthBarColor = () => {
        if (strength === 0) return "bg-slate-200";
        if (strength === 1) return "bg-red-500";
        if (strength === 2) return "bg-orange-500";
        if (strength === 3) return "bg-yellow-500";
        return "bg-emerald-500";
    };

    const strengthInfo = getStrengthLabel();

    return (
        <div className="space-y-3">
            {/* Strength Bar */}
            {password && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Password strength</span>
                        <span className={cn("font-medium", strengthInfo.color)}>
                            {strengthInfo.label}
                        </span>
                    </div>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4].map((level) => (
                            <div
                                key={level}
                                className={cn(
                                    "h-1 flex-1 rounded-full transition-colors",
                                    level <= strength ? getStrengthBarColor() : "bg-slate-200"
                                )}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Requirements Checklist */}
            <div className="space-y-1.5">
                {requirements.map((req, index) => {
                    const isMet = req.test(password);
                    return (
                        <div key={index} className="flex items-center gap-2 text-xs">
                            {isMet ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                                <X className="w-3.5 h-3.5 text-slate-300" />
                            )}
                            <span className={cn(isMet ? "text-emerald-600" : "text-slate-500")}>
                                {req.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
