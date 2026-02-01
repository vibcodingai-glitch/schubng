"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    CheckCircle2,
    Clock,
    AlertCircle,
    XCircle,
    MoreVertical,
    FileText,
    Download,
    Edit,
    Trash,
    Award,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export type CertificationStatus = "verified" | "pending" | "unverified" | "failed" | "expired";

export interface CertificationCardProps {
    id: string;
    name: string;
    issuingBody: string;
    credentialId: string;
    issueDate: string;
    expiryDate?: string | null;
    status: CertificationStatus;
    verifiedDate?: string;
    documentUrl?: string;
    addedDate: string;
}

export function CertificationCard({
    name,
    issuingBody,
    credentialId,
    issueDate,
    expiryDate,
    status,
    verifiedDate,
}: CertificationCardProps) {
    const getStatusBadge = (status: CertificationStatus) => {
        switch (status) {
            case "verified":
                return (
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200 gap-1 shadow-sm">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                    </Badge>
                );
            case "pending":
                return (
                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200 gap-1 shadow-sm">
                        <Clock className="w-3 h-3" /> Pending
                    </Badge>
                );
            case "failed":
                return (
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200 gap-1 shadow-sm">
                        <XCircle className="w-3 h-3" /> Failed
                    </Badge>
                );
            case "expired":
                return (
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200 gap-1 shadow-sm">
                        <AlertCircle className="w-3 h-3" /> Expired
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline" className="text-slate-500 gap-1 shadow-sm">
                        <div className="w-2 h-2 rounded-full border border-slate-400" /> Unverified
                    </Badge>
                );
        }
    };

    const getAccentColor = (status: CertificationStatus) => {
        switch (status) {
            case "verified":
                return "from-emerald-500 to-teal-500";
            case "pending":
                return "from-amber-400 to-orange-500";
            case "failed":
                return "from-red-500 to-rose-500";
            case "expired":
                return "from-orange-500 to-red-400";
            default:
                return "from-slate-300 to-slate-400";
        }
    };

    return (
        <Card className="glass-card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative">
            {/* Gradient Accent Bar */}
            <div className={cn(
                "absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r",
                getAccentColor(status)
            )} />

            <CardHeader className="flex flex-row items-start justify-between pb-3 pt-5">
                <div className="flex items-start gap-4">
                    <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg transition-transform group-hover:scale-105",
                        status === "verified"
                            ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
                            : status === "pending"
                                ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white"
                                : "bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500"
                    )}>
                        <Award className="w-6 h-6" />
                    </div>
                    <div className="pt-0.5">
                        <h3 className="font-bold text-slate-900 line-clamp-2 text-lg leading-tight">{name}</h3>
                        <p className="text-sm text-slate-500 mt-0.5">{issuingBody}</p>
                    </div>
                </div>
                {getStatusBadge(status)}
            </CardHeader>

            <CardContent className="pb-4">
                <div className="grid grid-cols-2 gap-y-3 text-sm bg-slate-50/50 rounded-lg p-3 border border-slate-100">
                    <div className="text-slate-500 font-medium">Credential ID</div>
                    <div className="text-slate-800 font-mono text-xs pt-0.5 truncate">{credentialId}</div>

                    <div className="text-slate-500 font-medium">Issued</div>
                    <div className="text-slate-800">{format(new Date(issueDate), "MMM yyyy")}</div>

                    <div className="text-slate-500 font-medium">Expires</div>
                    <div className="text-slate-800">
                        {expiryDate ? format(new Date(expiryDate), "MMM yyyy") : "No Expiration"}
                    </div>

                    {status === "verified" && verifiedDate && (
                        <>
                            <div className="text-slate-500 font-medium">Verified</div>
                            <div className="text-emerald-600 font-medium">{format(new Date(verifiedDate), "MMM d, yyyy")}</div>
                        </>
                    )}
                </div>
            </CardContent>

            <CardFooter className="pt-0 pb-4 flex justify-between gap-2">
                <div className="flex gap-2 w-full">
                    {status === "unverified" && (
                        <Button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20" size="sm">
                            Verify Now
                        </Button>
                    )}
                    {status === "pending" && (
                        <Button variant="outline" className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50" size="sm">
                            <Clock className="w-4 h-4 mr-2" /> View Status
                        </Button>
                    )}
                    {status === "verified" && (
                        <Button variant="outline" className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50" size="sm">
                            <FileText className="w-4 h-4 mr-2" /> View Certificate
                        </Button>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-slate-100">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass-card">
                            <DropdownMenuItem className="cursor-pointer">
                                <Edit className="w-4 h-4 mr-2" /> Edit Details
                            </DropdownMenuItem>
                            {status === "verified" && (
                                <DropdownMenuItem className="cursor-pointer">
                                    <Download className="w-4 h-4 mr-2" /> Download
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer">
                                <Trash className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardFooter>
        </Card>
    );
}
