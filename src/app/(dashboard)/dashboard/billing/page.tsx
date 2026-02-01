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
    const [currentPlan, setCurrentPlan] = useState<"free" | "pro">("free");
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadBilling() {
            setLoading(true);
            try {
                const data = await getBillingData();
                if (data) {
                    // Start plan as FREE unless explicitly PRO
                    // cast to any to avoid TS issues if type is inferred strictly
                    setCurrentPlan((data.currentPlan as any) === "PRO" ? "pro" : "free");
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
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Current Plan</h2>
                {currentPlan === "free" ? (
                    <Card className="border-slate-200">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <Badge variant="secondary" className="mb-2">Current Plan</Badge>
                                    <CardTitle className="text-2xl">Free Plan</CardTitle>
                                    <CardDescription>Basic access to SupplyChain Hub features</CardDescription>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-slate-900">₦0<span className="text-sm font-normal text-slate-500">/month</span></div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="grid md:grid-cols-2 gap-3">
                                <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Basic profile</li>
                                <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Upload certifications (claimed)</li>
                                <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Appear in search</li>
                                <li className="flex items-center gap-2 text-sm text-slate-400"><div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px]">✕</div> Verified badge</li>
                                <li className="flex items-center gap-2 text-sm text-slate-400"><div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px]">✕</div> Profile analytics</li>
                                <li className="flex items-center gap-2 text-sm text-slate-400"><div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px]">✕</div> Priority ranking</li>
                            </ul>
                        </CardContent>
                        <CardFooter className="bg-slate-50 border-t border-slate-100">
                            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">Upgrade to Verified Pro</Button>
                        </CardFooter>
                    </Card>
                ) : (
                    <Card className="border-emerald-100 bg-emerald-50/30">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <Badge className="mb-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">Current Plan</Badge>
                                    <CardTitle className="text-2xl text-emerald-900">Verified Pro</CardTitle>
                                    <CardDescription className="text-emerald-700">Active subscription</CardDescription>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-emerald-900">₦45,000<span className="text-sm font-normal text-emerald-600">/year</span></div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="grid md:grid-cols-2 gap-3">
                                <li className="flex items-center gap-2 text-sm text-emerald-800"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verified Badge on Profile</li>
                                <li className="flex items-center gap-2 text-sm text-emerald-800"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Priority Search Ranking</li>
                                <li className="flex items-center gap-2 text-sm text-emerald-800"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Advanced Analytics</li>
                                <li className="flex items-center gap-2 text-sm text-emerald-800"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 3 Free Verifications/Year</li>
                                <li className="flex items-center gap-2 text-sm text-emerald-800"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Premium Support</li>
                                <li className="flex items-center gap-2 text-sm text-emerald-800"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Custom Profile URL</li>
                            </ul>
                        </CardContent>
                        <CardFooter className="bg-emerald-100/50 border-t border-emerald-100 flex justify-between items-center">
                            <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800">Manage Subscription</Button>
                            <Button variant="link" className="text-slate-500 hover:text-slate-700">Cancel Subscription</Button>
                        </CardFooter>
                    </Card>
                )}
            </section>

            {/* Verification Pricing Section */}
            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Pay-Per-Verification Pricing</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Single */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Single Verification</CardTitle>
                            <CardDescription>Perfect for getting started</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-900 mb-4">₦20,000</div>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-400" /> 1 Certification Verification</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-400" /> Lifetime Verified Status</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" variant="outline">Buy Now</Button>
                        </CardFooter>
                    </Card>

                    {/* Bundle 3 */}
                    <Card className="border-blue-200 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
                        <CardHeader>
                            <CardTitle>Bundle of 3</CardTitle>
                            <CardDescription>Save ₦10,000</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-600 mb-4">₦50,000</div>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> 3 Certification Verifications</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> ₦16,666 per verification</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">Buy Now</Button>
                        </CardFooter>
                    </Card>

                    {/* Bundle 5 */}
                    <Card className="border-purple-200 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">BEST VALUE</div>
                        <CardHeader>
                            <CardTitle>Bundle of 5</CardTitle>
                            <CardDescription>Save ₦25,000</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-purple-600 mb-4">₦75,000</div>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500" /> 5 Certification Verifications</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500" /> ₦15,000 per verification</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full bg-purple-600 hover:bg-purple-700">Buy Now</Button>
                        </CardFooter>
                    </Card>
                </div>
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
