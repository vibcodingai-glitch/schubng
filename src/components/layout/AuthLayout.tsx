import Link from "next/link";
import { ArrowLeft, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthLayoutProps {
    children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
            {/* Back to Home Link */}
            <div className="container py-6">
                <Link href="/">
                    <Button variant="ghost" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Button>
                </Link>
            </div>

            {/* Centered Content */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>

            {/* Footer */}
            <div className="container py-6 text-center text-sm text-slate-500">
                <Link href="/" className="inline-flex items-center gap-2 hover:text-slate-900 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                        <LinkIcon className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <span className="font-semibold">SupplyChain Hub</span>
                </Link>
                <span className="mx-2">•</span>
                <span>© 2024 All rights reserved</span>
            </div>
        </div>
    );
}
