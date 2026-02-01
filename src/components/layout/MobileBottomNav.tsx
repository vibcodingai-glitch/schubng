"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, User, Award, CheckCircle2, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/network", label: "Network", icon: Users },
    { href: "/dashboard/certifications", label: "Certs", icon: Award },
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function MobileBottomNav() {
    const pathname = usePathname();

    return (
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 glass-card rounded-2xl shadow-2xl bg-white/90 backdrop-blur-lg border border-slate-200/50">
            <nav className="flex justify-around items-center h-16 px-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors",
                                isActive
                                    ? "text-blue-600"
                                    : "text-slate-500 hover:text-slate-900"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
