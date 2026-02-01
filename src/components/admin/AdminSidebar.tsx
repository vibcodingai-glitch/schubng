"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    CheckCircle,
    Users,
    CreditCard,
    Settings,
    LogOut,
    Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Verifications",
        href: "/admin/verifications",
        icon: CheckCircle,
        badge: 18, // Mock pending count
    },
    {
        title: "Users",
        href: "/admin/users",
        icon: Users,
    },
    {
        title: "Transactions",
        href: "/admin/transactions",
        icon: CreditCard,
    },
    {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
    },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full bg-slate-900 text-slate-300 w-64 border-r border-slate-800">
            {/* Logo */}
            <div className="p-6 border-b border-slate-800">
                <Link href="/admin" className="flex items-center gap-2 font-bold text-xl text-white">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span>SupplyChain Hub <span className="text-blue-500">Admin</span></span>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group",
                                isActive
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                                <span className="font-medium">{item.title}</span>
                            </div>
                            {item.badge && (
                                <span className={cn(
                                    "text-xs font-bold px-2 py-0.5 rounded-full",
                                    isActive ? "bg-white/20 text-white" : "bg-blue-600 text-white"
                                )}>
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* User Info */}
            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <Avatar className="w-9 h-9 border border-slate-700">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback className="bg-slate-800 text-slate-300">JA</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">John Admin</p>
                        <p className="text-xs text-slate-500 truncate">john@supplychainhub.com</p>
                    </div>
                </div>
                <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800 gap-2">
                    <LogOut className="w-4 h-4" />
                    Log Out
                </Button>
            </div>
        </div>
    );
}
