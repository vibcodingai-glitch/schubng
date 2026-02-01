"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * LoadingState Component
 * 
 * Versatile loading indicator with three display modes:
 * - page: Full-page centered spinner
 * - section: Section-level skeleton loader
 * - inline: Inline loading text with spinner
 * 
 * @param type - Loading display type
 * @param message - Optional loading message
 * @param className - Additional CSS classes
 */

interface LoadingStateProps {
    type?: 'page' | 'section' | 'inline';
    message?: string;
    className?: string;
}

export function LoadingState({
    type = 'section',
    message,
    className
}: LoadingStateProps) {
    // Full page loading
    if (type === 'page') {
        return (
            <div className={cn(
                "fixed inset-0 flex flex-col items-center justify-center bg-white z-50",
                className
            )}>
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                <p className="text-sm text-slate-600">
                    {message || "Loading..."}
                </p>
            </div>
        );
    }

    // Section skeleton loading
    if (type === 'section') {
        return (
            <div className={cn("space-y-4 animate-pulse", className)}>
                <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                    <div className="h-4 bg-slate-200 rounded w-4/6"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="h-32 bg-slate-200 rounded"></div>
                    <div className="h-32 bg-slate-200 rounded"></div>
                </div>
                {message && (
                    <p className="text-sm text-slate-500 text-center mt-4">
                        {message}
                    </p>
                )}
            </div>
        );
    }

    // Inline loading
    return (
        <div className={cn("flex items-center gap-2 text-slate-600", className)}>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">
                {message || "Loading..."}
            </span>
        </div>
    );
}
