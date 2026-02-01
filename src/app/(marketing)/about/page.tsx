import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ShieldCheck,
    Users,
    Award,
    MapPin,
    CheckCircle2,
    Heart,
    Linkedin,
} from "lucide-react";

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Breadcrumb - Simplified for now */}
            <div className="bg-slate-50 border-b border-slate-200 py-4">
                <div className="container">
                    <nav className="flex text-sm text-slate-500">
                        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="text-slate-900 font-medium">About Us</span>
                    </nav>
                </div>
            </div>

            {/* Hero Section */}
            <section className="py-12 md:py-20 bg-slate-50 relative overflow-hidden">
                <div className="container relative z-10">
                    <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900">
                            Building Trust in <span className="text-blue-600">Supply Chain Talent</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
                            We're on a mission to eliminate credential fraud and help genuine supply chain professionals shine.
                        </p>
                    </div>
                </div>
                {/* Background Pattern */}
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute left-0 bottom-0 w-96 h-96 bg-emerald-600 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative h-[300px] md:h-[400px] bg-slate-100 rounded-2xl overflow-hidden shadow-lg animate-slide-up">
                            {/* Placeholder for Team/Abstract Image */}
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-200 text-slate-400">
                                <Users className="w-20 h-20 opacity-20" />
                            </div>
                            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">Founded in 2024</div>
                                        <div className="text-sm text-slate-500">Lagos, Nigeria 🇳🇬</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-4">The Problem We Saw</h2>
                                <p className="text-slate-600 leading-relaxed">
                                    In Nigeria's rapidly growing supply chain sector, verifying credentials has been a manual, slow, and unreliable process. Recruiters waste millions on bad hires due to falsified certificates, while qualified professionals struggle to stand out in a crowded market.
                                </p>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Solution</h2>
                                <p className="text-slate-600 leading-relaxed">
                                    SupplyChain Hub is the first digital verification platform dedicated to the Nigerian supply chain industry. We don't just host profiles; we verify every single certification directly with issuing bodies, creating a trusted ecosystem where talent is recognized and fraud is eliminated.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Mission Section */}
            <section className="py-24 bg-slate-900 text-white text-center">
                <div className="container">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-8">
                            <Badge variant="outline" className="text-blue-400 border-blue-400 px-4 py-1 text-sm uppercase tracking-widest">Our Mission</Badge>
                        </div>
                        <blockquote className="text-3xl md:text-5xl font-bold leading-tight font-serif italic">
                            "To become the trusted source of truth for supply chain professional credentials in Africa."
                        </blockquote>
                    </div>
                </div>
            </section>

            {/* What Makes Us Different */}
            <section className="py-24 bg-slate-50">
                <div className="container">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">What Makes Us Different</h2>
                        <p className="text-slate-600">We're not just another job board or professional network.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: ShieldCheck,
                                title: "Verification, Not Just Claims",
                                desc: "We don't just accept uploads, we verify directly with issuers.",
                                color: "text-emerald-600",
                                bg: "bg-emerald-100",
                            },
                            {
                                icon: Users,
                                title: "Industry Expertise",
                                desc: "Built by supply chain professionals, for professionals.",
                                color: "text-blue-600",
                                bg: "bg-blue-100",
                            },
                            {
                                icon: CheckCircle2,
                                title: "Guarantor Model",
                                desc: "We stand behind our verifications with a guarantee.",
                                color: "text-purple-600",
                                bg: "bg-purple-100",
                            },
                            {
                                icon: MapPin,
                                title: "Nigeria-First",
                                desc: "Tailored for our market realities and local challenges.",
                                color: "text-green-600",
                                bg: "bg-green-100",
                            },
                        ].map((item, i) => (
                            <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-6 text-center">
                                    <div className={`w-14 h-14 ${item.bg} rounded-full flex items-center justify-center mx-auto mb-6`}>
                                        <item.icon className={`w-7 h-7 ${item.color}`} />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                                    <p className="text-sm text-slate-600">{item.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-24 bg-white">
                <div className="container">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Core Values</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Trust",
                                desc: "Integrity is the foundation of our platform. We ensure every verification is accurate and every profile is genuine.",
                                icon: ShieldCheck,
                            },
                            {
                                title: "Excellence",
                                desc: "We set the standard for the industry, pushing for higher levels of professionalism and competence.",
                                icon: Award,
                            },
                            {
                                title: "Community",
                                desc: "We believe in growing together. When one professional succeeds, the entire industry advances.",
                                icon: Heart,
                            },
                        ].map((value, i) => (
                            <div key={i} className="flex flex-col items-center text-center p-8 bg-slate-50 rounded-2xl">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
                                    <value.icon className="w-6 h-6 text-slate-900" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                                <p className="text-slate-600">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-24 bg-slate-50 border-t border-slate-200">
                <div className="container">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Meet Our Team</h2>
                        <p className="text-slate-600">The supply chain experts behind the platform.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                name: "Chizoba Anyamele",
                                title: "Founder & CEO",
                                experience: "15+ years in marine logistics & cargo operations",
                                image: "/team/chizoba-anyamele.png"
                            },
                            {
                                name: "Razaq Muideen",
                                title: "Co-Founder & COO",
                                experience: "18+ years in import/export & warehousing",
                                image: "/team/razaq-muideen.png"
                            },
                            {
                                name: "Aje Oluwatoyin",
                                title: "Head of Operations",
                                experience: "20+ years in logistics & supply chain",
                                image: "/team/aje-oluwatoyin.png"
                            },
                            {
                                name: "Okoli Maria",
                                title: "Head of Customer Success",
                                experience: "10+ years in courier & last mile logistics",
                                image: "/team/okoli-maria.png"
                            },
                        ].map((member, i) => (
                            <Card key={i} className="overflow-hidden border-none shadow-sm group hover:shadow-lg transition-shadow">
                                <div className="h-56 bg-gradient-to-br from-blue-50 to-slate-100 relative overflow-hidden">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover object-top"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                                <CardContent className="p-6 text-center relative">
                                    <div className="absolute -top-5 right-6 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
                                        <Linkedin className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="font-bold text-lg">{member.name}</h3>
                                    <p className="text-sm text-blue-600 font-medium">{member.title}</p>
                                    <p className="text-xs text-slate-500 mt-2">{member.experience}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-blue-600 text-white text-center">
                <div className="container">
                    <div className="max-w-3xl mx-auto space-y-8">
                        <h2 className="text-3xl md:text-5xl font-bold">Ready to get verified?</h2>
                        <p className="text-blue-100 text-lg">
                            Join thousands of supply chain professionals who are building trust and advancing their careers.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="/register">
                                <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50">
                                    For Professionals
                                </Button>
                            </Link>
                            <Link href="/recruiters">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                                    For Recruiters
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
