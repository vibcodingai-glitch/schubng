"use client";

import { Badge } from "@/components/ui/badge";
import {
    Circle,
    Clock,
    Eye,
    CheckCircle,
    XCircle,
    AlertTriangle,
    type LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VerificationStatus } from "@/types";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * VerificationBadge Component
 * 
 * Displays a status badge for certifications with appropriate icon, color, and tooltip.
 * 
 * Status meanings:
 * - unverified: No verification submitted
 * - pending: Verification payment pending or awaiting submission
 * - in_review: Currently being reviewed by admin
 * - verified: Successfully verified
 * - failed: Verification failed
 * - expired: Certification has expired
 * 
 * @param status - Current verification status
 * @param size - Badge size variant
 */

interface VerificationBadgeProps {
    status: VerificationStatus;
    size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<VerificationStatus, {
    label: string;
    icon: LucideIcon;
    colorClass: string;
    bgClass: string;
    borderClass: string;
    tooltip: string;
}> = {
    unverified: {
        label: "Unverified",
        icon: Circle,
        colorClass: "text-slate-700",
        bgClass: "bg-slate-100",
        borderClass: "border-slate-200",
        tooltip: "This certification has not been submitted for verification yet."
    },
    pending: {
        label: "Pending",
        icon: Clock,
        colorClass: "text-amber-700",
        bgClass: "bg-amber-50",
        borderClass: "border-amber-200",
        tooltip: "Verification payment is pending or awaiting submission to admin queue."
    },
    in_review: {
        label: "In Review",
        icon: Eye,
        colorClass: "text-blue-700",
        bgClass: "bg-blue-50",
        borderClass: "border-blue-200",
        tooltip: "Your certification is currently being reviewed by our verification team."
    },
    verified: {
        label: "Verified",
        icon: CheckCircle,
        colorClass: "text-emerald-700",
        bgClass: "bg-emerald-50",
        borderClass: "border-emerald-200",
        tooltip: "This certification has been verified and confirmed as authentic."
    },
    failed: {
        label: "Failed",
        icon: XCircle,
        colorClass: "text-red-700",
        bgClass: "bg-red-50",
        borderClass: "border-red-200",
        tooltip: "Verification failed. Please check the failure reason and resubmit if needed."
    },
    expired: {
        label: "Expired",
        icon: AlertTriangle,
        colorClass: "text-orange-700",
        bgClass: "bg-orange-50",
        borderClass: "border-orange-200",
        tooltip: "This certification has expired. Please upload a renewed certificate."
    }
};

export function VerificationBadge({ status, size = 'md' }: VerificationBadgeProps) {
    const config = STATUS_CONFIG[status];
    const Icon = config.icon;

    const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';
    const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Badge
                        variant="outline"
                        className={cn(
                            "gap-1.5 font-medium border",
                            config.colorClass,
                            config.bgClass,
                            config.borderClass,
                            sizeClass
                        )}
                    >
                        <Icon className={iconSize} />
                        {config.label}
                    </Badge>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="max-w-xs">{config.tooltip}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
