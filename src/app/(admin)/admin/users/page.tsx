"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Search,
    Download,
    Plus,
    MoreHorizontal,
    Mail,
    Copy,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Mock Data
const mockUsers = Array.from({ length: 20 }).map((_, i) => ({
    id: `u${i + 1}`,
    name: i === 0 ? "Emeka Okafor" : i === 1 ? "Ada Nwachukwu" : `User ${i + 1}`,
    email: i === 0 ? "emeka@company.com" : `user${i + 1}@example.com`,
    plan: i % 3 === 0 ? "pro" : "free",
    trustScore: 60 + Math.floor(Math.random() * 30),
    certs: { total: Math.floor(Math.random() * 5), verified: Math.floor(Math.random() * 3) },
    joined: "2 days ago",
    status: i === 4 ? "suspended" : "active",
}));

export default function UsersPage() {
    const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const handleUserClick = (user: typeof mockUsers[0]) => {
        setSelectedUser(user);
        setIsSheetOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">User Management</h1>
                    <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                        <span>523 total</span>
                        <span className="text-slate-300">•</span>
                        <span>312 verified</span>
                        <span className="text-slate-300">•</span>
                        <span>45 pro</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Download className="w-4 h-4" /> Export
                    </Button>
                    <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4" /> Add User
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search by name, email, or phone..."
                        className="pl-9"
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                    <Button variant="outline" size="sm" className="whitespace-nowrap">
                        Account Type
                    </Button>
                    <Button variant="outline" size="sm" className="whitespace-nowrap">
                        Verification Status
                    </Button>
                    <Button variant="outline" size="sm" className="whitespace-nowrap">
                        Registration
                    </Button>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 whitespace-nowrap">
                        Clear Filters
                    </Button>
                </div>
            </div>

            {/* Users Table */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">
                                    <input type="checkbox" className="rounded border-slate-300" />
                                </TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Trust Score</TableHead>
                                <TableHead>Certs</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockUsers.map((user) => (
                                <TableRow key={user.id} className="group hover:bg-slate-50">
                                    <TableCell>
                                        <input type="checkbox" className="rounded border-slate-300" />
                                    </TableCell>
                                    <TableCell>
                                        <button
                                            className="flex items-center gap-3 text-left hover:opacity-80 whitespace-nowrap"
                                            onClick={() => handleUserClick(user)}
                                        >
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="bg-slate-100 text-slate-600 text-xs">
                                                    {user.name.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium text-slate-900">{user.name}</span>
                                        </button>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-slate-500 whitespace-nowrap">
                                            {user.email}
                                            <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Mail className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={cn(
                                            "font-normal whitespace-nowrap",
                                            user.plan === "pro" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-600"
                                        )}>
                                            {user.plan === "pro" ? "Verified Pro" : "Free"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className={cn(
                                            "font-bold",
                                            user.trustScore >= 80 ? "text-emerald-600" :
                                                user.trustScore >= 60 ? "text-blue-600" : "text-amber-600"
                                        )}>
                                            {user.trustScore}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-slate-600 whitespace-nowrap">
                                        {user.certs.total} <span className="text-slate-400">({user.certs.verified} verified)</span>
                                    </TableCell>
                                    <TableCell className="text-slate-500 text-sm whitespace-nowrap">{user.joined}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={cn(
                                            "font-normal",
                                            user.status === "active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                                        )}>
                                            {user.status === "active" ? "Active" : "Suspended"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleUserClick(user)}>View Profile</DropdownMenuItem>
                                                <DropdownMenuItem>View Certifications</DropdownMenuItem>
                                                <DropdownMenuItem>Edit User</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>Impersonate</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600">Suspend User</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                    <span>Showing 1-20 of 523 users</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled>Previous</Button>
                        <Button variant="outline" size="sm">Next</Button>
                    </div>
                </div>
            </Card>

            {/* User Detail Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                    {selectedUser && (
                        <>
                            <SheetHeader className="pb-6">
                                <div className="flex items-start gap-4">
                                    <Avatar className="h-16 w-16 border-2 border-slate-100">
                                        <AvatarFallback className="text-xl bg-slate-100 text-slate-600">
                                            {selectedUser.name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <SheetTitle className="text-xl">{selectedUser.name}</SheetTitle>
                                        <SheetDescription>
                                            {selectedUser.id} • Joined {selectedUser.joined}
                                        </SheetDescription>
                                        <div className="flex gap-2 pt-1">
                                            <Badge variant="outline" className={cn(
                                                selectedUser.plan === "pro" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-600"
                                            )}>
                                                {selectedUser.plan === "pro" ? "Verified Pro" : "Free Plan"}
                                            </Badge>
                                            <Badge variant="outline" className={cn(
                                                selectedUser.status === "active" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
                                            )}>
                                                {selectedUser.status === "active" ? "Active" : "Suspended"}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </SheetHeader>

                            <Tabs defaultValue="overview" className="space-y-6">
                                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                                    <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-2">Overview</TabsTrigger>
                                    <TabsTrigger value="certifications" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-2">Certifications</TabsTrigger>
                                    <TabsTrigger value="transactions" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-2">Transactions</TabsTrigger>
                                    <TabsTrigger value="activity" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-2">Activity</TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-sm text-slate-500">Email</p>
                                            <p className="font-medium flex items-center gap-2">
                                                {selectedUser.email} <Copy className="w-3 h-3 text-slate-400" />
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-slate-500">Phone</p>
                                            <p className="font-medium flex items-center gap-2">
                                                +234 800 000 0000 <Copy className="w-3 h-3 text-slate-400" />
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-slate-500">Location</p>
                                            <p className="font-medium">Lagos, Nigeria</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-slate-500">Last Login</p>
                                            <p className="font-medium">2 hours ago</p>
                                        </div>
                                    </div>

                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-base">Trust Score Breakdown</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-2xl font-bold text-blue-600">{selectedUser.trustScore}</span>
                                                <span className="text-sm text-slate-500">Good Standing</span>
                                            </div>
                                            <div className="space-y-3">
                                                <div>
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span>Verified Certs</span>
                                                        <span>{selectedUser.certs.verified * 10}/40</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-slate-100 rounded-full">
                                                        <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: `${(selectedUser.certs.verified * 10 / 40) * 100}%` }}></div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span>Profile Completeness</span>
                                                        <span>15/20</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-slate-100 rounded-full">
                                                        <div className="h-1.5 bg-emerald-500 rounded-full" style={{ width: '75%' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="certifications" className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">CSCP</div>
                                            <div>
                                                <p className="font-medium text-sm">Certified Supply Chain Professional</p>
                                                <p className="text-xs text-slate-500">APICS/ASCM</p>
                                            </div>
                                        </div>
                                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Verified</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">PMP</div>
                                            <div>
                                                <p className="font-medium text-sm">Project Management Professional</p>
                                                <p className="text-xs text-slate-500">PMI</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="bg-slate-100 text-slate-600">Claimed</Badge>
                                    </div>
                                </TabsContent>

                                <TabsContent value="transactions">
                                    <div className="text-center py-8 text-slate-500 text-sm">No recent transactions</div>
                                </TabsContent>
                                <TabsContent value="activity">
                                    <div className="text-center py-8 text-slate-500 text-sm">No recent activity</div>
                                </TabsContent>
                            </Tabs>

                            <SheetFooter className="mt-8 pt-4 border-t border-slate-100 flex-col gap-3 sm:flex-col">
                                <Button className="w-full" variant="outline">
                                    <Mail className="w-4 h-4 mr-2" /> Send Notification
                                </Button>
                                <div className="grid grid-cols-2 gap-3 w-full">
                                    <Button variant="outline" className="w-full">Reset Password</Button>
                                    <Button variant="destructive" className="w-full bg-red-50 text-red-600 hover:bg-red-100 border-red-200">
                                        Suspend Account
                                    </Button>
                                </div>
                            </SheetFooter>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
