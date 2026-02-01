"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, FileText, CheckCircle2, BadgeCheck, Info, Loader2, Sparkles } from "lucide-react";
import { ROUTES, COMMON_CERTIFICATIONS } from "@/constants";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/shared/FadeIn";

export default function AddCertificationPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        certType: "",
        certName: "",
        issuingOrg: "",
        credentialId: "",
        issueMonth: "",
        issueYear: "",
        expiryMonth: "",
        expiryYear: "",
        noExpiry: false,
        verificationUrl: "",
        file: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, file: e.target.files[0] });
        }
    };

    const handleNext = () => {
        if (step === 1) {
            if (!formData.certType || !formData.credentialId || !formData.issueMonth || !formData.issueYear) {
                toast({
                    title: "Missing fields",
                    description: "Please fill in all required fields.",
                    variant: "destructive",
                });
                return;
            }
        }
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleSubmit = async (verify: boolean) => {
        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();

            if (formData.certType === "other") {
                formDataToSend.append("certName", formData.certName);
                formDataToSend.append("issuingOrg", formData.issuingOrg);
            } else {
                formDataToSend.append("certName", formData.certType);
                formDataToSend.append("issuingOrg", "Industry Standard");
            }

            formDataToSend.append("credentialId", formData.credentialId);

            const monthMap: Record<string, string> = {
                "January": "01", "February": "02", "March": "03", "April": "04", "May": "05", "June": "06",
                "July": "07", "August": "08", "September": "09", "October": "10", "November": "11", "December": "12"
            };

            const issueDateStr = `${formData.issueYear}-${monthMap[formData.issueMonth]}-01`;
            formDataToSend.append("issueDate", issueDateStr);

            if (!formData.noExpiry && formData.expiryYear && formData.expiryMonth) {
                const expiryDateStr = `${formData.expiryYear}-${monthMap[formData.expiryMonth]}-01`;
                formDataToSend.append("expiryDate", expiryDateStr);
            }

            if (formData.verificationUrl) {
                formDataToSend.append("verificationUrl", formData.verificationUrl);
            }

            if (formData.file) {
                formDataToSend.append("file", formData.file);
            }

            formDataToSend.append("requestVerification", verify ? "true" : "false");

            const { createCertification } = await import("@/lib/actions/certification.actions");
            const result = await createCertification(formDataToSend);

            if (result.error) {
                toast({
                    title: "Error",
                    description: result.error,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: verify ? "Verification Started!" : "Certification Added!",
                    description: verify
                        ? "We'll verify your certification and notify you within 2-5 business days."
                        : "Your certification has been saved. You can verify it anytime.",
                });
                router.push(ROUTES.certifications);
            }

        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const years = Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - i).toString());
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <FadeIn>
                <Link href={ROUTES.certifications} className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-4 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Certifications
                </Link>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Add Certification</h1>
                <p className="text-slate-600 mt-2">Enter your certification details</p>
            </FadeIn>

            {/* Progress Stepper */}
            <FadeIn delay={0.1}>
                <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

                    <div className="flex items-center justify-between relative">
                        {/* Progress Line */}
                        <div className="absolute left-[16%] right-[16%] top-5 h-1 bg-slate-200 -z-10 rounded-full" />
                        <div
                            className="absolute left-[16%] top-5 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 -z-10 rounded-full transition-all duration-500"
                            style={{ width: step === 1 ? '0%' : step === 2 ? '33%' : '68%' }}
                        />

                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex flex-col items-center gap-3 z-10">
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 shadow-lg",
                                    step >= s
                                        ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white scale-110"
                                        : "bg-white border-2 border-slate-200 text-slate-400"
                                )}>
                                    {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                                </div>
                                <span className={cn(
                                    "text-xs font-semibold uppercase tracking-wider transition-colors",
                                    step >= s ? "text-blue-600" : "text-slate-400"
                                )}>
                                    {s === 1 ? "Details" : s === 2 ? "Upload" : "Verify"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </FadeIn>

            {/* Step 1: Details */}
            {step === 1 && (
                <FadeIn delay={0.2}>
                    <Card className="glass-card border-slate-200/50">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl">Certification Details</CardTitle>
                            <CardDescription>Provide details about your professional certification</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-medium">Certification Type <span className="text-red-500">*</span></Label>
                                <Select value={formData.certType} onValueChange={(val) => setFormData({ ...formData, certType: val })}>
                                    <SelectTrigger className="bg-white/50 hover:bg-white transition-colors">
                                        <SelectValue placeholder="Select certification" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {COMMON_CERTIFICATIONS.map((cert) => (
                                            <SelectItem key={cert} value={cert}>{cert}</SelectItem>
                                        ))}
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {formData.certType === "other" && (
                                <div className="grid md:grid-cols-2 gap-4 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-medium">Certification Name <span className="text-red-500">*</span></Label>
                                        <Input
                                            className="bg-white"
                                            value={formData.certName}
                                            onChange={(e) => setFormData({ ...formData, certName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-medium">Issuing Organization <span className="text-red-500">*</span></Label>
                                        <Input
                                            className="bg-white"
                                            value={formData.issuingOrg}
                                            onChange={(e) => setFormData({ ...formData, issuingOrg: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label className="text-slate-700 font-medium">Credential ID / Certificate Number <span className="text-red-500">*</span></Label>
                                <Input
                                    placeholder="e.g., 0012345678"
                                    className="bg-white/50 hover:bg-white transition-colors font-mono"
                                    value={formData.credentialId}
                                    onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                                />
                                <p className="text-xs text-slate-500">Usually found on your certificate</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-medium">Issue Date <span className="text-red-500">*</span></Label>
                                    <div className="flex gap-2">
                                        <Select value={formData.issueMonth} onValueChange={(val) => setFormData({ ...formData, issueMonth: val })}>
                                            <SelectTrigger className="bg-white/50"><SelectValue placeholder="Month" /></SelectTrigger>
                                            <SelectContent>
                                                {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <Select value={formData.issueYear} onValueChange={(val) => setFormData({ ...formData, issueYear: val })}>
                                            <SelectTrigger className="bg-white/50"><SelectValue placeholder="Year" /></SelectTrigger>
                                            <SelectContent>
                                                {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-medium">Expiry Date</Label>
                                    <div className="flex gap-2">
                                        <Select
                                            value={formData.expiryMonth}
                                            onValueChange={(val) => setFormData({ ...formData, expiryMonth: val })}
                                            disabled={formData.noExpiry}
                                        >
                                            <SelectTrigger className="bg-white/50"><SelectValue placeholder="Month" /></SelectTrigger>
                                            <SelectContent>
                                                {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <Select
                                            value={formData.expiryYear}
                                            onValueChange={(val) => setFormData({ ...formData, expiryYear: val })}
                                            disabled={formData.noExpiry}
                                        >
                                            <SelectTrigger className="bg-white/50"><SelectValue placeholder="Year" /></SelectTrigger>
                                            <SelectContent>
                                                {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-center space-x-2 mt-2">
                                        <Checkbox
                                            id="no-expiry"
                                            checked={formData.noExpiry}
                                            onCheckedChange={(checked) => setFormData({ ...formData, noExpiry: checked as boolean })}
                                        />
                                        <label htmlFor="no-expiry" className="text-sm font-medium leading-none text-slate-600">
                                            This certification does not expire
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-700 font-medium">Verification URL (Optional)</Label>
                                <Input
                                    placeholder="https://..."
                                    className="bg-white/50 hover:bg-white transition-colors"
                                    value={formData.verificationUrl}
                                    onChange={(e) => setFormData({ ...formData, verificationUrl: e.target.value })}
                                />
                                <p className="text-xs text-slate-500">If the issuing body has an online verification registry, paste the link here</p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end pt-4">
                            <Button onClick={handleNext} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20">
                                Continue
                            </Button>
                        </CardFooter>
                    </Card>
                </FadeIn>
            )}

            {/* Step 2: Upload */}
            {step === 2 && (
                <FadeIn delay={0.1}>
                    <Card className="glass-card border-slate-200/50">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl">Upload Document</CardTitle>
                            <CardDescription>Upload a copy of your certificate for verification</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-2xl p-12 text-center hover:bg-blue-50/30 transition-all duration-300 cursor-pointer relative group">
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleFileChange}
                                />
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform shadow-lg">
                                        <Upload className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 text-lg">Drag and drop your certificate here</p>
                                        <p className="text-sm text-slate-500 mt-1">or click to browse files</p>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <Badge variant="secondary" className="bg-slate-100">PDF</Badge>
                                        <Badge variant="secondary" className="bg-slate-100">JPG</Badge>
                                        <Badge variant="secondary" className="bg-slate-100">PNG</Badge>
                                        <Badge variant="secondary" className="bg-slate-100">Max 10MB</Badge>
                                    </div>
                                </div>
                            </div>

                            {formData.file && (
                                <div className="flex items-center justify-between p-4 glass-card rounded-xl border border-emerald-200 bg-emerald-50/30">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">{formData.file.name}</p>
                                            <p className="text-xs text-slate-500">{(formData.file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setFormData({ ...formData, file: null })} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                        Remove
                                    </Button>
                                </div>
                            )}

                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl flex gap-3 items-start border border-blue-100">
                                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-blue-800">
                                    We use your certificate document to verify your credentials with the issuing body. Your document is stored securely and never shared.
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-4">
                            <Button variant="outline" onClick={handleBack}>Back</Button>
                            <div className="flex gap-4 items-center">
                                <button onClick={() => handleSubmit(false)} className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                                    Skip for now
                                </button>
                                <Button onClick={handleNext} disabled={!formData.file} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20">
                                    Continue
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </FadeIn>
            )}

            {/* Step 3: Verify */}
            {step === 3 && (
                <FadeIn delay={0.1}>
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Option A */}
                            <Card className="glass-card border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 group">
                                <CardHeader>
                                    <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                                        <FileText className="w-7 h-7 text-slate-600" />
                                    </div>
                                    <CardTitle className="text-lg">Save as Claimed</CardTitle>
                                    <CardDescription className="text-slate-500 font-medium">Free</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-slate-600">
                                        Your certification will be added to your profile as 'Claimed' (unverified). You can verify it later anytime.
                                    </p>
                                    <ul className="space-y-2 text-sm text-slate-600">
                                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-400" /> Visible on your profile</li>
                                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-400" /> Shown as "Claimed"</li>
                                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-400" /> Verify anytime later</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" className="w-full" onClick={() => handleSubmit(false)} disabled={isSubmitting}>
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Without Verification"}
                                    </Button>
                                </CardFooter>
                            </Card>

                            {/* Option B - Recommended */}
                            <Card className="glass-card border-blue-300 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 relative overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group">
                                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl flex items-center gap-1 shadow-lg">
                                    <Sparkles className="w-3 h-3" /> RECOMMENDED
                                </div>
                                <CardHeader className="pt-8">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-lg">
                                        <BadgeCheck className="w-7 h-7 text-white" />
                                    </div>
                                    <CardTitle className="text-lg text-blue-900">Verify This Certification</CardTitle>
                                    <CardDescription className="text-blue-700 font-bold text-lg">₦20,000</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-slate-600">
                                        We'll verify directly with the issuing body. Get the verified badge and boost your Trust Score.
                                    </p>
                                    <ul className="space-y-2 text-sm text-slate-600">
                                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Verified badge on profile</li>
                                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Higher search ranking</li>
                                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Trusted by recruiters</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20" onClick={() => handleSubmit(true)} disabled={isSubmitting}>
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify for ₦20,000"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>

                        <div className="glass-card bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl gap-4">
                            <div>
                                <h3 className="font-bold text-lg text-center md:text-left">You have 2 other unverified certifications</h3>
                                <p className="text-slate-300 text-sm text-center md:text-left">Verify all 3 for ₦50,000 (save ₦10,000)</p>
                            </div>
                            <Button variant="secondary" className="whitespace-nowrap w-full md:w-auto">Verify All</Button>
                        </div>

                        <div className="flex justify-start">
                            <Button variant="ghost" onClick={handleBack}>Back</Button>
                        </div>
                    </div>
                </FadeIn>
            )}
        </div>
    );
}
