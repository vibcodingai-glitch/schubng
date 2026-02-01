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

// Mock Data
const verificationStats = [
    { name: 'Verified', value: 412, color: '#10b981' },
    { name: 'Pending', value: 18, color: '#f59e0b' },
    { name: 'Failed', value: 23, color: '#ef4444' },
];

const pendingVerifications = [
    { id: 1, user: "Emeka O.", cert: "CSCP", waiting: "3 days", status: "urgent" },
    { id: 2, user: "Ada N.", cert: "PMP", waiting: "2 days", status: "warning" },
    { id: 3, user: "Tunde B.", cert: "Six Sigma", waiting: "5 hours", status: "normal" },
    { id: 4, user: "Chioma A.", cert: "CIPS", waiting: "1 hour", status: "normal" },
];

const recentActivity = [
    { id: 1, text: "John verified CSCP for Adebayo", time: "2h ago", type: "verification" },
    { id: 2, text: "New user: Chioma registered", time: "4h ago", type: "user" },
    { id: 3, text: "Payment received: ₦50,000", time: "5h ago", type: "payment" },
    { id: 4, text: "System backup completed", time: "1d ago", type: "system" },
];

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
                <p className="text-slate-600 mt-2">Welcome back, John. Here's what's happening today.</p>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">523</div>
                        <p className="text-xs text-emerald-600 flex items-center mt-1">
                            <TrendingUp className="w-3 h-3 mr-1" /> +24 this week
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Pending Verifications</CardTitle>
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">18</div>
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
                        <div className="text-2xl font-bold text-slate-900">47</div>
                        <p className="text-xs text-emerald-600 flex items-center mt-1">
                            <TrendingUp className="w-3 h-3 mr-1" /> +12% vs last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Revenue This Month</CardTitle>
                        <CreditCard className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">₦2.45M</div>
                        <p className="text-xs text-slate-500 mt-1">32 transactions</p>
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
                            <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200">
                                3 Urgent
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {pendingVerifications.map((item) => (
                                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-full border border-slate-200 flex items-center justify-center font-bold text-slate-600 flex-shrink-0">
                                                {item.user.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">{item.user}</p>
                                                <p className="text-sm text-slate-500">{item.cert}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                                            <div className="text-right">
                                                <p className={cn(
                                                    "text-sm font-medium",
                                                    item.status === "urgent" ? "text-red-600" :
                                                        item.status === "warning" ? "text-amber-600" : "text-slate-600"
                                                )}>
                                                    {item.waiting}
                                                </p>
                                                <p className="text-xs text-slate-400">waiting</p>
                                            </div>
                                            <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                                                Review
                                            </Button>
                                        </div>
                                    </div>
                                ))}
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
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                i % 2 === 0 ? "bg-red-500" : "bg-emerald-500"
                                            )} />
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">User {i}</p>
                                                <p className="text-xs text-slate-500">CSCP Certification</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="outline" className={cn(
                                                "text-xs",
                                                i % 2 === 0 ? "text-red-600 bg-red-50 border-red-100" : "text-emerald-600 bg-emerald-50 border-emerald-100"
                                            )}>
                                                {i % 2 === 0 ? "Failed" : "Verified"}
                                            </Badge>
                                            <p className="text-xs text-slate-400 mt-1">by John Admin • 2h ago</p>
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
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                <CheckCircle className="w-4 h-4 mr-2" /> Process Next Verification
                            </Button>
                            <Button variant="outline" className="w-full">
                                <Download className="w-4 h-4 mr-2" /> Export Users CSV
                            </Button>
                            <Button variant="ghost" className="w-full justify-start text-slate-600">
                                <FileText className="w-4 h-4 mr-2" /> View Reports
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Activity Log */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Activity Log</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6 relative pl-4 border-l border-slate-200 ml-2">
                                {recentActivity.map((activity) => (
                                    <div key={activity.id} className="relative">
                                        <div className={cn(
                                            "absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white",
                                            activity.type === 'verification' ? "bg-blue-500" :
                                                activity.type === 'payment' ? "bg-emerald-500" :
                                                    activity.type === 'user' ? "bg-purple-500" : "bg-slate-400"
                                        )} />
                                        <p className="text-sm text-slate-900">{activity.text}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{activity.time}</p>
                                    </div>
                                ))}
                            </div>
                            <Button variant="link" className="w-full mt-4 text-slate-500 hover:text-slate-900">
                                View Full Log
                            </Button>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}

function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}
