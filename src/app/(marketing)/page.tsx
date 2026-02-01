import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    ShieldCheck,
    TrendingUp,
    Users,
    Lock,
    Search,
    MapPin,
    CheckCircle2,
    ArrowRight,
    Award,
} from "lucide-react";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 overflow-hidden bg-slate-50">
                <div className="container relative z-10">
                    <div className="flex flex-col items-center text-center max-w-5xl mx-auto space-y-8 animate-fade-in">
                        <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 mb-4 animate-slide-up">
                            🇳🇬 The #1 Verification Platform in Nigeria
                        </Badge>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                            Your Supply Chain Credentials, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">Verified and Trusted</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: "0.2s" }}>
                            The only platform where Supply Chain professionals prove their expertise, and recruiters hire with confidence.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center animate-slide-up" style={{ animationDelay: "0.3s" }}>
                            <Link href="/register">
                                <Button size="lg" className="w-full sm:w-auto text-base px-8 py-6 h-auto shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all">
                                    Get Verified
                                </Button>
                            </Link>
                            <Link href="/recruiters">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8 py-6 h-auto">
                                    For Recruiters
                                </Button>
                            </Link>
                        </div>

                        {/* Stats Bar */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 mt-8 border-t border-slate-200 w-full max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: "0.4s" }}>
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-bold text-slate-900">2,500+</span>
                                <span className="text-sm text-slate-500 font-medium uppercase tracking-wider">Professionals</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-bold text-emerald-600">1,200+</span>
                                <span className="text-sm text-slate-500 font-medium uppercase tracking-wider">Verified Certifications</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-bold text-blue-600">150+</span>
                                <span className="text-sm text-slate-500 font-medium uppercase tracking-wider">Hiring Companies</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Background decoration */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0 opacity-30 pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-200 rounded-full blur-3xl mix-blend-multiply animate-pulse-gentle"></div>
                    <div className="absolute top-1/2 right-0 w-64 h-64 bg-emerald-200 rounded-full blur-3xl mix-blend-multiply animate-pulse-gentle" style={{ animationDelay: "1s" }}></div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 bg-white">
                <div className="container">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
                        <p className="text-lg text-slate-600">
                            Get verified in three simple steps and boost your career credibility.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative max-w-6xl mx-auto">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-100 -z-10"></div>

                        <div className="flex flex-col items-center text-center group">
                            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border-4 border-white shadow-sm z-10">
                                <Users className="w-10 h-10 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">1. Create Your Profile</h3>
                            <p className="text-slate-600 leading-relaxed max-w-xs mx-auto">
                                Build your professional supply chain profile with your experience and background.
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center group">
                            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border-4 border-white shadow-sm z-10">
                                <Award className="w-10 h-10 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">2. Submit Certifications</h3>
                            <p className="text-slate-600 leading-relaxed max-w-xs mx-auto">
                                Upload your certifications for verification. We verify directly with issuing bodies.
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center group">
                            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border-4 border-white shadow-sm z-10">
                                <ShieldCheck className="w-10 h-10 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">3. Get Verified</h3>
                            <p className="text-slate-600 leading-relaxed max-w-xs mx-auto">
                                Receive your verified badge, boost your trust score, and stand out to recruiters.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-slate-50">
                <div className="container">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Choose SupplyChain Hub?</h2>
                        <p className="text-lg text-slate-600">
                            Built specifically for the Nigerian supply chain ecosystem.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                    <CheckCircle2 className="w-6 h-6 text-blue-600" />
                                </div>
                                <CardTitle>Certification Verification</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 text-left">
                                    We verify credentials directly with global issuing bodies to ensure 100% authenticity.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                                </div>
                                <CardTitle>Trust Score</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 text-left">
                                    Build credibility with our proprietary trust score system that ranks your professional standing.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                    <Award className="w-6 h-6 text-purple-600" />
                                </div>
                                <CardTitle>Supply Chain Focused</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 text-left">
                                    Tailored specifically for logistics, procurement, and supply chain management professionals.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                    <MapPin className="w-6 h-6 text-green-600" />
                                </div>
                                <CardTitle>Nigeria-First</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 text-left">
                                    Designed for the unique challenges and opportunities of the Nigerian market.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                                    <Search className="w-6 h-6 text-amber-600" />
                                </div>
                                <CardTitle>Recruiter Access</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 text-left">
                                    Get discovered by top companies looking for verified talent in Nigeria.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                                    <Lock className="w-6 h-6 text-slate-600" />
                                </div>
                                <CardTitle>Secure & Private</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 text-left">
                                    Your data is encrypted and protected. You control who sees your verified credentials.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Certification Partners Section */}
            <section className="py-20 bg-white border-y border-slate-100">
                <div className="container text-center">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-10">
                        We verify certifications from leading global bodies
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {["APICS", "CIPS", "CILT", "ISM", "PMP", "Six Sigma"].map((partner) => (
                            <div key={partner} className="text-xl md:text-2xl font-bold text-slate-400 hover:text-slate-800 transition-colors">
                                {partner}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-slate-50">
                <div className="container">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Trusted by Professionals</h2>
                        <p className="text-lg text-slate-600">
                            See what verified professionals are saying about SupplyChain Hub.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {[
                            {
                                quote: "Getting verified on SupplyChain Hub helped me land a Senior Procurement role at a top FMCG company in Lagos.",
                                name: "Chidinma Okonkwo",
                                role: "Procurement Manager",
                                company: "Nestle Nigeria",
                            },
                            {
                                quote: "The verification process was smooth and fast. Now recruiters trust my credentials without asking for physical copies.",
                                name: "Tunde Bakare",
                                role: "Logistics Coordinator",
                                company: "Jumia",
                            },
                            {
                                quote: "SupplyChain Hub is a game-changer for the Nigerian supply chain industry. It brings a new level of professionalism.",
                                name: "Emmanuel Adebayo",
                                role: "Supply Chain Director",
                                company: "Dangote Group",
                            },
                        ].map((testimonial, i) => (
                            <Card key={i} className="border-none shadow-sm bg-white">
                                <CardContent className="p-8">
                                    <div className="flex gap-1 mb-4">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <div key={star} className="w-4 h-4 text-amber-400 fill-current">★</div>
                                        ))}
                                    </div>
                                    <p className="text-slate-700 mb-6 italic">"{testimonial.quote}"</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm">
                                            {testimonial.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-900">{testimonial.name}</div>
                                            <div className="text-xs text-slate-500">{testimonial.role}, {testimonial.company}</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Preview Section */}
            <section className="py-20 bg-blue-600 text-white overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
                </div>

                <div className="container relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-2">Simple, Transparent Pricing</h2>
                            <p className="text-blue-100 text-lg">
                                Verification starts at <span className="font-bold text-white">₦20,000</span> per certification
                            </p>
                        </div>
                        <Link href="/pricing">
                            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50 border-none">
                                View Pricing
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
                <div className="container relative z-10">
                    <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-8">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                            Join Nigeria's Growing Network of Verified Supply Chain Professionals
                        </h2>
                        <p className="text-lg text-slate-400 max-w-2xl">
                            Start building your trusted professional profile today. It takes less than 2 minutes to get started.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto">
                            <Input
                                type="email"
                                placeholder="Enter your email address"
                                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-12"
                            />
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8">
                                Get Started
                            </Button>
                        </div>
                        <p className="text-sm text-slate-500">
                            No credit card required for signup. Free basic profile.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
