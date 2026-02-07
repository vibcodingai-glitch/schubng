import { getCurrentUser } from "@/lib/actions/user.actions";
import { LinkedInHeader } from "./LinkedInHeader";
import { MobileBottomNav } from "./MobileBottomNav";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export async function DashboardLayout({ children }: DashboardLayoutProps) {
    const user = await getCurrentUser();

    return (
        <div className="min-h-screen bg-[#f4f2ee]">
            {/* LinkedIn-style Top Header */}
            <LinkedInHeader user={user || undefined} />

            {/* Main Content - No sidebar, full width with max-width container */}
            <main className="pb-20 md:pb-8">
                <div className="max-w-[1128px] mx-auto px-4 py-6">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <MobileBottomNav user={user || undefined} />
        </div>
    );
}
