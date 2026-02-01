import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800"],
    variable: "--font-plus-jakarta-sans",
    display: "swap",
});

export const metadata: Metadata = {
    title: "SupplyChain Hub - Professional Verification for Supply Chain Experts",
    description:
        "Verify your supply chain certifications and build trust with recruiters. SupplyChain Hub connects verified professionals with opportunities in Nigeria.",
    keywords: [
        "supply chain",
        "certification verification",
        "professional credentials",
        "Nigeria",
        "logistics",
        "procurement",
    ],
    authors: [{ name: "SupplyChain Hub" }],
    openGraph: {
        title: "SupplyChain Hub - Professional Verification Platform",
        description:
            "Verify your supply chain certifications and build trust with recruiters.",
        type: "website",
        locale: "en_NG",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${plusJakartaSans.variable} font-sans antialiased`}>
                {children}
                <Toaster />
            </body>
        </html>
    );
}
