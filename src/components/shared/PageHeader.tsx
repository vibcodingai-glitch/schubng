"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

/**
 * PageHeader Component
 * 
 * Consistent page header with title, subtitle, breadcrumbs, and action buttons.
 * Provides a standardized layout for page headers across the application.
 * 
 * @param title - Main page title
 * @param subtitle - Optional subtitle/description
 * @param breadcrumbs - Optional breadcrumb navigation items
 * @param actions - Optional action buttons (React nodes)
 * @param className - Additional CSS classes
 */

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    breadcrumbs?: Array<{
        label: string;
        href?: string;
    }>;
    actions?: ReactNode;
    className?: string;
}

export function PageHeader({
    title,
    subtitle,
    breadcrumbs,
    actions,
    className
}: PageHeaderProps) {
    return (
        <div className={cn("space-y-4", className)}>
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="flex items-center text-sm text-slate-500">
                    {breadcrumbs.map((crumb, index) => (
                        <div key={index} className="flex items-center">
                            {index > 0 && (
                                <ChevronRight className="w-4 h-4 mx-2 text-slate-300" />
                            )}
                            {crumb.href ? (
                                <Link
                                    href={crumb.href}
                                    className="hover:text-slate-900 transition-colors"
                                >
                                    {crumb.label}
                                </Link>
                            ) : (
                                <span className="text-slate-900 font-medium">
                                    {crumb.label}
                                </span>
                            )}
                        </div>
                    ))}
                </nav>
            )}

            {/* Title and Actions */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="mt-2 text-sm md:text-base text-slate-600">
                            {subtitle}
                        </p>
                    )}
                </div>

                {actions && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}
