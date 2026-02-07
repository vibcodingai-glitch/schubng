"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Search,
    Filter,
    Download,
    RefreshCw,
    Clock,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface VerificationQueueItem {
    id: string;
    createdAt: Date;
    status: string;
    type: string;
    title: string;
    issuer: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
        profilePhoto: string | null;
    };
}

interface VerificationQueueProps {
    queue: VerificationQueueItem[];
}

export function VerificationQueue({ queue }: VerificationQueueProps) {
    const [activeTab, setActiveTab] = useState("all");
    const [search, setSearch] = useState("");

    // Filter logic
    const filteredQueue = queue.filter(item => {
        // Tab filter
        if (activeTab === "urgent") {
            const diff = new Date().getTime() - new Date(item.createdAt).getTime();
            const hours = diff / (1000 * 60 * 60);
            return hours > 48;
        }

        // Search filter
        if (search) {
            const lowerSearch = search.toLowerCase();
            return (
                item.user.firstName.toLowerCase().includes(lowerSearch) ||
                item.user.lastName.toLowerCase().includes(lowerSearch) ||
                item.user.email.toLowerCase().includes(lowerSearch) ||
                item.title.toLowerCase().includes(lowerSearch) ||
                item.issuer.toLowerCase().includes(lowerSearch)
            );
        }
        return true;
    });

    const pendingCount = queue.length;
    const urgentCount = queue.filter(item => {
        const diff = new Date().getTime() - new Date(item.createdAt).getTime();
        return diff / (1000 * 60 * 60) > 48;
    }).length;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Verification Queue</h1>
                    <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                        <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200">{pendingCount} pending</Badge>
                        <span className="text-slate-300">•</span>
                        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">{urgentCount} urgent (&gt;48hrs)</Badge>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => window.location.reload()}>
                        <RefreshCw className="w-4 h-4" /> Refresh
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Download className="w-4 h-4" /> Export
                    </Button>
                </div>
            </div>

            {/* Tabs & Filters */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setActiveTab}>
                        <TabsList>
                            <TabsTrigger value="all">All Pending</TabsTrigger>
                            <TabsTrigger value="urgent" className="text-red-600 data-[state=active]:text-red-700 data-[state=active]:bg-red-50">Urgent</TabsTrigger>
                            <TabsTrigger value="others">Others</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search user or item..."
                                className="pl-9 h-9"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="icon" className="h-9 w-9">
                            <Filter className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Queue Table */}
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">
                                        <input type="checkbox" className="rounded border-slate-300" />
                                    </TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Submitted</TableHead>
                                    <TableHead>Waiting</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredQueue.length > 0 ? filteredQueue.map((item) => {
                                    const submittedDate = new Date(item.createdAt);
                                    const waitingTime = Math.floor((new Date().getTime() - submittedDate.getTime()) / (1000 * 60 * 60));
                                    const waitingLabel = waitingTime > 24 ? `${Math.floor(waitingTime / 24)} days` : `${waitingTime} hours`;
                                    const isUrgent = waitingTime > 48;

                                    return (
                                        <TableRow key={item.id} className="group cursor-pointer hover:bg-slate-50">
                                            <TableCell>
                                                <input type="checkbox" className="rounded border-slate-300" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        {item.user.profilePhoto ? (
                                                            <img src={item.user.profilePhoto} alt={item.user.firstName} className="object-cover h-full w-full" />
                                                        ) : (
                                                            <AvatarFallback className="bg-slate-100 text-slate-600 text-xs">
                                                                {item.user.firstName[0]}{item.user.lastName[0]}
                                                            </AvatarFallback>
                                                        )}
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium text-slate-900">{item.user.firstName} {item.user.lastName}</div>
                                                        <div className="text-xs text-slate-500">{item.user.email}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium text-slate-900">{item.title}</div>
                                                <div className="text-xs text-slate-500">{item.issuer}</div>
                                                <Badge variant="outline" className="mt-1 text-[10px] px-1 py-0 h-4">{item.type}</Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-slate-500">
                                                {submittedDate.toLocaleDateString()}
                                                <div className="text-xs">{submittedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className={cn(
                                                    "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                                                    isUrgent ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
                                                )}>
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {waitingLabel}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                                                    {item.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Link href={`/admin/verifications/${item.id}`}>
                                                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                                        Review
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                                            No pending verifications found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            </div>
        </div>
    );
}
