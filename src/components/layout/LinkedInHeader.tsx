"use client";

import { useState, useEffect } from "react";
import { searchUsers } from "@/lib/actions/user.actions";
import {
    Home,
    Users,
    Award,
    Bell,
    Search,
    ChevronDown,
    Settings,
    User,
    LogOut,
    Briefcase,
    LayoutDashboard,
    Menu,
    CheckCircle2,
    CreditCard,
    Link as LinkIcon,
} from "lucide-react";
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
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOutUser } from "@/lib/actions/auth.actions";
import { cn } from "@/lib/utils";

interface NavItem {
    href: string;
    label: string;
    icon: any;
    badge?: boolean;
}

const navItems: NavItem[] = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/dashboard/network", label: "My Network", icon: Users },
    { href: "/dashboard/certifications", label: "Certifications", icon: Award },
    { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
];

const mobileNavItems = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/dashboard/network", label: "My Network", icon: Users },
    { href: "/dashboard/overview", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/certifications", label: "Certifications", icon: Award },
    { href: "/dashboard/verifications", label: "Verification Status", icon: CheckCircle2 },
    { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export interface LinkedInHeaderProps {
    user?: {
        firstName?: string;
        lastName?: string;
        headline?: string | null;
        profilePhotoUrl?: string | null;
        currentRole?: string | null;
        role?: string;
    };
}

export function LinkedInHeader({ user }: LinkedInHeaderProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [query, setQuery] = useState("");
    // ... rest of component

    const [results, setResults] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    const isActive = (href: string) => {
        if (href === "/dashboard") return pathname === "/dashboard";
        return pathname.startsWith(href);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-md shadow-sm border-slate-200/60 transition-all duration-300">
            <div className="max-w-[1128px] mx-auto px-4">
                <div className="flex h-[52px] items-center justify-between gap-2">
                    {/* Left Section: Logo + Search */}
                    <div className="flex items-center gap-2">
                        {/* Logo */}
                        <Link href="/dashboard" className="shrink-0 hover:scale-105 transition-transform">
                            <div className="w-[36px] h-[36px] bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                <LinkIcon className="w-5 h-5" strokeWidth={2.5} />
                            </div>
                        </Link>

                        {/* Search */}
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input
                                type="search"
                                placeholder="Search"
                                className="w-[280px] pl-9 h-[34px] bg-[#eef3f8] border-none focus-visible:ring-1 focus-visible:ring-gray-400 rounded text-sm"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onFocus={() => { if (results.length > 0) setIsOpen(true); }}
                                onBlur={() => { setTimeout(() => setIsOpen(false), 200); }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && query.trim().length > 1) {
                                        setIsOpen(false);
                                        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                                    }
                                }}
                            />

                            {/* Search Results Dropdown */}
                            {isOpen && (results.length > 0 || isLoading) && query.length > 1 && (
                                <div className="absolute top-full left-0 w-[360px] mt-1 bg-white border rounded-lg shadow-lg z-50 py-2 max-h-[400px] overflow-y-auto">
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
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Avatar className="h-10 w-10 border border-gray-200">
                                                <AvatarImage src={user.profilePhotoUrl} />
                                                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-sm">
                                                    {user.firstName?.[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">
                                                    {user.firstName} {user.lastName}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {user.headline || user.currentRole || "Member"}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                    {/* See all results link */}
                                    {!isLoading && results.length > 0 && (
                                        <Link
                                            href={`/search?q=${encodeURIComponent(query)}`}
                                            className="block px-4 py-3 text-sm text-blue-600 font-medium text-center border-t border-gray-100 hover:bg-gray-50 transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            See all results for "{query}"
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Center/Right: Navigation Icons */}
                    <nav className="hidden md:flex items-center">
                        {/* Admin Tab */}
                        {user?.role === "ADMIN" && (
                            <Link
                                href="/admin"
                                className={cn(
                                    "flex flex-col items-center justify-center min-w-[80px] h-[52px] px-3 border-b-2 transition-colors",
                                    pathname.startsWith("/admin")
                                        ? "border-gray-900 text-gray-900"
                                        : "border-transparent text-gray-500 hover:text-gray-900"
                                )}
                            >
                                <div className="relative">
                                    <div className="w-6 h-6 flex items-center justify-center rounded-sm bg-slate-800 text-white font-bold text-[10px]">
                                        A
                                    </div>
                                </div>
                                <span className="text-xs mt-0.5">Admin</span>
                            </Link>
                        )}

                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex flex-col items-center justify-center min-w-[80px] h-[52px] px-3 border-b-2 transition-colors",
                                        active
                                            ? "border-gray-900 text-gray-900"
                                            : "border-transparent text-gray-500 hover:text-gray-900"
                                    )}
                                >
                                    <div className="relative">
                                        <Icon className="w-6 h-6" />
                                        {item.badge && (
                                            <span className="absolute -top-1 -right-1 h-[18px] min-w-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                                                3
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs mt-0.5">{item.label}</span>
                                </Link>
                            );
                        })}

                        {/* Divider */}
                        <div className="w-px h-[40px] bg-gray-200 mx-1" />

                        {/* Me Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className={cn(
                                    "flex flex-col items-center justify-center min-w-[80px] h-[52px] px-3 border-b-2 transition-colors cursor-pointer",
                                    isActive("/dashboard/profile") || isActive("/dashboard/overview")
                                        ? "border-gray-900 text-gray-900"
                                        : "border-transparent text-gray-500 hover:text-gray-900"
                                )}>
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src="" alt="Me" />
                                        <AvatarFallback className="text-[10px] bg-gray-200">ME</AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs mt-0.5 flex items-center gap-0.5">
                                        Me <ChevronDown className="w-3 h-3" />
                                    </span>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[280px]">
                                {/* Profile Mini Card */}
                                <div className="p-4 border-b">
                                    <Link href="/dashboard/profile" className="flex items-start gap-3 group">
                                        <Avatar className="h-14 w-14 border">
                                            <AvatarImage src={user?.profilePhotoUrl || ""} />
                                            <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                                                {user?.firstName?.[0] || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {user?.firstName ? `${user.firstName} ${user.lastName}` : "User"}
                                            </p>
                                            <p className="text-xs text-gray-500 line-clamp-2">
                                                {user?.headline || user?.currentRole || "Professional"}
                                            </p>
                                        </div>
                                    </Link>
                                    <Link href="/dashboard/profile">
                                        <Button variant="outline" size="sm" className="w-full mt-3 rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold">
                                            View Profile
                                        </Button>
                                    </Link>
                                </div>

                                {/* Account Section */}
                                <div className="py-2">
                                    <DropdownMenuLabel className="text-xs text-gray-500 font-normal px-4">Account</DropdownMenuLabel>
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/overview" className="cursor-pointer px-4 py-2">
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/settings" className="cursor-pointer px-4 py-2">
                                            <Settings className="mr-2 h-4 w-4" />
                                            Settings & Privacy
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/billing" className="cursor-pointer px-4 py-2">
                                            <CreditCard className="mr-2 h-4 w-4" />
                                            Billing
                                        </Link>
                                    </DropdownMenuItem>
                                </div>

                                <DropdownMenuSeparator />

                                {/* Manage Section */}
                                <div className="py-2">
                                    <DropdownMenuLabel className="text-xs text-gray-500 font-normal px-4">Manage</DropdownMenuLabel>
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/verifications" className="cursor-pointer px-4 py-2">
                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                            Verification Status
                                        </Link>
                                    </DropdownMenuItem>
                                </div>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    className="text-gray-700 cursor-pointer px-4 py-2"
                                    onClick={() => signOutUser()}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </nav>

                    {/* Mobile Menu Button */}
                    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] p-0">
                            <SheetHeader className="p-4 border-b">
                                <SheetTitle>Menu</SheetTitle>
                            </SheetHeader>
                            <div className="p-4 border-b">
                                <Link
                                    href="/dashboard/profile"
                                    className="flex items-center gap-3"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Avatar className="h-12 w-12 border">
                                        <AvatarImage src={user?.profilePhotoUrl || ""} />
                                        <AvatarFallback className="bg-blue-100 text-blue-600">
                                            {user?.firstName?.[0] || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {user?.firstName ? `${user.firstName} ${user.lastName}` : "User"}
                                        </p>
                                        <p className="text-xs text-gray-500">View Profile</p>
                                    </div>
                                </Link>
                            </div>
                            <nav className="py-2">
                                {mobileNavItems.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.href);
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-3 text-sm transition-colors",
                                                active
                                                    ? "bg-blue-50 text-blue-600 font-semibold"
                                                    : "text-gray-700 hover:bg-gray-100"
                                            )}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
                                <Button
                                    variant="outline"
                                    className="w-full text-gray-700"
                                    onClick={() => signOutUser()}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign Out
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
