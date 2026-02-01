import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
    }).format(amount);
}

export function formatDate(date: Date | string) {
    return new Intl.DateTimeFormat("en-NG", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(date));
}

export function getVerificationStatusColor(status: string) {
    switch (status) {
        case "verified":
            return "verified-badge";
        case "pending":
            return "pending-badge";
        case "failed":
            return "failed-badge";
        default:
            return "unverified-badge";
    }
}

export function getTrustScoreLevel(score: number): "high" | "medium" | "low" {
    if (score >= 80) return "high";
    if (score >= 50) return "medium";
    return "low";
}
