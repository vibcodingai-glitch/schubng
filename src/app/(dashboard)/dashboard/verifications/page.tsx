"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle2, Clock, AlertCircle, FileText, ArrowRight, Loader2, XCircle, Download, RefreshCw, HelpCircle, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getVerificationData } from "@/lib/actions/dashboard.actions";

export default function VerificationsPage() {
    const [activeTab, setActiveTab] = useState("all");
    const [verifications, setVerifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadVerifications() {
            setLoading(true);
            try {
                const data = await getVerificationData();

                // Transform DB data to UI format
                const transformed = (data || []).map((cert: any) => {
                    const latestReq = cert.verificationRequests?.[0]; // Assuming most recent request
                    const status = mapStatus(cert.status);

                    return {
                        id: latestReq?.id || cert.id,
                        certificationId: cert.id,
                        certificationName: cert.title, // 'title' in DB vs 'certificationName' in UI mock
                        issuingBody: cert.issuingOrganization,
                        status: status,
                        submittedAt: latestReq?.createdAt || cert.createdAt,
                        completedAt: cert.verifiedAt || latestReq?.updatedAt,
                        verificationId: latestReq?.id ? `VRF-${latestReq.id.slice(0, 8).toUpperCase()}` : "N/A",
                        reason: cert.rejectionReason,
                        timeline: buildTimeline(cert, latestReq)
                    };
                });
                setVerifications(transformed);
            } catch (err) {
                console.error("Failed to load verifications", err);
            } finally {
                setLoading(false);
            }
        }
        loadVerifications();
    }, []);

    const filteredVerifications = verifications.filter((v) => {
        if (activeTab === "all") return true;
        if (activeTab === "in_progress") return v.status === "in_progress";
        if (activeTab === "completed") return v.status === "verified" || v.status === "failed";
        return true;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "verified":
                return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Verified</Badge>;
            case "in_progress":
                return <Badge className="bg-blue-100 text-blue-700 border-blue-200 animate-pulse">In Progress</Badge>;
            case "failed":
                return <Badge className="bg-red-100 text-red-700 border-red-200">Failed</Badge>;
            default:
                return <Badge variant="outline">Unknown ({status})</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Verification Status</h1>
                <p className="text-slate-600 mt-2">Track the progress of your certification verifications</p>
            </div>

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList>
                    <TabsTrigger value="all">All ({verifications.length})</TabsTrigger>
                    <TabsTrigger value="in_progress">In Progress ({verifications.filter(v => v.status === "in_progress").length})</TabsTrigger>
                    <TabsTrigger value="completed">Completed ({verifications.filter(v => v.status === "verified" || v.status === "failed").length})</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-6">
                    {filteredVerifications.length > 0 ? (
                        filteredVerifications.map((verification) => (
                            <Card key={verification.id} className="overflow-hidden">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-lg text-slate-900">{verification.certificationName}</h3>
                                                {getStatusBadge(verification.status)}
                                            </div>
                                            <p className="text-sm text-slate-500">
                                                {verification.issuingBody} • Submitted on {format(new Date(verification.submittedAt), "MMM d, yyyy")}
                                            </p>
                                        </div>
                                        {verification.status === "verified" && (
                                            <div className="text-right">
                                                <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Verification ID</p>
                                                <p className="font-mono text-sm font-medium text-slate-900">{verification.verificationId}</p>
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-6">
                                    {verification.status === "in_progress" ? (
                                        <div className="space-y-6">
                                            <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-slate-200">
                                                {verification.timeline.map((step: any, index: number) => {
                                                    const isCompleted = !!step.completedAt;
                                                    // Simple logic for "current" step visualization
                                                    const isCurrent = !isCompleted && (index === 0 || !!verification.timeline[index - 1].completedAt);

                                                    return (
                                                        <div key={index} className="relative">
                                                            <div className={cn(
                                                                "absolute -left-[29px] w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white z-10",
                                                                isCompleted ? "border-emerald-500 text-emerald-500" :
                                                                    isCurrent ? "border-blue-500 text-blue-500" : "border-slate-300 text-slate-300"
                                                            )}>
                                                                {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                                                                    isCurrent ? <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" /> :
                                                                        <div className="w-2 h-2 bg-slate-200 rounded-full" />}
                                                            </div>
                                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                                                                <div>
                                                                    <p className={cn("font-medium text-sm", isCompleted || isCurrent ? "text-slate-900" : "text-slate-500")}>
                                                                        {step.label}
                                                                    </p>
                                                                    <p className="text-xs text-slate-500">{step.description}</p>
                                                                </div>
                                                                {step.completedAt && (
                                                                    <span className="text-xs text-slate-400 whitespace-nowrap">
                                                                        {format(new Date(step.completedAt), "MMM d, h:mm a")}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3 text-sm text-blue-800">
                                                <Clock className="w-5 h-5 flex-shrink-0 text-blue-600" />
                                                <div>
                                                    <p className="font-medium">Estimated completion: 2-4 business days</p>
                                                    <p className="text-blue-600 mt-1">We are currently verifying your credentials with the issuing body.</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : verification.status === "verified" ? (
                                        <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                                                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-900">Verification Successful!</h3>
                                                <p className="text-slate-600">Your certification has been verified and the badge is now visible on your profile.</p>
                                                <p className="text-sm text-slate-500 mt-1">Verified on {format(new Date(verification.completedAt || new Date()), "MMMM d, yyyy")}</p>
                                            </div>
                                            <div className="flex gap-3 pt-2">
                                                <Button variant="outline" className="gap-2">
                                                    <FileText className="w-4 h-4" /> View Certificate
                                                </Button>
                                                <Button variant="outline" className="gap-2">
                                                    <Download className="w-4 h-4" /> Download Verification
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                                <XCircle className="w-8 h-8 text-red-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-900">Verification Failed</h3>
                                                <p className="text-slate-600 max-w-md mx-auto">
                                                    We could not verify this certification. Reason: <span className="font-medium text-red-600">{verification.reason || "Unknown"}</span>
                                                </p>
                                                <p className="text-sm text-slate-500 mt-1">Failed on {format(new Date(verification.completedAt || new Date()), "MMMM d, yyyy")}</p>
                                            </div>
                                            <div className="flex gap-3 pt-2">
                                                <Button className="gap-2">
                                                    <RefreshCw className="w-4 h-4" /> Update & Resubmit
                                                </Button>
                                                <Button variant="ghost" className="gap-2">
                                                    <HelpCircle className="w-4 h-4" /> Contact Support
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                    <BadgeCheck className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">No verifications found</h3>
                                <p className="text-slate-500 max-w-sm mb-6">
                                    {activeTab === "all"
                                        ? "Submit a certification for verification to track it here."
                                        : `No verifications in the '${activeTab.replace('_', ' ')}' status.`}
                                </p>
                                <Link href={ROUTES.newCertification}>
                                    <Button>Add Certification</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

// Helpers
function mapStatus(dbStatus: string) {
    switch (dbStatus) {
        case "VERIFIED": return "verified";
        case "REJECTED": return "failed";
        case "PENDING": return "in_progress";
        default: return "in_progress";
    }
}

function buildTimeline(cert: any, latestReq: any) {
    // Basic timeline construction based on status
    const submitted = { step: "submitted", label: "Request Submitted", completedAt: latestReq?.createdAt || cert.createdAt, description: "Your verification request was received" };
    // Assuming payment is done if req exists - simplifying for MVP
    const step2 = { step: "payment", label: "Processing Fee", completedAt: latestReq?.createdAt || cert.createdAt, description: "Verification fee processed" };

    // Status specific steps
    let step3 = { step: "review", label: "Document Review", completedAt: null as string | null, description: "We are reviewing your document" };
    let step4 = { step: "verification", label: "Issuer Verification", completedAt: null as string | null, description: "Contacting issuing body" };
    let step5 = { step: "completed", label: "Completion", completedAt: null as string | null, description: "Final decision pending" };

    if (cert.status === "VERIFIED") {
        const d = cert.verifiedAt || new Date().toISOString();
        step3 = { ...step3, completedAt: d, description: "Document valid" };
        step4 = { ...step4, completedAt: d, description: "Issuer confirmed" };
        step5 = { ...step5, completedAt: d, description: "Badged issued" };
    } else if (cert.status === "REJECTED") {
        const d = cert.updatedAt || new Date().toISOString();
        step3 = { ...step3, completedAt: d, description: "Review completed" };
        step5 = { ...step5, completedAt: d, description: "Verification failed" };
    }

    return [submitted, step2, step3, step4, step5];
}
