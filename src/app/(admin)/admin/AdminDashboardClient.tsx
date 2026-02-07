"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    CheckCircle,
    CreditCard,
    TrendingUp,
    AlertCircle,
    ArrowRight,
    FileText,
    Download
} from "lucide-react";
import Link from "next/link";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

// Re-using the types inferred from the server action return
// ... existing types
interface AdminDashboardData {
    totalUsers: number;
    userGrowth: number;
    pendingVerificationsCount: number;
    verifiedThisMonth: number;
    verifiedGrowth: number;
    revenue: number;
    transactionsCount: number;
    pendingVerifications: Array<{
        id: string;
        user: string;
        userAvatar?: string | null;
        type: string;
        title: string;
        submittedAt: Date;
        status: string;
    }>;
    recentVerifications: Array<{
        id: string;
        user: string;
        title: string;
        status: string;
        admin: string;
        updatedAt: Date;
    }>;
}

interface AdminDashboardClientProps {
    data: AdminDashboardData;
}

export default function AdminDashboardClient({ data }: AdminDashboardClientProps) {

    const verificationStats = [
        { name: 'Verified', value: data.verifiedThisMonth, color: '#10b981' },
        { name: 'Pending', value: data.pendingVerificationsCount, color: '#f59e0b' },
    ];

    const nextVerificationId = data.pendingVerifications.length > 0 ? data.pendingVerifications[0].id : null;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
                <p className="text-slate-600 mt-2">Welcome back. Here's what's happening today.</p>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{data.totalUsers}</div>
                        <p className="text-xs text-emerald-600 flex items-center mt-1">
                            <TrendingUp className="w-3 h-3 mr-1" /> +{data.userGrowth} this week
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Pending Verifications</CardTitle>
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{data.pendingVerificationsCount}</div>
                        <div className="flex justify-between items-center mt-1">
                            <p className="text-xs text-amber-600 font-medium">Needs attention</p>
                            <Link href="/admin/verifications" className="text-xs text-blue-600 hover:underline">View Queue</Link>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Verified This Month</CardTitle>
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{data.verifiedThisMonth}</div>
                        <p className={`text-xs flex items-center mt-1 ${data.verifiedGrowth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            <TrendingUp className="w-3 h-3 mr-1" /> {data.verifiedGrowth >= 0 ? '+' : ''}{data.verifiedGrowth} vs last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Revenue This Month</CardTitle>
                        <CreditCard className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">₦{data.revenue.toLocaleString()}</div>
                        <p className="text-xs text-slate-500 mt-1">{data.transactionsCount} transactions</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Left Column (2/3 width) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Pending Verifications (Urgent) */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Requires Action</CardTitle>
                                <CardDescription>Verifications waiting for review</CardDescription>
                            </div>
                            {data.pendingVerificationsCount > 0 && (
                                <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200">
                                    {data.pendingVerificationsCount} Pending
                                </Badge>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data.pendingVerifications.length === 0 ? (
                                    <p className="text-slate-500 text-center py-8">No pending verifications.</p>
                                ) : (
                                    data.pendingVerifications.map((item) => (
                                        <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white rounded-full border border-slate-200 flex items-center justify-center font-bold text-slate-600 flex-shrink-0 overflow-hidden">
                                                    {item.userAvatar ? (
                                                        <img src={item.userAvatar} alt={item.user} className="w-full h-full object-cover" />
                                                    ) : (
                                                        item.user.charAt(0)
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900">{item.user}</p>
                                                    <p className="text-sm text-slate-500">{item.title}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-slate-600">
                                                        {formatDistanceToNow(new Date(item.submittedAt), { addSuffix: true })}
                                                    </p>
                                                    <p className="text-xs text-slate-400">waiting</p>
                                                </div>
                                                <Link href={`/admin/verifications/${item.id}`}>
                                                    <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                                                        Review
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="mt-4 text-center">
                                <Link href="/admin/verifications" className="text-sm text-blue-600 hover:underline flex items-center justify-center gap-1">
                                    View all pending verifications <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Verifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recently Processed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                {data.recentVerifications.map((item, i) => (
                                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-slate-100 last:border-0 gap-2">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full flex-shrink-0",
                                                item.status === 'SUCCESSFUL' || item.status === 'COMPLETED' ? "bg-emerald-500" : "bg-red-500"
                                            )} />
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{item.user}</p>
                                                <p className="text-xs text-slate-500">{item.title}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:block sm:text-right pl-5 sm:pl-0">
                                            <Badge variant="outline" className={cn(
                                                "text-xs",
                                                item.status === 'SUCCESSFUL' || item.status === 'COMPLETED'
                                                    ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                                                    : "text-red-600 bg-red-50 border-red-100"
                                            )}>
                                                {item.status}
                                            </Badge>
                                            <p className="text-xs text-slate-400 mt-1 sm:mt-1 ml-auto sm:ml-0">by {item.admin} • {formatDistanceToNow(new Date(item.updatedAt))} ago</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column (1/3 width) */}
                <div className="space-y-8">

                    {/* Verification Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Verification Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[200px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={verificationStats}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {verificationStats.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {nextVerificationId ? (
                                <Link href={`/admin/verifications/${nextVerificationId}`}>
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                        <CheckCircle className="w-4 h-4 mr-2" /> Process Next Verification
                                    </Button>
                                </Link>
                            ) : (
                                <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled>
                                    <CheckCircle className="w-4 h-4 mr-2" /> No Pending Items
                                </Button>
                            )}

                            <Button variant="outline" className="w-full">
                                <Download className="w-4 h-4 mr-2" /> Export Users CSV
                            </Button>
                            <Button variant="ghost" className="w-full justify-start text-slate-600">
                                <FileText className="w-4 h-4 mr-2" /> View Reports
                            </Button>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}
