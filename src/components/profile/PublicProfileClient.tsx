"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
    MapPin,
    Calendar,
    Shield,
    CheckCircle2,
    Share2,
    MessageSquare,
    UserPlus,
    Building2,
    GraduationCap,
    Link as LinkIcon,
    Flag,
    Copy,
    Linkedin,
    Mail,
    Phone,
    Users
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { useState, useTransition } from "react";
import { toggleConnection } from "@/lib/actions/user.actions";
import { Check } from "lucide-react";

interface PublicProfileProps {
    profile: any; // Using any for mock data simplicity, ideally use a proper type
}

export default function PublicProfileClient({ profile }: PublicProfileProps) {
    const [isPending, startTransition] = useTransition();
    const [isConnected, setIsConnected] = useState(profile.isConnected);

    const verifiedCerts = profile.certifications.filter((c: any) => c.verified);
    const otherCerts = profile.certifications.filter((c: any) => !c.verified);

    const handleConnect = () => {
        startTransition(async () => {
            const result = await toggleConnection(profile.username); // username here is userId
            if (result.success) {
                setIsConnected(result.isConnected);
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Header */}
            <div className="bg-slate-900 text-white pt-24 pb-12 md:pt-32 md:pb-16">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
                        {/* Left Side: Profile Info */}
                        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                            <div className="relative">
                                <Avatar className="w-32 h-32 border-4 border-slate-800 shadow-xl">
                                    <AvatarImage src={profile.profilePhotoUrl || "/placeholder-avatar.jpg"} />
                                    <AvatarFallback className="text-4xl bg-slate-800 text-slate-400">
                                        {profile.fullName.split(' ').map((n: string) => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                {profile.verified && (
                                    <div className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1.5 rounded-full border-4 border-slate-900" title="Verified Professional">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2 max-w-2xl">
                                <h1 className="text-3xl md:text-4xl font-bold">{profile.fullName}</h1>
                                <p className="text-xl text-slate-300 font-light">{profile.headline}</p>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-400 pt-2">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {profile.location}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        Member since {profile.memberSince}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        {profile.connectionsCount || 0} connections
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Trust Score & Actions */}
                        <div className="flex flex-col items-center md:items-end gap-6 w-full md:w-auto">
                            <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700 backdrop-blur-sm">
                                <div className="text-right">
                                    <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Trust Score</div>
                                    <div className={cn("text-2xl font-bold", profile.trustScore.color)}>{profile.trustScore.level}</div>
                                </div>
                                <div className="relative w-16 h-16 flex items-center justify-center">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                        <path
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="#1e293b"
                                            strokeWidth="3"
                                        />
                                        <path
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke={profile.trustScore.score >= 80 ? "#10b981" : profile.trustScore.score >= 60 ? "#3b82f6" : "#f59e0b"}
                                            strokeWidth="3"
                                            strokeDasharray={`${profile.trustScore.score}, 100`}
                                        />
                                    </svg>
                                    <span className="absolute text-lg font-bold">{profile.trustScore.score}</span>
                                </div>
                            </div>

                            <div className="flex gap-3 w-full md:w-auto">
                                <Button
                                    className={cn(
                                        "flex-1 md:flex-none",
                                        isConnected
                                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                            : "bg-blue-600 hover:bg-blue-700 text-white"
                                    )}
                                    onClick={handleConnect}
                                    disabled={isPending}
                                >
                                    {isConnected ? (
                                        <>
                                            <Check className="w-4 h-4 mr-2" /> Connected
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="w-4 h-4 mr-2" /> Connect
                                        </>
                                    )}
                                </Button>
                                <Button variant="outline" className="flex-1 md:flex-none text-white border-slate-600 hover:bg-slate-800 hover:text-white">
                                    <MessageSquare className="w-4 h-4 mr-2" /> Message
                                </Button>
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
                                    <Share2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 -mt-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column (Main) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* About */}
                        <Card>
                            <CardHeader>
                                <CardTitle>About</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 leading-relaxed">{profile.about}</p>
                            </CardContent>
                        </Card>

                        {/* Verified Credentials */}
                        <Card className="border-emerald-100 overflow-hidden">
                            <CardHeader className="bg-emerald-50/50 border-b border-emerald-100 pb-4">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                                    <CardTitle className="text-emerald-900">Verified Credentials</CardTitle>
                                    <Badge className="ml-auto bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200 gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> Verified by SupplyChain Hub
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {verifiedCerts.map((cert: any, index: number) => (
                                    <div key={cert.id} className={cn(
                                        "p-6 flex flex-col sm:flex-row gap-4 hover:bg-slate-50 transition-colors border-l-4 border-l-emerald-500",
                                        index !== verifiedCerts.length - 1 && "border-b border-slate-100"
                                    )}>
                                        <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm text-lg font-bold text-slate-700">
                                            {cert.logo}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                                <div>
                                                    <h3 className="font-semibold text-slate-900 text-lg">{cert.name}</h3>
                                                    <p className="text-slate-600">{cert.issuer}</p>
                                                </div>
                                                <Badge variant="outline" className="w-fit border-emerald-200 text-emerald-700 bg-emerald-50 gap-1">
                                                    <CheckCircle2 className="w-3 h-3" /> Verified
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                                <span>Issued: {cert.issueDate}</span>
                                                {cert.expiryDate && <span>Expires: {cert.expiryDate}</span>}
                                            </div>
                                            <div className="mt-4">
                                                <Link href="#" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                                                    <LinkIcon className="w-3 h-3" /> Verify this credential
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Other Credentials */}
                        {otherCerts.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Other Credentials</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4">
                                    {otherCerts.map((cert: any) => (
                                        <div key={cert.id} className="flex items-start gap-4 p-4 rounded-lg border border-slate-100 bg-slate-50/50">
                                            <div className="w-10 h-10 bg-white rounded border border-slate-200 flex items-center justify-center flex-shrink-0 text-sm font-bold text-slate-500">
                                                {cert.logo}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-medium text-slate-900">{cert.name}</h4>
                                                    <Badge variant="secondary" className="text-slate-500 bg-slate-200 hover:bg-slate-200">Claimed</Badge>
                                                </div>
                                                <p className="text-sm text-slate-500">{cert.issuer}</p>
                                                <p className="text-xs text-slate-400 mt-2">This credential has not been independently verified.</p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* Experience */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Experience</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                {profile.experience.map((exp: any, index: number) => (
                                    <div key={exp.id} className="flex gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Building2 className="w-6 h-6 text-slate-400" />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div>
                                                <h3 className="font-semibold text-slate-900">{exp.title}</h3>
                                                <p className="text-slate-700 font-medium">{exp.company}</p>
                                                <p className="text-sm text-slate-500">{exp.duration} • {exp.location}</p>
                                            </div>
                                            <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-slate-600">
                                                {exp.description.map((desc: string, i: number) => (
                                                    <li key={i}>{desc}</li>
                                                ))}
                                            </ul>
                                            {index !== profile.experience.length - 1 && <Separator className="mt-6" />}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Education */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Education</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {profile.education.map((edu: any, index: number) => (
                                    <div key={edu.id} className="flex gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <GraduationCap className="w-6 h-6 text-slate-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-900">{edu.institution}</h3>
                                            <p className="text-slate-700">{edu.degree}, {edu.field}</p>
                                            <p className="text-sm text-slate-500">{edu.years}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Skills */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Skills</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills.map((skill: string) => (
                                        <Badge key={skill} variant="secondary" className="px-3 py-1 text-sm bg-slate-100 text-slate-700 hover:bg-slate-200">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="space-y-6">
                        {/* Trust Score Breakdown */}
                        <Card className="sticky top-24 shadow-lg border-slate-200">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Trust Score Breakdown</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Verified Certifications</span>
                                    <span className="font-medium text-emerald-600">{profile.trustScoreBreakdown?.certificationScore || 0}/30 pts</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(profile.trustScoreBreakdown?.certificationScore || 0) / 30 * 100}%` }}></div>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Verified Education</span>
                                    <span className="font-medium text-blue-600">{profile.trustScoreBreakdown?.educationScore || 0}/35 pts</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(profile.trustScoreBreakdown?.educationScore || 0) / 35 * 100}%` }}></div>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Verified Experience</span>
                                    <span className="font-medium text-slate-500">{profile.trustScoreBreakdown?.experienceScore || 0}/35 pts</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div className="bg-slate-300 h-2 rounded-full" style={{ width: `${(profile.trustScoreBreakdown?.experienceScore || 0) / 35 * 100}%` }}></div>
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <Link href="#" className="text-sm text-blue-600 hover:underline flex items-center justify-center">
                                        What is Trust Score?
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Contact</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {profile.contact.public ? (
                                    <>
                                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                <span className="text-sm text-slate-600 truncate">{profile.contact.email}</span>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                                <Copy className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <Phone className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm text-slate-600">{profile.contact.phone}</span>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                                <Copy className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <a href={`https://${profile.contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors group">
                                            <div className="flex items-center gap-3">
                                                <Linkedin className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm text-blue-700 font-medium">LinkedIn Profile</span>
                                            </div>
                                            <LinkIcon className="w-4 h-4 text-blue-400 group-hover:text-blue-600" />
                                        </a>
                                    </>
                                ) : (
                                    <div className="text-center py-4 space-y-3">
                                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                                            <Shield className="w-6 h-6 text-slate-400" />
                                        </div>
                                        <p className="text-sm text-slate-500">Contact information is private</p>
                                        <Button variant="outline" className="w-full">Request Contact</Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Card>
                            <CardContent className="p-4 space-y-2">
                                <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                                    <Share2 className="w-4 h-4 mr-2" /> Share Profile
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-red-600 hover:bg-red-50">
                                    <Flag className="w-4 h-4 mr-2" /> Report Profile
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
