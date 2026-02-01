import Link from "next/link";
import { ShieldCheck, Twitter, Linkedin, Facebook, Instagram } from "lucide-react";

const footerLinks = {
    product: [
        { label: "Features", href: "/#features" },
        { label: "Pricing", href: "/pricing" },
        { label: "Verification", href: "/verification" },
        { label: "For Recruiters", href: "/recruiters" },
    ],
    company: [
        { label: "About Us", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" },
    ],
    legal: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
    ],
};

export function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-200">
            <div className="container py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <ShieldCheck className="h-8 w-8 text-emerald-500" />
                            <span className="text-xl font-bold text-white">SupplyChain Hub</span>
                        </Link>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            The trusted verification platform for supply chain professionals in Nigeria. Build credibility and advance your career.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="#" className="hover:text-white transition-colors">
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                            <Link href="#" className="hover:text-white transition-colors">
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link href="#" className="hover:text-white transition-colors">
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-4">Product</h3>
                        <ul className="space-y-2">
                            {footerLinks.product.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-slate-400 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-4">Company</h3>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-slate-400 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-4">Legal</h3>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-slate-400 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-400">
                        © {new Date().getFullYear()} SupplyChain Hub. All rights reserved.
                    </p>
                    <p className="text-sm text-slate-400">
                        Made in Nigeria 🇳🇬
                    </p>
                </div>
            </div>
        </footer>
    );
}
