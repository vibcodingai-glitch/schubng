"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function AdminLayoutClient({
    children,
    user,
}: {
    children: React.ReactNode;
    user: any;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block fixed inset-y-0 left-0 z-40">
                <AdminSidebar user={user} />
            </div>

            {/* Mobile Sidebar */}
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetContent side="left" className="p-0 w-64 border-r-slate-800 bg-slate-900 text-slate-300">
                    <AdminSidebar user={user} />
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <div className="flex-1 lg:pl-64 flex flex-col min-h-screen transition-all duration-300">
                <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} user={user} />
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <div className="mx-auto max-w-7xl animate-fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
