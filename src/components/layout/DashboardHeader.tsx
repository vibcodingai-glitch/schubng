"use client";

import { useState, useEffect } from "react";
import { searchUsers } from "@/lib/actions/user.actions";
import { Bell, Menu, Search, Settings, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardSidebar } from "./DashboardSidebar";
import Link from "next/link";
import { signOutUser } from "@/lib/actions/auth.actions";

export function DashboardHeader() {
    const [query, setQuery] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [results, setResults] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length > 1) {
                setIsLoading(true);
                const data = await searchUsers(query);
                setResults(data);
                setIsOpen(true);
                setIsLoading(false);
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center gap-4 border-b bg-background px-6 shadow-sm">
            {/* Mobile Menu Trigger */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden shrink-0">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72 border-r-0 bg-slate-900 text-slate-100">
                    <DashboardSidebar />
                </SheetContent>
            </Sheet>

            {/* Search Bar */}
            <div className="flex-1 flex justify-center lg:justify-start">
                <div className="w-full max-w-md relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                        type="search"
                        placeholder="Search for people, jobs, companies..."
                        className="w-full bg-background pl-9 md:w-[300px] lg:w-[400px]"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => { if (results.length > 0) setIsOpen(true); }}
                        onBlur={() => { setTimeout(() => setIsOpen(false), 200); }}
                    />

                    {isOpen && (results.length > 0 || isLoading) && query.length > 1 && (
                        <div className="absolute top-full left-0 w-full mt-1 bg-white border rounded-md shadow-lg z-50 py-1 max-h-96 overflow-y-auto">
                            {isLoading && (
                                <div className="px-4 py-3 text-sm text-gray-500 text-center">Searching...</div>
                            )}
                            {!isLoading && results.length === 0 && (
                                <div className="px-4 py-3 text-sm text-gray-500 text-center">No results found.</div>
                            )}
                            {!isLoading && results.map(user => (
                                <Link
                                    href={`/p/${user.id}`}
                                    key={user.id}
                                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Avatar className="h-8 w-8 border border-gray-100">
                                        <AvatarImage src={user.profilePhotoUrl} />
                                        <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">{user.firstName?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{user.firstName} {user.lastName}</p>
                                        <p className="text-xs text-gray-500 line-clamp-1 truncate">{user.headline || user.currentRole || user.currentCompany || "Member"}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600 border-2 border-background"></span>
                            <span className="sr-only">Notifications</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <div className="max-h-96 overflow-y-auto">
                            <Link href="#" className="block px-4 py-3 hover:bg-slate-50 transition-colors border-b last:border-0">
                                <p className="text-sm font-medium text-slate-900">New connection request</p>
                                <p className="text-xs text-slate-500 mt-1">John Doe wants to connect.</p>
                            </Link>
                            <div className="px-4 py-3 text-sm text-center text-slate-500">
                                No new notifications
                            </div>
                        </div>
                        <DropdownMenuSeparator />
                        <Link href="/dashboard/notifications" className="block px-4 py-2 text-sm text-center text-blue-600 hover:text-blue-700 font-medium">
                            View all notifications
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src="" alt="User" />
                                <AvatarFallback>AI</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/profile" className="cursor-pointer flex w-full items-center">
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/settings" className="cursor-pointer flex w-full items-center">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-600 cursor-pointer focus:text-red-600"
                            onClick={() => signOutUser()}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
