"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
    ArrowLeft,
    ExternalLink,
    CheckCircle2,
    ZoomIn,
    ZoomOut,
    RotateCw,
    Maximize2,
    Download,
    Copy,
    Clock,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { verifyRequest } from "@/lib/actions/admin.actions";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface VerificationDetailProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request: any; // Type strictly later
}

export function VerificationDetail({ request }: VerificationDetailProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [zoom, setZoom] = useState(100);
    const [notes, setNotes] = useState(request.notes || "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [checklist, setChecklist] = useState({
        legible: false,
        nameMatch: false,
        idValid: false,
        issuerVerified: false,
        notExpired: false,
    });

    const handleCheck = (key: keyof typeof checklist) => {
        setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleAction = async (status: "APPROVED" | "REJECTED") => {
        if (status === "APPROVED") {
            // Check if all checklist items are checked (optional enforcement)
            const allChecked = Object.values(checklist).every(Boolean);
            if (!allChecked) {
                const confirm = window.confirm("Not all checklist items are completed. Proceed with approval?");
                if (!confirm) return;
            }
        } else {
            if (!notes) {
                toast({
                    title: "Notes Required",
                    description: "Please provide a reason for rejection in the notes.",
                    variant: "destructive"
                });
                return;
            }
        }

        setIsSubmitting(true);
        try {
            const result = await verifyRequest(request.id, status, notes);
            if (result.error) {
                toast({ title: "Error", description: result.error, variant: "destructive" });
            } else {
                toast({ title: "Success", description: result.success });
                router.push("/admin/verifications");
            }
        } catch {
            toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const cert = request.certification;
    const user = cert.user;

    // Calculate waiting time
    const submittedDate = new Date(request.createdAt);
    const waitingTimeMs = new Date().getTime() - submittedDate.getTime();
    const waitingTimeHours = Math.floor(waitingTimeMs / (1000 * 60 * 60));
    const waitingLabel = waitingTimeHours > 24
        ? `${Math.floor(waitingTimeHours / 24)} days`
        : `${waitingTimeHours} hours`;

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
                <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
                    <div className="flex items-center gap-4 w-full">
                        <Link href="/admin/verifications">
                            <Button variant="ghost" size="sm" className="gap-1 pl-0 text-slate-500 hover:text-slate-900">
                                <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Back</span>
                            </Button>
                        </Link>
                        <Separator orientation="vertical" className="h-6 hidden sm:block" />
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="font-bold text-slate-900 truncate">{cert.name}</h1>
                                <Badge variant="outline" className="bg-slate-100 text-slate-600 whitespace-nowrap">{request.status}</Badge>
                            </div>
                            <div className="text-sm text-slate-500 flex flex-wrap items-center gap-2 mt-1">
                                <span>For: <span className="font-medium text-slate-900">{user.firstName} {user.lastName}</span></span>
                                <span className="hidden sm:inline">•</span>
                                <span className="flex items-center gap-1 whitespace-nowrap"><Clock className="w-3 h-3" /> Time in queue: {waitingLabel}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Left Column: Document Viewer */}
                <div className="w-full lg:w-3/5 bg-slate-100 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 h-[50vh] lg:h-auto">
                    {/* Toolbar */}
                    <div className="bg-white border-b border-slate-200 p-2 flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.max(50, z - 10))}><ZoomOut className="w-4 h-4" /></Button>
                        <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
                        <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.min(200, z + 10))}><ZoomIn className="w-4 h-4" /></Button>
                        <Separator orientation="vertical" className="h-6 mx-2" />
                        <Button variant="ghost" size="icon"><RotateCw className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon"><Maximize2 className="w-4 h-4" /></Button>
                        {cert.documentUrl ? (
                            <a href={cert.documentUrl} target="_blank" download>
                                <Button variant="ghost" size="icon"><Download className="w-4 h-4" /></Button>
                            </a>
                        ) : null}
                    </div>

                    {/* Viewer Area */}
                    <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
                        <div
                            className="bg-white shadow-lg transition-transform duration-200 origin-center"
                            style={{ width: '600px', height: '800px', transform: `scale(${zoom / 100})` }}
                        >
                            {cert.documentUrl ? (
                                <div className="relative w-full h-full">
                                    {/* Using unoptimized because documents might be arbitrary URLs or PDFs previewed as images */}
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={cert.documentUrl}
                                        alt="Document"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400">
                                    No document uploaded
                                </div>
                            )}
                        </div>
                    </div>

                    {/* OCR Results - Placeholder */}
                    <div className="bg-white border-t border-slate-200 p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                <div className="w-2 h-2 bg-slate-300 rounded-full" />
                                Extracted Information (OCR)
                            </h3>
                            <Badge variant="outline" className="text-slate-500">Not Available</Badge>
                        </div>
                        <p className="text-xs text-slate-500">OCR extraction is disabled in this environment.</p>
                    </div>
                </div>

                {/* Right Column: Details & Actions */}
                <div className="w-full lg:w-2/5 bg-white flex flex-col overflow-y-auto">
                    <div className="p-6 space-y-8 pb-32">

                        {/* User Info */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">User Information</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-3">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">{user.firstName} {user.lastName}</div>
                                        <div className="text-slate-500">Joined {new Date(user.createdAt).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div>
                                        <p className="text-slate-500 text-xs">Email</p>
                                        <div className="flex items-center gap-1">
                                            <span className="font-medium truncate">{user.email}</span>
                                            <Button variant="ghost" size="icon" className="h-4 w-4"><Copy className="w-3 h-3" /></Button>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-xs">Trust Score</p>
                                        <span className="font-medium text-emerald-600">{user.trustScore}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Certification Details */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Certification Details</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-slate-500 text-xs">Type</p>
                                        <p className="font-medium">{cert.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-xs">Issuing Body</p>
                                        <p className="font-medium">{cert.issuingOrganization}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-xs">Credential ID</p>
                                        <p className="font-medium font-mono bg-slate-50 px-1 rounded inline-block">{cert.credentialId}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-xs">Issue Date</p>
                                        <p className="font-medium">{new Date(cert.issueDate).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="pt-2 space-y-2">
                                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">External Verification</p>
                                    <div className="flex gap-2">
                                        {cert.verificationUrl ? (
                                            <Button variant="outline" size="sm" className="w-full gap-1" asChild>
                                                <a href={cert.verificationUrl} target="_blank" rel="noopener noreferrer">
                                                    Open Registry <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </Button>
                                        ) : (
                                            <div className="text-slate-400 text-sm">No verification URL provided</div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Checklist */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Verification Checklist</CardTitle>
                                <CardDescription>Confirm all points before approving</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="legible" checked={checklist.legible} onCheckedChange={() => handleCheck('legible')} />
                                    <label htmlFor="legible" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Document is legible and authentic
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="nameMatch" checked={checklist.nameMatch} onCheckedChange={() => handleCheck('nameMatch')} />
                                    <label htmlFor="nameMatch" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Name on document matches profile
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="idValid" checked={checklist.idValid} onCheckedChange={() => handleCheck('idValid')} />
                                    <label htmlFor="idValid" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Credential ID format is valid
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="issuerVerified" checked={checklist.issuerVerified} onCheckedChange={() => handleCheck('issuerVerified')} />
                                    <label htmlFor="issuerVerified" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Verified with issuing body registry
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="notExpired" checked={checklist.notExpired} onCheckedChange={() => handleCheck('notExpired')} />
                                    <label htmlFor="notExpired" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Certificate is not expired
                                    </label>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Internal Notes */}
                        <div className="space-y-2">
                            <Label>Internal Notes</Label>
                            <Textarea
                                placeholder="Add internal notes about this verification..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="min-h-[100px]"
                            />
                        </div>
                    </div>

                    {/* Sticky Actions Footer */}
                    <div className="p-4 bg-white border-t border-slate-200 sticky bottom-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            {/* Request Info logic not implemented yet */}
                            <Button variant="outline" className="w-full border-amber-200 text-amber-700 hover:bg-amber-50" disabled>
                                Request More Info
                            </Button>
                            <Button variant="destructive" className="w-full bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" onClick={() => handleAction("REJECTED")} disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reject Verification"}
                            </Button>
                        </div>

                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-lg font-medium" onClick={() => handleAction("APPROVED")} disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                <>
                                    <CheckCircle2 className="w-5 h-5 mr-2" /> Approve Verification
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
