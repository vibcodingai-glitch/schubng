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
import { updateVerificationStatus } from "@/lib/actions/admin.actions";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface VerificationDetailProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request: any; // Using the normalized type from action
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

    const handleAction = async (status: "VERIFIED" | "REJECTED") => {
        if (status === "VERIFIED") {
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
            await updateVerificationStatus(request.id, status, notes);
            toast({ title: "Success", description: `Request ${status.toLowerCase()} successfully.` });
            router.push("/admin/verifications");
        } catch {
            toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const item = request.item;
    const user = request.user;

    // Calculate waiting time
    const submittedDate = new Date(request.createdAt);
    const waitingTimeMs = new Date().getTime() - submittedDate.getTime();
    const waitingTimeHours = Math.floor(waitingTimeMs / (1000 * 60 * 60));
    const waitingLabel = waitingTimeHours > 24
        ? `${Math.floor(waitingTimeHours / 24)} days`
        : `${waitingTimeHours} hours`;

    if (!user || !item) {
        return <div className="p-8">Error loading request details.</div>;
    }

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
                                <h1 className="font-bold text-slate-900 truncate">{item.title}</h1>
                                <Badge variant="outline" className="bg-slate-100 text-slate-600 whitespace-nowrap">{request.status}</Badge>
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700">{request.type}</Badge>
                            </div>
                            <div className="text-sm text-slate-500 flex flex-wrap items-center gap-2 mt-1">
                                <span>For: <span className="font-medium text-slate-900">{user.name}</span></span>
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
                        {item.documentUrl ? (
                            <a href={item.documentUrl} target="_blank" download>
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
                            {item.documentUrl ? (
                                <div className="relative w-full h-full">
                                    {/* Using unoptimized because documents might be arbitrary URLs or PDFs previewed as images */}
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <iframe
                                        src={item.documentUrl}
                                        title="Document"
                                        className="w-full h-full"
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400">
                                    No document uploaded
                                </div>
                            )}
                        </div>
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
                                        <AvatarFallback>{user.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">{user.name}</div>
                                        <div className="text-slate-500">{user.email}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Item Details */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">{request.type} Details</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-slate-500 text-xs">Title/Role</p>
                                        <p className="font-medium">{item.title}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-xs">Organization</p>
                                        <p className="font-medium">{item.subtitle}</p>
                                    </div>

                                    {/* Type specific fields */}
                                    {request.type === 'Certification' && (
                                        <>
                                            <div>
                                                <p className="text-slate-500 text-xs">Credential ID</p>
                                                <p className="font-medium font-mono bg-slate-50 px-1 rounded inline-block">{item.details?.credentialId || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 text-xs">Issue Date</p>
                                                <p className="font-medium">{item.details?.issueDate ? new Date(item.details.issueDate).toLocaleDateString() : 'N/A'}</p>
                                            </div>
                                        </>
                                    )}

                                    {request.type === 'Education' && (
                                        <>
                                            <div>
                                                <p className="text-slate-500 text-xs">Degree</p>
                                                <p className="font-medium">{item.details?.degree || item.title}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 text-xs">Year</p>
                                                <p className="font-medium">{item.details?.startYear} - {item.details?.endYear || 'Present'}</p>
                                            </div>
                                        </>
                                    )}
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
                                    <label htmlFor="legible" className="text-sm font-medium leading-none">Document is legible</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="nameMatch" checked={checklist.nameMatch} onCheckedChange={() => handleCheck('nameMatch')} />
                                    <label htmlFor="nameMatch" className="text-sm font-medium leading-none">Name matches profile</label>
                                </div>
                                {/* Reduced checklist for brevity in this generic view */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="issuerVerified" checked={checklist.issuerVerified} onCheckedChange={() => handleCheck('issuerVerified')} />
                                    <label htmlFor="issuerVerified" className="text-sm font-medium leading-none">Verified with issuing body</label>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Internal Notes */}
                        <div className="space-y-2">
                            <Label>Internal Notes / Rejection Reason</Label>
                            <Textarea
                                placeholder="Add internal notes..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="min-h-[100px]"
                            />
                        </div>
                    </div>

                    {/* Sticky Actions Footer */}
                    <div className="p-4 bg-white border-t border-slate-200 sticky bottom-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <Button variant="outline" className="w-full" disabled>
                                Request More Info
                            </Button>
                            <Button variant="destructive" className="w-full bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" onClick={() => handleAction("REJECTED")} disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reject"}
                            </Button>
                        </div>

                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-lg font-medium" onClick={() => handleAction("VERIFIED")} disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                <>
                                    <CheckCircle2 className="w-5 h-5 mr-2" /> Approve
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
