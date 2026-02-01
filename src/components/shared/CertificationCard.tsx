"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Calendar,
    Building2,
    Hash,
    MoreVertical,
    CheckCircle2,
    Pencil,
    Trash2,
    Eye,
    Clock
} from "lucide-react";
import { Certification } from "@/types";
import { VerificationBadge } from "./VerificationBadge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

/**
 * CertificationCard Component
 * 
 * Reusable certification display card with two variants:
 * - full: Complete details with all metadata
 * - compact: Condensed view for lists
 * 
 * Shows certification details, verification status, and contextual actions.
 * 
 * @param certification - Certification object
 * @param variant - Display variant
 * @param onVerify - Optional callback for verify action
 * @param onEdit - Optional callback for edit action
 * @param onDelete - Optional callback for delete action
 * @param onView - Optional callback for view action
 * @param className - Additional CSS classes
 */

interface CertificationCardProps {
    certification: Certification;
    variant?: 'full' | 'compact';
    onVerify?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onView?: () => void;
    className?: string;
}

export function CertificationCard({
    certification,
    variant = 'full',
    onVerify,
    onEdit,
    onDelete,
    onView,
    className
}: CertificationCardProps) {
    const hasActions = onVerify || onEdit || onDelete || onView;
    const isExpired = certification.expiryDate && new Date(certification.expiryDate) < new Date();
    const displayName = certification.customName || certification.type;

    // Compact variant
    if (variant === 'compact') {
        return (
            <Card className={cn("hover:shadow-md transition-shadow", className)}>
                <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-slate-900 truncate">
                                    {displayName}
                                </h3>
                                <VerificationBadge status={certification.verificationStatus} size="sm" />
                            </div>

                            <div className="flex items-center gap-4 text-sm text-slate-600">
                                <span className="flex items-center gap-1">
                                    <Building2 className="w-3.5 h-3.5" />
                                    {certification.issuingBody}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {format(new Date(certification.issueDate), "MMM yyyy")}
                                </span>
                            </div>
                        </div>

                        {hasActions && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {onView && (
                                        <DropdownMenuItem onClick={onView}>
                                            <Eye className="w-4 h-4 mr-2" />
                                            View Details
                                        </DropdownMenuItem>
                                    )}
                                    {onVerify && certification.verificationStatus === 'unverified' && (
                                        <DropdownMenuItem onClick={onVerify}>
                                            <CheckCircle2 className="w-4 h-4 mr-2" />
                                            Request Verification
                                        </DropdownMenuItem>
                                    )}
                                    {onEdit && (
                                        <DropdownMenuItem onClick={onEdit}>
                                            <Pencil className="w-4 h-4 mr-2" />
                                            Edit
                                        </DropdownMenuItem>
                                    )}
                                    {onDelete && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={onDelete} className="text-red-600">
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Full variant
    return (
        <Card className={cn("hover:shadow-lg transition-shadow", className)}>
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 mb-1">
                            {displayName}
                        </h3>
                        <p className="text-sm text-slate-600 flex items-center gap-1.5">
                            <Building2 className="w-4 h-4" />
                            {certification.issuingBody}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <VerificationBadge status={certification.verificationStatus} />
                        {isExpired && (
                            <Badge variant="destructive" className="gap-1">
                                <Clock className="w-3 h-3" />
                                Expired
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Certification Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            Credential ID
                        </p>
                        <div className="flex items-center gap-1.5 text-sm">
                            <Hash className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-mono text-slate-900">{certification.credentialId}</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            Issue Date
                        </p>
                        <div className="flex items-center gap-1.5 text-sm">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-slate-900">
                                {format(new Date(certification.issueDate), "MMMM d, yyyy")}
                            </span>
                        </div>
                    </div>

                    {certification.expiryDate && (
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                Expiry Date
                            </p>
                            <div className="flex items-center gap-1.5 text-sm">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                <span className={cn(
                                    "text-slate-900",
                                    isExpired && "text-red-600 font-medium"
                                )}>
                                    {format(new Date(certification.expiryDate), "MMMM d, yyyy")}
                                </span>
                            </div>
                        </div>
                    )}

                    {certification.verifiedDate && (
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                Verified On
                            </p>
                            <div className="flex items-center gap-1.5 text-sm">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-slate-900">
                                    {format(new Date(certification.verifiedDate), "MMMM d, yyyy")}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Failure Reason */}
                {certification.failureReason && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                        <p className="text-sm font-medium text-red-900 mb-1">Verification Failed</p>
                        <p className="text-sm text-red-700">{certification.failureReason}</p>
                    </div>
                )}
            </CardContent>

            {/* Actions Footer */}
            {hasActions && (
                <CardFooter className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {onView && (
                            <Button variant="outline" size="sm" onClick={onView}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                            </Button>
                        )}
                        {onVerify && certification.verificationStatus === 'unverified' && (
                            <Button size="sm" onClick={onVerify} className="bg-blue-600 hover:bg-blue-700">
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Request Verification
                            </Button>
                        )}
                    </div>

                    {(onEdit || onDelete) && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {onEdit && (
                                    <DropdownMenuItem onClick={onEdit}>
                                        <Pencil className="w-4 h-4 mr-2" />
                                        Edit
                                    </DropdownMenuItem>
                                )}
                                {onDelete && (
                                    <>
                                        {onEdit && <DropdownMenuSeparator />}
                                        <DropdownMenuItem onClick={onDelete} className="text-red-600">
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </CardFooter>
            )}
        </Card>
    );
}
