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

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Free Plan */}
                        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-2xl">Basic Profile</CardTitle>
                                <CardDescription>For professionals just starting out</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold mb-6">Free</div>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2 text-slate-600">
                                        <Check className="w-5 h-5 text-green-500" />
                                        <span>Create professional profile</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-slate-600">
                                        <Check className="w-5 h-5 text-green-500" />
                                        <span>List certifications (unverified)</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-slate-600">
                                        <Check className="w-5 h-5 text-green-500" />
                                        <span>Basic profile visibility</span>
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
                        <Card className="border-blue-200 shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                RECOMMENDED
                            </div>
                            <CardHeader>
                                <CardTitle className="text-2xl text-blue-700">Verified Pro</CardTitle>
                                <CardDescription>For serious supply chain experts</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-4xl font-bold">₦5,000</span>
                                    <span className="text-slate-500">/certification</span>
                                </div>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2 text-slate-700">
                                        <Check className="w-5 h-5 text-blue-600" />
                                        <span>Official Verification Badge</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-slate-700">
                                        <Check className="w-5 h-5 text-blue-600" />
                                        <span>Priority in recruiter searches</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-slate-700">
                                        <Check className="w-5 h-5 text-blue-600" />
                                        <span>Digital Certificate Wallet</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-slate-700">
                                        <Check className="w-5 h-5 text-blue-600" />
                                        <span>Trust Score Boost</span>
                                    </li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Link href="/register" className="w-full">
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Get Verified</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
}
