"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/pricing", label: "Pricing" },
    { href: "/faq", label: "FAQ" },
];

export function Header() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <LinkIcon className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold text-primary">SupplyChain Hub</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname === link.href
                                    ? "text-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="outline">Log In</Button>
                    </Link>
                    <Link href="/register">
                        <Button>Get Started</Button>
                    </Link>
                </div>

                {/* Mobile Navigation */}
                <Sheet>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                        <div className="flex flex-col gap-6 mt-6">
                            <Link href="/" className="flex items-center gap-2">
                                <LinkIcon className="h-6 w-6 text-primary" />
                                <span className="text-lg font-bold">SupplyChain Hub</span>
                            </Link>
                            <nav className="flex flex-col gap-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            "text-sm font-medium transition-colors hover:text-primary",
                                            pathname === link.href
                                                ? "text-primary"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                            <div className="flex flex-col gap-2 mt-4">
                                <Link href="/login" className="w-full">
                                    <Button variant="outline" className="w-full">
                                        Log In
                                    </Button>
                                </Link>
                                <Link href="/register" className="w-full">
                                    <Button className="w-full">Get Started</Button>
                                </Link>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
