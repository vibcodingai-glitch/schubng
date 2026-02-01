"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Home,
    User,
    Award,
    Briefcase,
    Settings,
    LogOut,
    Link as LinkIcon,
    CheckCircle2,
    CreditCard,
    Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sidebarLinks = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/dashboard/network", label: "My Network", icon: Users },
    { href: "/dashboard/overview", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/certifications", label: "Certifications", icon: Award },
    { href: "/dashboard/verifications", label: "Verification Status", icon: CheckCircle2 },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
    { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
];

// Mock User Data
const user = {
    name: "Abdulrahman Isah",
    email: "abdul@chaincred.ng",
    initials: "AI",
    avatarUrl: "", // Add URL if available
};

interface DashboardSidebarProps {
    className?: string;
    onLinkClick?: () => void;
}

export function DashboardSidebar({ className, onLinkClick }: DashboardSidebarProps) {
    const pathname = usePathname();

    // Assuming 'collapsed' is a prop or state that would be passed down or managed here.
    // For this specific instruction, we'll assume 'collapsed' is false to always show the text,
    // or if it's meant to be a new prop, it would need to be added to DashboardSidebarProps.
    // Since the instruction only provides the snippet, and not the full context of 'collapsed',
    // I will integrate it as provided, which implies 'collapsed' would be defined elsewhere.
    // To make it syntactically correct without further context, I will assume `collapsed` is a boolean variable.
    // If `collapsed` is not defined, this will cause a runtime error.
    // For the purpose of this exercise, I will assume `collapsed` is a boolean variable that would be defined.
    const collapsed = false; // Placeholder for `collapsed` to ensure syntactical correctness.

    return (
        <div className={cn("flex h-full flex-col border-r bg-slate-900 text-slate-100", className)}>
            {/* Logo */}
            <div className="flex h-16 items-center border-b border-slate-800 px-6">
                <Link href="/dashboard" className="flex items-center gap-2" onClick={onLinkClick}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                        <LinkIcon className="w-5 h-5" strokeWidth={2} />
                    </div>
                    {!collapsed && (
                        <span className="text-xl font-bold">SupplyChain Hub</span>
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6">
                <nav className="grid gap-1 px-4">
                    {sidebarLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={onLinkClick}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-blue-600 text-white"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* User Info & Logout */}
            <div className="border-t border-slate-800 p-4">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <Avatar className="h-9 w-9 border border-slate-700">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback className="bg-slate-800 text-slate-200">
                            {user.initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col overflow-hidden">
                        <span className="truncate text-sm font-medium text-white">
                            {user.name}
                        </span>
                        <span className="truncate text-xs text-slate-400">
                            {user.email}
                        </span>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-slate-400 hover:bg-slate-800 hover:text-red-400"
                >
                    <LogOut className="h-5 w-5" />
                    Log Out
                </Button>
            </div>
        </div>
    );
}
