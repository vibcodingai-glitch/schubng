"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    MapPin,
    Briefcase,
    CheckCircle2,
    Award,
    Calendar,
    ExternalLink,
    Loader2,
    TrendingUp
} from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

interface ProfileQuickViewProps {
    username: string;
    isOpen: boolean;
    onClose: () => void;
}

// Mock professional data (in real app, this would be fetched)
const getMockProfessional = (username: string) => ({
    name: "Adebayo Okonkwo",
    username,
    headline: "Supply Chain Manager at Dangote Industries",
    avatar: null,
    isVerified: true,
    state: "Lagos",
    city: "Ikeja",
    industry: "Manufacturing",
    trustScore: 82,
    summary: "Experienced supply chain professional with 10+ years of expertise in end-to-end supply chain optimization, demand planning, and inventory management. Proven track record of driving operational efficiency and cost reduction in manufacturing and FMCG sectors across Nigeria.",
    skills: ["S&OP", "SAP", "Demand Planning", "Procurement", "Analytics", "Inventory Management", "Logistics", "Six Sigma"],
    certifications: [
        {
            name: "CSCP - Certified Supply Chain Professional",
            issuingBody: "APICS/ASCM",
            verified: true,
            verifiedDate: "December 2024"
        },
        {
            name: "PMP - Project Management Professional",
            issuingBody: "PMI",
            verified: true,
            verifiedDate: "November 2024"
        },
        {
            name: "Six Sigma Green Belt",
            issuingBody: "ASQ",
            verified: false,
            verifiedDate: null
        }
    ],
    experience: [
        {
            role: "Supply Chain Manager",
            company: "Dangote Industries",
            duration: "Jan 2020 - Present",
            location: "Lagos, Nigeria",
            isCurrent: true
        },
        {
            role: "Senior Procurement Officer",
            company: "Shell Nigeria",
            duration: "Mar 2015 - Dec 2019",
            location: "Port Harcourt, Nigeria",
            isCurrent: false
        },
        {
            role: "Procurement Specialist",
            company: "Unilever Nigeria",
            duration: "Jun 2012 - Feb 2015",
            location: "Lagos, Nigeria",
            isCurrent: false
        }
    ]
});

export function ProfileQuickView({ username, isOpen, onClose }: ProfileQuickViewProps) {
    const [isLoading, setIsLoading] = React.useState(true);
    const professional = getMockProfessional(username);

    React.useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            // Simulate loading
            const timer = setTimeout(() => setIsLoading(false), 500);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const getTrustScoreColor = (score: number) => {
        if (score >= 80) return "text-emerald-600";
        if (score >= 50) return "text-amber-600";
        return "text-slate-600";
    };

    const getTrustScoreBg = (score: number) => {
        if (score >= 80) return "bg-emerald-600";
        if (score >= 50) return "bg-amber-600";
        return "bg-slate-600";
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : (
                    <>
                        <DialogHeader className="sr-only">
                            Profile Quick View
                        </DialogHeader>

                        {/* Profile Header */}
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <Avatar className="h-20 w-20 border-4 border-white shadow-lg ring-2 ring-blue-200">
                                    <AvatarImage src={professional.avatar || undefined} />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                                        {professional.name.split(" ").map(n => n[0]).join("")}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 space-y-2">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-2xl font-bold text-slate-900">{professional.name}</h2>
                                            {professional.isVerified && (
                                                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                                    Verified
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-lg text-slate-700 mt-1">{professional.headline}</p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4" />
                                            <span>{professional.city}, {professional.state}, Nigeria</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Briefcase className="w-4 h-4" />
                                            <span>{professional.industry}</span>
                                        </div>
                                    </div>

                                    {/* Trust Score */}
                                    <div className="bg-slate-50 rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className={`w-4 h-4 ${getTrustScoreColor(professional.trustScore)}`} />
                                                <span className="text-sm font-medium text-slate-700">Trust Score</span>
                                            </div>
                                            <span className={`text-lg font-bold ${getTrustScoreColor(professional.trustScore)}`}>
                                                {professional.trustScore}/100
                                            </span>
                                        </div>
                                        <Progress value={professional.trustScore} className="h-2" />
                                    </div>
                                </div>

                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/p/${professional.username}`}>
                                        <ExternalLink className="w-4 h-4 mr-1.5" />
                                        Full Profile
                                    </Link>
                                </Button>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <Button className="flex-1" disabled>
                                    Connect
                                    <Badge variant="secondary" className="ml-2 text-xs">Soon</Badge>
                                </Button>
                                <Button variant="outline" className="flex-1" disabled>
                                    Message
                                    <Badge variant="secondary" className="ml-2 text-xs">Soon</Badge>
                                </Button>
                            </div>
                        </div>

                        <Separator />

                        {/* Tabs */}
                        <Tabs defaultValue="about" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="about">About</TabsTrigger>
                                <TabsTrigger value="credentials">Credentials</TabsTrigger>
                                <TabsTrigger value="experience">Experience</TabsTrigger>
                            </TabsList>

                            {/* About Tab */}
                            <TabsContent value="about" className="space-y-4 mt-4">
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-2">Professional Summary</h3>
                                    <p className="text-slate-700 leading-relaxed">{professional.summary}</p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-3">Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {professional.skills.map((skill, idx) => (
                                            <Badge key={idx} variant="secondary" className="bg-blue-50 text-blue-700">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Credentials Tab */}
                            <TabsContent value="credentials" className="space-y-3 mt-4">
                                {professional.certifications.map((cert, idx) => (
                                    <Card key={idx} className={cert.verified ? "border-emerald-200 bg-emerald-50/30" : "border-slate-200"}>
                                        <CardContent className="pt-4">
                                            <div className="flex items-start gap-3">
                                                {cert.verified ? (
                                                    <div className="bg-emerald-100 rounded-full p-2">
                                                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                                    </div>
                                                ) : (
                                                    <div className="bg-slate-100 rounded-full p-2">
                                                        <Award className="w-5 h-5 text-slate-400" />
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <h4 className="font-semibold text-slate-900">{cert.name}</h4>
                                                            <p className="text-sm text-slate-600 mt-0.5">{cert.issuingBody}</p>
                                                        </div>
                                                        {cert.verified ? (
                                                            <Badge className="bg-emerald-600 hover:bg-emerald-700">
                                                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                                                Verified
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="border-slate-300 text-slate-600">
                                                                Claimed
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    {cert.verifiedDate && (
                                                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            Verified {cert.verifiedDate}
                                                        </p>
                                                    )}
                                                    {!cert.verified && (
                                                        <p className="text-xs text-slate-500 mt-2">Not yet verified</p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                {professional.certifications.length > 3 && (
                                    <Button variant="link" className="w-full text-blue-600" asChild>
                                        <Link href={`/p/${professional.username}`}>
                                            See all certifications on full profile
                                            <ExternalLink className="w-4 h-4 ml-1" />
                                        </Link>
                                    </Button>
                                )}
                            </TabsContent>

                            {/* Experience Tab */}
                            <TabsContent value="experience" className="space-y-4 mt-4">
                                {professional.experience.slice(0, 3).map((exp, idx) => (
                                    <div key={idx} className="flex gap-3">
                                        <div className="bg-slate-100 rounded-lg p-2 h-10 w-10 flex items-center justify-center flex-shrink-0">
                                            <Briefcase className="w-5 h-5 text-slate-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-slate-900">{exp.role}</h4>
                                            <p className="text-sm text-slate-700">{exp.company}</p>
                                            <p className="text-sm text-slate-500 mt-1">{exp.duration}</p>
                                            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {exp.location}
                                            </p>
                                        </div>
                                        {exp.isCurrent && (
                                            <Badge variant="secondary" className="h-fit bg-blue-50 text-blue-700">
                                                Current
                                            </Badge>
                                        )}
                                    </div>
                                ))}
                                {professional.experience.length > 3 && (
                                    <Button variant="link" className="w-full text-blue-600" asChild>
                                        <Link href={`/p/${professional.username}`}>
                                            See all experience on full profile
                                            <ExternalLink className="w-4 h-4 ml-1" />
                                        </Link>
                                    </Button>
                                )}
                            </TabsContent>
                        </Tabs>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
