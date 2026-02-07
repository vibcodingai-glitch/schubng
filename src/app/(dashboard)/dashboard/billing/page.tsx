"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { CheckCircle2, CreditCard, Download, Zap, Plus, Trash2, Star, HelpCircle, Mail, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { ROUTES } from "@/constants";
import { getBillingData } from "@/lib/actions/dashboard.actions";
import { format } from "date-fns";

export default function BillingPage() {
    const { toast } = useToast();
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [currentPlan, setCurrentPlan] = useState<"free" | "pro" | "elite">("free");
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadBilling() {
            setLoading(true);
            try {
                const data = await getBillingData();
                if (data) {
                    // Start plan as FREE unless explicitly PRO or ELITE
                    const plan = (data.currentPlan as string).toUpperCase();
                    if (plan === "ELITE_AUTHORITY" || plan === "ELITE") {
                        setCurrentPlan("elite");
                    } else if (plan === "VERIFIED_PRO" || plan === "PRO") {
                        setCurrentPlan("pro");
                    } else {
                        setCurrentPlan("free");
                    }
                    setTransactions(data.transactions || []);
                }
            } catch (error) {
                console.error("Failed to load billing data", error);
            } finally {
                setLoading(false);
            }
        }
        loadBilling();
    }, []);

    const handleAddCard = () => {
        setIsAddingCard(true);
        setTimeout(() => {
            setIsAddingCard(false);
            toast({
                title: "Card added successfully",
                description: "Your payment method has been saved.",
            });
        }, 1500);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-10">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Billing & Payments</h1>
                    <p className="text-slate-600 mt-2">Manage your subscription and payment methods</p>
                </div>
            </div>

            {/* Current Plan Section */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-slate-900">Subscription Plans</h2>
                </div>

                {currentPlan === "free" && (
                    <div className="space-y-6">
                        {/* Current: Free */}
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <Badge variant="secondary" className="mb-2">Current Plan</Badge>
                                        <CardTitle className="text-2xl">Basic Profile</CardTitle>
                                        <CardDescription>For professionals just starting out</CardDescription>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-slate-900">Free</div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="grid md:grid-cols-2 gap-3">
                                    <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Create professional profile</li>
                                    <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> List certifications (unverified)</li>
                                    <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Basic profile visibility</li>
                                    <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Search for professionals</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Option: Verified Pro */}
                            <Card className="border-blue-200 bg-blue-50/10">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-xl text-blue-700">Verified Pro</CardTitle>
                                            <CardDescription>Establish credibility in the industry</CardDescription>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-slate-900">₦20,000<span className="text-sm font-normal text-slate-500">/mo</span></div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 mb-4">
                                        <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Verified Education & Experience</li>
                                        <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Official Verification Badge</li>
                                        <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-blue-600" /> 5 Certification Validations</li>
                                    </ul>
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Upgrade to Verified Pro</Button>
                                </CardContent>
                            </Card>

                            {/* Option: Elite Authority */}
                            <Card className="border-purple-200 bg-purple-50/10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl">TOP 1%</div>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-xl text-purple-700">Elite Authority</CardTitle>
                                            <CardDescription>For industry leaders</CardDescription>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-slate-900">₦100,000<span className="text-sm font-normal text-slate-500">/mo</span></div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 mb-4">
                                        <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-purple-600" /> Unlimited Verifications</li>
                                        <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-purple-600" /> Top 1% Search Visibility</li>
                                        <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-purple-600" /> Featured Profile Placement</li>
                                    </ul>
                                    <Button className="w-full bg-purple-600 hover:bg-purple-700">Upgrade to Elite</Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {currentPlan === "pro" && (
                    <div className="space-y-6">
                        {/* Current: Verified Pro */}
                        <Card className="border-blue-200 bg-blue-50/30">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <Badge className="mb-2 bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">Current Plan</Badge>
                                        <CardTitle className="text-2xl text-blue-900">Verified Pro</CardTitle>
                                        <CardDescription className="text-blue-700">Active subscription</CardDescription>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-blue-900">₦20,000<span className="text-sm font-normal text-blue-600">/mo</span></div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="grid md:grid-cols-2 gap-3">
                                    <li className="flex items-center gap-2 text-sm text-blue-800"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Verified Education Status</li>
                                    <li className="flex items-center gap-2 text-sm text-blue-800"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Verified Professional Experience</li>
                                    <li className="flex items-center gap-2 text-sm text-blue-800"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Official Verification Badge</li>
                                    <li className="flex items-center gap-2 text-sm text-blue-800"><CheckCircle2 className="w-4 h-4 text-blue-600" /> 5 Certification Validations</li>
                                    <li className="flex items-center gap-2 text-sm text-blue-800"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Priority Search Ranking</li>
                                </ul>
                            </CardContent>
                            <CardFooter className="bg-blue-100/50 border-t border-blue-100 flex justify-between items-center">
                                <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-800">Manage Subscription</Button>
                                <Button variant="link" className="text-slate-500 hover:text-slate-700">Cancel Subscription</Button>
                            </CardFooter>
                        </Card>

                        {/* Upgrade to Elite */}
                        <div className="grid md:grid-cols-1 gap-6">
                            <Card className="border-purple-200 bg-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl">UPGRADE</div>
                                <div className="flex flex-col md:flex-row items-center">
                                    <div className="flex-1 p-6">
                                        <CardTitle className="text-xl text-purple-700 mb-2">Elite Authority</CardTitle>
                                        <CardDescription className="mb-4">Unlock unlimited power and visibility</CardDescription>
                                        <ul className="grid grid-cols-2 gap-2">
                                            <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-purple-600" /> Unlimited Verifications</li>
                                            <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-purple-600" /> Top 1% Visibility</li>
                                            <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-purple-600" /> Featured Placement</li>
                                            <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-purple-600" /> Premium Analytics</li>
                                        </ul>
                                    </div>
                                    <div className="p-6 bg-purple-50 h-full flex flex-col justify-center items-center min-w-[200px] border-l border-purple-100">
                                        <div className="text-2xl font-bold text-slate-900 mb-4">₦100,000<span className="text-sm font-normal text-slate-500">/mo</span></div>
                                        <Button className="w-full bg-purple-600 hover:bg-purple-700">Upgrade to Elite</Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {currentPlan === "elite" && (
                    <div className="space-y-6">
                        {/* Current: Elite Authority */}
                        <Card className="border-purple-200 bg-purple-50/30 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl">TOP 1%</div>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <Badge className="mb-2 bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200">Current Plan</Badge>
                                        <CardTitle className="text-2xl text-purple-900">Elite Authority</CardTitle>
                                        <CardDescription className="text-purple-700">Active subscription</CardDescription>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-purple-900">₦100,000<span className="text-sm font-normal text-purple-600">/mo</span></div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="grid md:grid-cols-2 gap-3">
                                    <li className="flex items-center gap-2 text-sm text-purple-800"><CheckCircle2 className="w-4 h-4 text-purple-600" /> Unlimited Verifications</li>
                                    <li className="flex items-center gap-2 text-sm text-purple-800"><CheckCircle2 className="w-4 h-4 text-purple-600" /> Top 1% Search Visibility</li>
                                    <li className="flex items-center gap-2 text-sm text-purple-800"><CheckCircle2 className="w-4 h-4 text-purple-600" /> Featured Profile Placement</li>
                                    <li className="flex items-center gap-2 text-sm text-purple-800"><CheckCircle2 className="w-4 h-4 text-purple-600" /> Premium Analytics</li>
                                    <li className="flex items-center gap-2 text-sm text-purple-800"><CheckCircle2 className="w-4 h-4 text-purple-600" /> Priority Support 24/7</li>
                                    <li className="flex items-center gap-2 text-sm text-purple-800"><CheckCircle2 className="w-4 h-4 text-purple-600" /> All Verified Pro Features</li>
                                </ul>
                            </CardContent>
                            <CardFooter className="bg-purple-100/50 border-t border-purple-100 flex justify-between items-center">
                                <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-100 hover:text-purple-800">Manage Subscription</Button>
                                <Button variant="link" className="text-slate-500 hover:text-slate-700">Cancel Subscription</Button>
                            </CardFooter>
                        </Card>
                    </div>
                )}
            </section>

            {/* Verification Credits (Conditional) - hardcoded for MVP */}
            <section>
                <Card className="bg-slate-900 text-white border-none">
                    <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Available Verification Credits</h3>
                                <p className="text-slate-300">You have <span className="text-white font-bold">0 credits</span> remaining</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-400 hidden md:inline">Credits don't expire</span>
                            <Link href={ROUTES.certifications}>
                                <Button variant="secondary" className="whitespace-nowrap">Use Credits</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Payment Methods */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-slate-900">Payment Methods</h2>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Plus className="w-4 h-4" /> Add Payment Method
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Payment Method</DialogTitle>
                                <DialogDescription>Enter your card details securely.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label>Card Number</Label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input placeholder="0000 0000 0000 0000" className="pl-10" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Expiry Date</Label>
                                        <Input placeholder="MM/YY" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>CVV</Label>
                                        <Input placeholder="123" />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="save-card" defaultChecked />
                                    <label htmlFor="save-card" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Save this card for future payments
                                    </label>
                                </div>
                                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded">
                                    <span className="font-semibold">Secured by Paystack</span>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAddCard} disabled={isAddingCard}>
                                    {isAddingCard ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                    Add Card
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="space-y-4">
                    {/* Placeholder for saved card - could come from DB in future */}
                </div>
            </section>

            {/* Billing History */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-slate-900">Billing History</h2>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Download className="w-4 h-4" /> Download All
                    </Button>
                </div>

                <Card>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.length > 0 ? (
                                    transactions.map((tx) => (
                                        <TableRow key={tx.id}>
                                            <TableCell className="font-medium">{format(new Date(tx.createdAt), "MMM d, yyyy")}</TableCell>
                                            <TableCell>{tx.description || "Subscription / Verification"}</TableCell>
                                            <TableCell>₦{(tx.amount || 0).toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Badge className={tx.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200" : "bg-slate-100 text-slate-700"}>
                                                    {tx.status || "Paid"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <Download className="w-4 h-4 text-slate-500" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                            No transactions found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            </section>

            {/* Need Help */}
            <section>
                <Card className="bg-slate-50 border-slate-200">
                    <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-full border border-slate-200 flex items-center justify-center">
                                <HelpCircle className="w-6 h-6 text-slate-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Questions about billing?</h3>
                                <p className="text-slate-600">Our support team is here to help you with any issues.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-medium text-slate-900">billing@supplychainhub.com</p>
                                <p className="text-xs text-slate-500">Mon-Fri, 9am-5pm WAT</p>
                            </div>
                            <Button variant="outline" className="gap-2">
                                <Mail className="w-4 h-4" /> Contact Support
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
