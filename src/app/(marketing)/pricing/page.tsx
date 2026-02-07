import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function PricingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <section className="py-20 bg-slate-50">
                <div className="container">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h1>
                        <p className="text-xl text-slate-600">
                            Invest in your career with our affordable verification plans.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {/* Basic Plan */}
                        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-2xl">Basic Profile</CardTitle>
                                <CardDescription>For professionals just starting out</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="text-4xl font-bold mb-6">Free</div>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2 text-slate-600">
                                        <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                        <span>Create professional profile</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-slate-600">
                                        <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                        <span>List certifications (unverified)</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-slate-600">
                                        <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                        <span>Basic profile visibility</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-slate-600">
                                        <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                        <span>Search for professionals</span>
                                    </li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Link href="/register" className="w-full">
                                    <Button variant="outline" className="w-full">Get Started</Button>
                                </Link>
                            </CardFooter>
                        </Card>

                        {/* Verified Plan */}
                        <Card className="border-blue-200 shadow-md hover:shadow-lg transition-shadow relative overflow-hidden flex flex-col bg-blue-50/30">
                            <CardHeader>
                                <CardTitle className="text-2xl text-blue-700">Verified Pro</CardTitle>
                                <CardDescription>Establish credibility in the industry</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-4xl font-bold">₦20,000</span>
                                    <span className="text-slate-500">/month</span>
                                </div>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2 text-slate-700">
                                        <Check className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                        <span className="font-semibold">All Basic features</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-slate-700">
                                        <Check className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                        <span>Verified Education Status</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-slate-700">
                                        <Check className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                        <span>Verified Professional Experience</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-slate-700">
                                        <Check className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                        <span>Certification Validation Included (Limit 5)</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-slate-700">
                                        <Check className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                        <span>Official Verification Badge</span>
                                    </li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Link href="/register" className="w-full">
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Get Verified</Button>
                                </Link>
                            </CardFooter>
                        </Card>

                        {/* Top Tier Plan */}
                        <Card className="border-purple-500 shadow-xl hover:shadow-2xl transition-all relative overflow-hidden flex flex-col transform scale-105 z-10">
                            <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                TOP 1%
                            </div>
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500"></div>
                            <CardHeader>
                                <CardTitle className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-700">Elite Authority</CardTitle>
                                <CardDescription>For industry leaders & executives</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-4xl font-bold">₦100,000</span>
                                    <span className="text-slate-500">/month</span>
                                </div>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2 text-slate-800">
                                        <Check className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                                        <span className="font-semibold">All Verified Pro features</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-slate-800">
                                        <Check className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                                        <span className="font-bold text-purple-700">Unlimited Certification Verification</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-slate-800">
                                        <Check className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                                        <span className="font-bold text-purple-700">Top 1% Professional Search Visibility</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-slate-800">
                                        <Check className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                                        <span>Featured Profile Placement</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-slate-800">
                                        <Check className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                                        <span>Premium Analytics & Insights</span>
                                    </li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Link href="/register" className="w-full">
                                    <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0">Become Elite</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
}
