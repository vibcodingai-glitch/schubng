"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Briefcase,
    GraduationCap,
    Award,
    Clock,
    Shield,
    MoreVertical,
    FileText,
    CheckCircle,
    XCircle,
    RotateCcw,
    ExternalLink,
    AlertTriangle,
    Mail,
    Phone,
    MapPin,
    Calendar,
    ArrowLeft
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { updateItemStatus, updateUserStatus } from "@/lib/actions/admin.actions";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Define types based on the prisma include, simplified
interface UserDetailProps {
    user: any; // We'll infer structure from usage or define strict types if preferred
}

export function AdminUserDetail({ user }: UserDetailProps) {
    const { toast } = useToast();
    const [viewDoc, setViewDoc] = useState<string | null>(null);

    const handleItemAction = async (type: 'certification' | 'education' | 'workExperience', id: string, status: 'VERIFIED' | 'REJECTED' | 'PENDING') => {
        const result = await updateItemStatus(type, id, status, "Admin manual update");
        if (result.success) {
            toast({ title: "Updated", description: `Item marked as ${status}` });
        } else {
            toast({ title: "Error", description: "Failed to update item", variant: "destructive" });
        }
    };

    const handleBanToggle = async () => {
        const isBanned = user.trustScore < 0; // Heuristic for now
        const result = await updateUserStatus(user.id, !isBanned);
        if (result.success) {
            toast({ title: "Success", description: `User ${!isBanned ? "banned" : "unbanned"}` });
        }
    };

    return (
        <div className="space-y-6">
            {/* Top Bar */}
            <div className="flex items-center gap-4">
                <Link href="/admin/users">
                    <Button variant="ghost" size="sm" className="gap-1 pl-0">
                        <ArrowLeft className="w-4 h-4" /> Back to Users
                    </Button>
                </Link>
            </div>

            {/* Profile Header */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <Card className="w-full md:w-1/3">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                            <Avatar className="w-24 h-24 mb-4 border-4 border-slate-50">
                                <AvatarImage src={user.profilePhotoUrl} />
                                <AvatarFallback className="text-xl bg-slate-200">{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                            </Avatar>
                            <h1 className="text-xl font-bold text-slate-900">{user.firstName} {user.lastName}</h1>
                            <p className="text-slate-500 text-sm mt-1">{user.headline || "No headline"}</p>

                            <div className="flex items-center gap-2 mt-4">
                                <Badge variant={user.trustScore < 0 ? "destructive" : "secondary"} className="gap-1">
                                    <Shield className="w-3 h-3" /> Score: {user.trustScore}
                                </Badge>
                                <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                                    {user.plan}
                                </Badge>
                            </div>

                            <div className="w-full mt-6 space-y-4 text-left">
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Mail className="w-4 h-4 text-slate-400" /> {user.email}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Phone className="w-4 h-4 text-slate-400" /> {user.phone || "No phone"}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <MapPin className="w-4 h-4 text-slate-400" /> {user.location || "No location"}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Calendar className="w-4 h-4 text-slate-400" /> Joined {new Date(user.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            <Separator className="my-6" />

                            <div className="w-full">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full">Admin Actions</Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuLabel>Account Control</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={handleBanToggle}>
                                            {user.trustScore < 0 ? "Unban User" : "Ban User"}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>Reset Password</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-red-600">Delete Account</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Tabs */}
                <div className="flex-1 w-full">
                    <Tabs defaultValue="credentials" className="space-y-6">
                        <TabsList>
                            <TabsTrigger value="credentials">Credentials</TabsTrigger>
                            <TabsTrigger value="activity">Activity</TabsTrigger>
                            <TabsTrigger value="transactions">Transactions</TabsTrigger>
                        </TabsList>

                        <TabsContent value="credentials" className="space-y-6">
                            {/* Certifications */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Award className="w-4 h-4 text-blue-500" /> Certifications
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {user.certifications.length === 0 ? <p className="text-sm text-slate-400">No certifications</p> :
                                        user.certifications.map((cert: any) => (
                                            <div key={cert.id} className="flex flex-col sm:flex-row sm:items-start justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 gap-3">
                                                <div className="flex-1">
                                                    <div className="font-medium text-slate-900">{cert.title}</div>
                                                    <div className="text-sm text-slate-500">{cert.issuingOrganization}</div>
                                                    <div className="text-xs text-slate-400 mt-1">
                                                        Issued: {new Date(cert.issueDate).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-200">
                                                    <StatusBadge status={cert.status} />
                                                    <div className="flex items-center gap-1">
                                                        {cert.documentUrl && (
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-6 sm:w-6" onClick={() => setViewDoc(cert.documentUrl)}>
                                                                <FileText className="w-4 h-4 sm:w-3 sm:h-3" />
                                                            </Button>
                                                        )}
                                                        <CredentialActions
                                                            item={cert}
                                                            type="certification"
                                                            onUpdate={handleItemAction}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </CardContent>
                            </Card>

                            {/* Education */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4 text-emerald-500" /> Education
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {user.education.length === 0 ? <p className="text-sm text-slate-400">No education</p> :
                                        user.education.map((edu: any) => (
                                            <div key={edu.id} className="flex flex-col sm:flex-row sm:items-start justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 gap-3">
                                                <div className="flex-1">
                                                    <div className="font-medium text-slate-900">{edu.institution}</div>
                                                    <div className="text-sm text-slate-500">{edu.degree} in {edu.fieldOfStudy}</div>
                                                    <div className="text-xs text-slate-400 mt-1">
                                                        {edu.startYear} - {edu.endYear || 'Present'}
                                                    </div>
                                                </div>
                                                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-200">
                                                    <StatusBadge status={edu.status} />
                                                    <div className="flex items-center gap-1">
                                                        {edu.documentUrl && (
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-6 sm:w-6" onClick={() => setViewDoc(edu.documentUrl)}>
                                                                <FileText className="w-4 h-4 sm:w-3 sm:h-3" />
                                                            </Button>
                                                        )}
                                                        <CredentialActions
                                                            item={edu}
                                                            type="education"
                                                            onUpdate={handleItemAction}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </CardContent>
                            </Card>

                            {/* Work Experience */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-purple-500" /> Work Experience
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {user.workExperience.length === 0 ? <p className="text-sm text-slate-400">No work experience</p> :
                                        user.workExperience.map((work: any) => (
                                            <div key={work.id} className="flex flex-col sm:flex-row sm:items-start justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 gap-3">
                                                <div className="flex-1">
                                                    <div className="font-medium text-slate-900">{work.role}</div>
                                                    <div className="text-sm text-slate-500">{work.company}</div>
                                                    <div className="text-xs text-slate-400 mt-1">
                                                        {new Date(work.startDate).toLocaleDateString()} - {work.endDate ? new Date(work.endDate).toLocaleDateString() : 'Present'}
                                                    </div>
                                                </div>
                                                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-200">
                                                    <StatusBadge status={work.status} />
                                                    <div className="flex items-center gap-1">
                                                        {work.documentUrl && (
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-6 sm:w-6" onClick={() => setViewDoc(work.documentUrl)}>
                                                                <FileText className="w-4 h-4 sm:w-3 sm:h-3" />
                                                            </Button>
                                                        )}
                                                        <CredentialActions
                                                            item={work}
                                                            type="workExperience"
                                                            onUpdate={handleItemAction}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="activity">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Activity Log</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4 relative pl-4 border-l border-slate-200 ml-2">
                                        {user.activityLogs.length === 0 ? <p className="text-sm text-slate-400">No recent activity</p> :
                                            user.activityLogs.map((log: any) => (
                                                <div key={log.id} className="relative pb-4 last:pb-0">
                                                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-slate-300 border-2 border-slate-50"></div>
                                                    <p className="text-sm font-medium text-slate-900">{log.actionType}</p>
                                                    <p className="text-sm text-slate-500">{log.description}</p>
                                                    <p className="text-xs text-slate-400 mt-1">{formatDistanceToNow(new Date(log.createdAt))} ago</p>
                                                </div>
                                            ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="transactions">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Transactions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {user.transactions.length === 0 ? <p className="text-sm text-slate-400">No transactions</p> :
                                            user.transactions.map((tx: any) => (
                                                <div key={tx.id} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-md">
                                                    <div>
                                                        <div className="font-mono text-xs text-slate-400">{tx.reference}</div>
                                                        <div className="text-sm font-medium">{tx.type}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-bold text-slate-900">₦{tx.amount.toString()}</div>
                                                        <Badge variant="outline" className="text-xs py-0 h-5 mt-1">{tx.status}</Badge>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Document Viewer Modal */}
            <Dialog open={!!viewDoc} onOpenChange={(open) => !open && setViewDoc(null)}>
                <DialogContent className="max-w-4xl h-[80vh] p-0 overflow-hidden">
                    <DialogHeader className="p-4 border-b">
                        <DialogTitle>Document Preview</DialogTitle>
                    </DialogHeader>
                    {viewDoc && (
                        <div className="flex-1 w-full h-full bg-slate-100 p-4 overflow-auto flex items-center justify-center">
                            <iframe src={viewDoc} className="w-full h-full bg-white shadow-sm" />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    if (status === 'VERIFIED') return <Badge className="bg-emerald-500 hover:bg-emerald-600">Verified</Badge>;
    if (status === 'REJECTED') return <Badge variant="destructive">Rejected</Badge>;
    if (status === 'PENDING') return <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200">Pending</Badge>;
    return <Badge variant="outline">{status}</Badge>;
}

function CredentialActions({ item, type, onUpdate }: { item: any, type: any, onUpdate: any }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVertical className="w-3 h-3" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Manual Action</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onUpdate(type, item.id, 'VERIFIED')}>
                    <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> Verify
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdate(type, item.id, 'REJECTED')}>
                    <XCircle className="w-4 h-4 mr-2 text-red-500" /> Reject
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdate(type, item.id, 'PENDING')}>
                    <RotateCcw className="w-4 h-4 mr-2 text-slate-500" /> Reset to Pending
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
