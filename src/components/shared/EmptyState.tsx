"use client";

import { Button } from "@/components/ui/button";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * EmptyState Component
 * 
 * Displays a friendly empty state with icon, title, description, and optional CTA.
 * Used when there's no data to display (e.g., no certifications, no transactions).
 * 
 * @param icon - Lucide icon component to display
 * @param title - Main heading text
 * @param description - Supporting description text
 * @param action - Optional CTA button configuration
 * @param className - Additional CSS classes
 */

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className
}: EmptyStateProps) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center text-center py-12 px-4",
            className
        )}>
            <div className="w-16 h-16 mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                <Icon className="w-8 h-8 text-slate-400" />
            </div>

            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {title}
            </h3>

            <p className="text-sm text-slate-500 max-w-sm mb-6">
                {description}
            </p>

            {action && (
                <Button onClick={action.onClick}>
                    {action.label}
                </Button>
            )}
        </div>
    );
}
