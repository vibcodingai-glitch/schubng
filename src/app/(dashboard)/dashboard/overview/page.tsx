import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
    Plus,
    Award,
    CheckCircle2,
    Eye,
    Search,
    Sparkles,
    Pencil,
    MapPin,
    Building2,
    GraduationCap,
    ExternalLink,
    Users,
    BarChart3,
    ChevronRight,
    Briefcase,
    Globe,
    Languages,
    Trophy,
    Heart,
    MessageCircle,
    Repeat2,
    ThumbsUp,
    Send,
    UserPlus,
    X,
    Shield,
    Star,
    TrendingUp,
    Link as LinkIcon,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getDashboardData } from "@/lib/actions/dashboard.actions";
import { getSuggestedConnections, getUserTrustScoreBreakdown, getUserVerificationSummary } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { TrustScoreCard } from "@/components/cards/TrustScoreCard";

export default async function ProfilePage() {
    const data = await getDashboardData();
    if (!data) redirect("/login");

    const { user, stats, certifications, activity } = data;
    const suggestions = await getSuggestedConnections();
    const trustScoreBreakdown = await getUserTrustScoreBreakdown();
    const verificationSummary = await getUserVerificationSummary();

    // Profile completion checklist
    const completionItems = [
        { label: "Basic information added", completed: !!(user?.firstName && user?.lastName) },
        { label: "Profile photo uploaded", completed: !!user?.profilePhotoUrl },
        { label: "Professional summary", completed: !!user?.summary },
        { label: "Certifications added", completed: (stats?.totalCerts || 0) > 0 },
        { label: "At least one verified certification", completed: (stats?.verifiedCerts || 0) > 0 },
        { label: "Work experience added", completed: !!user?.currentRole },
    ];

    const profileCompletionPercentage = Math.round(
        (completionItems.filter((item) => item.completed).length / completionItems.length) * 100
    );

    const getTrustScoreColor = (score: number) => {
        if (score >= 80) return "text-emerald-600";
        if (score >= 50) return "text-blue-600";
        return "text-amber-600";
    };

    const getTrustScoreLabel = (score: number) => {
        if (score >= 80) return "Excellent";
        if (score >= 50) return "Good";
        return "Building";
    };

    const getTrustScoreProgress = (score: number) => {
        if (score >= 80) return "bg-emerald-500";
        if (score >= 50) return "bg-blue-500";
        return "bg-amber-500";
    };

    // Use real experience data from user
    const userExperiences = user.workExperience || [];

    // Use real education data from user
    const userEducation = user.education || [];

    return (
        <div className="grid grid-cols-12 gap-6">
            {/* Main Content - Left 8 columns */}
            <div className="col-span-12 lg:col-span-8 space-y-4">
                {/* Profile Card - LinkedIn Style */}
                <Card className="overflow-hidden border-none shadow-sm">
                    {/* Cover Photo */}
                    <div className="h-[120px] bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-3 right-3 bg-white/90 hover:bg-white h-8 w-8 rounded-full"
                        >
                            <Pencil className="w-4 h-4 text-gray-700" />
                        </Button>
                    </div>

                    <CardContent className="relative pt-0 pb-6">
                        {/* Avatar - Overlapping */}
                        <div className="absolute -top-16 left-6">
                            <Avatar className="h-[140px] w-[140px] border-4 border-white shadow-md">
                                <AvatarImage src={user.profilePhotoUrl || ""} />
                                <AvatarFallback className="text-4xl bg-blue-100 text-blue-600">
                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        {/* Edit Button */}
                        <div className="flex justify-end pt-4">
                            <Link href="/dashboard/profile">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Pencil className="w-4 h-4 text-gray-600" />
                                </Button>
                            </Link>
                        </div>

                        {/* Name & Info */}
                        <div className="mt-8">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            {user.firstName} {user.lastName}
                                        </h1>
                                        {stats.verifiedCerts > 0 && (
                                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                        )}
                                    </div>
                                    <p className="text-gray-700 mt-1 text-sm leading-relaxed max-w-xl">
                                        {user.headline || user.currentRole || "Add a headline to describe what you do"}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mt-2">
                                        {user.location && <span>{user.location}</span>}
                                        <span>·</span>
                                        <Link href="/dashboard/profile" className="text-blue-600 hover:underline font-semibold">
                                            Contact info
                                        </Link>
                                    </div>
                                    <Link href="/dashboard/network" className="text-sm text-blue-600 hover:underline font-semibold mt-1 inline-block">
                                        {user._count?.following || 0} connections
                                    </Link>
                                </div>

                                {/* Company/Education Badges */}
                                <div className="flex flex-col gap-2 text-sm">
                                    {user.currentCompany && (
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                                <Building2 className="w-4 h-4 text-gray-500" />
                                            </div>
                                            <span>{user.currentCompany}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons - LinkedIn Style */}
                            <div className="flex flex-wrap items-center gap-2 mt-4">
                                <Button className="rounded-full bg-blue-600 hover:bg-blue-700 text-sm h-8 px-4">
                                    Open to
                                </Button>
                                <Button variant="outline" className="rounded-full text-sm h-8 px-4 border-gray-400 text-gray-700 hover:bg-gray-50 hover:border-gray-900">
                                    Add profile section
                                </Button>
                                <Link href="/dashboard/profile">
                                    <Button variant="outline" className="rounded-full text-sm h-8 px-4 border-gray-400 text-gray-700 hover:bg-gray-50 hover:border-gray-900">
                                        Enhance profile
                                    </Button>
                                </Link>
                                <Button variant="ghost" className="rounded-full text-sm h-8 px-4 text-gray-700">
                                    Resources
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Open to Work / Volunteer Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-none shadow-sm bg-[#dde7f1] hover:bg-[#d0e0ed] transition-colors cursor-pointer">
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#004182]" />
                                        <h3 className="font-semibold text-sm text-[#004182]">Open to work</h3>
                                    </div>
                                    <p className="text-xs text-gray-700 mt-1 line-clamp-2">
                                        {user.currentRole || "Project Manager"}, Supply Chain, Operations roles
                                    </p>
                                    <button className="text-xs text-blue-600 hover:underline font-semibold mt-1">
                                        Show details
                                    </button>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-1">
                                    <Pencil className="w-3.5 h-3.5 text-gray-600" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-[#dde7f1] hover:bg-[#d0e0ed] transition-colors cursor-pointer">
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#004182]" />
                                        <h3 className="font-semibold text-sm text-[#004182]">Open to volunteer</h3>
                                    </div>
                                    <p className="text-xs text-gray-700 mt-1">Science and Technology</p>
                                    <button className="text-xs text-blue-600 hover:underline font-semibold mt-1">
                                        Show details
                                    </button>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-1">
                                    <Pencil className="w-3.5 h-3.5 text-gray-600" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Analytics Section */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base">Analytics</CardTitle>
                                <CardDescription className="flex items-center gap-1 text-xs">
                                    <Eye className="w-3 h-3" /> Private to you
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex items-start gap-3">
                                <Users className="w-5 h-5 text-gray-500 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-gray-900">{stats.profileViews || 0} profile views</p>
                                    <p className="text-xs text-gray-500">Discover who&apos;s viewed your profile.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <BarChart3 className="w-5 h-5 text-gray-500 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-gray-900">{stats.totalImpressions} post impressions</p>
                                    <p className="text-xs text-gray-500">Check out who&apos;s engaging with your posts.</p>
                                    <p className="text-xs text-gray-400">Past 7 days</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Search className="w-5 h-5 text-gray-500 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-gray-900">{stats?.searchAppearances || 0} search appearances</p>
                                    <p className="text-xs text-gray-500">See how often you appear in search results.</p>
                                </div>
                            </div>
                        </div>
                        <Link
                            href="#"
                            className="flex items-center justify-center gap-1 mt-4 pt-3 border-t text-sm text-gray-600 hover:bg-gray-50 -mx-6 px-6 font-medium"
                        >
                            Show all analytics <ChevronRight className="w-4 h-4" />
                        </Link>
                    </CardContent>
                </Card>

                {/* About Section */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-base">About</CardTitle>
                        <Link href="/dashboard/profile">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Pencil className="w-4 h-4" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            {user.summary || (
                                <>
                                    Dynamic Supply Chain Leader driving AI-powered digital transformation, sustainability, and operational excellence
                                    across 28+ countries in Central and West Africa. I lead cross-functional initiatives that integrate automation, data
                                    intelligence, and sustainable logistics to unlock cost efficiency, enhance safety, and strengthen environmental
                                    performance.
                                    <button className="text-blue-600 hover:underline ml-1 font-semibold">...see more</button>
                                </>
                            )}
                        </p>
                    </CardContent>
                </Card>

                {/* Activity Section */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base">Activity</CardTitle>
                                <p className="text-xs text-blue-600 font-semibold">{user._count?.followers || 0} followers</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="rounded-full text-blue-600 border-blue-600 hover:bg-blue-50">
                                    Create a post
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Pencil className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2 mb-4">
                            <Button variant="default" size="sm" className="rounded-full text-xs bg-green-700 hover:bg-green-800">
                                Posts
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-full text-xs">
                                Comments
                            </Button>
                        </div>

                        {activity.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {activity.slice(0, 4).map((item: any, i: number) => (
                                    <div key={i} className="border rounded-lg p-3">
                                        <p className="text-xs text-gray-600 line-clamp-3">{item.description || "Recent activity"}</p>
                                        <p className="text-xs text-gray-400 mt-2">{formatDate(item.createdAt || new Date())}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p className="text-sm">No activity yet</p>
                                <p className="text-xs">Start posting to see your activity here</p>
                            </div>
                        )}

                        <Link
                            href="#"
                            className="flex items-center justify-center gap-1 mt-4 pt-3 border-t text-sm text-gray-600 hover:bg-gray-50 -mx-6 px-6 font-medium"
                        >
                            Show all posts <ChevronRight className="w-4 h-4" />
                        </Link>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-base">Experience</CardTitle>
                            {trustScoreBreakdown?.experienceVerified ? (
                                <Badge className="text-[10px] bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                                    <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                                </Badge>
                            ) : userExperiences.length > 0 && (
                                <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-300">
                                    Pending Verification
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            <Link href="/dashboard/profile">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </Link>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Pencil className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {userExperiences.length > 0 ? (
                            <>
                                {userExperiences.slice(0, 3).map((exp) => (
                                    <div key={exp.id} className="flex gap-3">
                                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center shrink-0 relative">
                                            <Briefcase className="w-6 h-6 text-gray-400" />
                                            {exp.status === "VERIFIED" && (
                                                <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5">
                                                    <CheckCircle2 className="w-3 h-3 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-sm text-gray-900">{exp.role}</h4>
                                                {exp.status === "VERIFIED" && (
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-700">{exp.company} · {exp.isCurrent ? "Full-time" : "Past"}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(exp.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })} - {exp.isCurrent ? "Present" : exp.endDate ? new Date(exp.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : ""}
                                            </p>
                                            {exp.location && <p className="text-xs text-gray-500">{exp.location}</p>}
                                            {exp.description && (
                                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{exp.description}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {userExperiences.length > 3 && (
                                    <Link
                                        href="/dashboard/profile"
                                        className="flex items-center justify-center gap-1 pt-3 border-t text-sm text-gray-600 hover:bg-gray-50 -mx-6 px-6 font-medium"
                                    >
                                        Show all {userExperiences.length} experiences <ChevronRight className="w-4 h-4" />
                                    </Link>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-6 text-gray-500">
                                <Briefcase className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p className="text-sm">No experience added yet</p>
                                <Link href="/dashboard/profile">
                                    <Button variant="outline" size="sm" className="mt-2 rounded-full">
                                        Add experience
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Education Section */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-base">Education</CardTitle>
                            {trustScoreBreakdown?.educationVerified ? (
                                <Badge className="text-[10px] bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                                    <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                                </Badge>
                            ) : userEducation.length > 0 && (
                                <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-300">
                                    Pending Verification
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            <Link href="/dashboard/profile">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </Link>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Pencil className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {userEducation.length > 0 ? (
                            <>
                                {userEducation.map((edu) => (
                                    <div key={edu.id} className="flex gap-3">
                                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center shrink-0 relative">
                                            <GraduationCap className="w-6 h-6 text-gray-400" />
                                            {edu.status === "VERIFIED" && (
                                                <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5">
                                                    <CheckCircle2 className="w-3 h-3 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-sm text-gray-900">{edu.institution}</h4>
                                                {edu.status === "VERIFIED" && (
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-700">{edu.degree} - {edu.fieldOfStudy}</p>
                                            <p className="text-xs text-gray-500">
                                                {edu.startYear} - {edu.endYear || "Present"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className="text-center py-6 text-gray-500">
                                <GraduationCap className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p className="text-sm">No education added yet</p>
                                <Link href="/dashboard/profile">
                                    <Button variant="outline" size="sm" className="mt-2 rounded-full">
                                        Add education
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Licenses & Certifications Section */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-base">Licenses & certifications</CardTitle>
                        <div className="flex items-center gap-1">
                            <Link href="/dashboard/certifications/add">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </Link>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Pencil className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {certifications.length > 0 ? (
                            <>
                                {certifications.slice(0, 3).map((cert: any) => (
                                    <div key={cert.id} className="flex gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center shrink-0">
                                            <Award className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-sm text-gray-900">{cert.name}</h4>
                                            <p className="text-sm text-gray-700">{cert.issuer}</p>
                                            <p className="text-xs text-gray-500">
                                                Issued {formatDate(cert.issueDate)}
                                                {cert.expiryDate && ` · Expires ${formatDate(cert.expiryDate)}`}
                                            </p>
                                            {cert.status === "VERIFIED" && (
                                                <Badge className="mt-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs gap-1">
                                                    <CheckCircle2 className="w-3 h-3" /> Verified
                                                </Badge>
                                            )}
                                            {cert.credentialUrl && (
                                                <Link href={cert.credentialUrl} target="_blank" className="block mt-2">
                                                    <Button variant="outline" size="sm" className="rounded-full text-xs gap-1">
                                                        <ExternalLink className="w-3 h-3" /> Show credential
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <Link
                                    href="/dashboard/certifications"
                                    className="flex items-center justify-center gap-1 pt-3 border-t text-sm text-gray-600 hover:bg-gray-50 -mx-6 px-6 font-medium"
                                >
                                    Show all {stats.totalCerts} licenses & certifications <ChevronRight className="w-4 h-4" />
                                </Link>
                            </>
                        ) : (
                            <div className="text-center py-6">
                                <Award className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p className="text-sm text-gray-500">No certifications added yet</p>
                                <Link href="/dashboard/certifications/add">
                                    <Button variant="outline" size="sm" className="mt-2 rounded-full">
                                        Add certification
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Skills Section */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-base">Skills</CardTitle>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Plus className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Pencil className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div>
                                <h4 className="font-semibold text-sm text-gray-900">Supply Chain Management</h4>
                                <p className="text-xs text-gray-500">Operations at {user.currentCompany || "Company"}</p>
                                <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                    <Users className="w-3 h-3" /> 4 endorsements
                                </p>
                            </div>
                            <Separator />
                            <div>
                                <h4 className="font-semibold text-sm text-gray-900">Data Analytics</h4>
                                <p className="text-xs text-gray-500">Analytics & Reporting</p>
                                <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                    <Users className="w-3 h-3" /> 3 endorsements
                                </p>
                            </div>
                        </div>
                        <Link
                            href="#"
                            className="flex items-center justify-center gap-1 pt-3 border-t text-sm text-gray-600 hover:bg-gray-50 -mx-6 px-6 font-medium"
                        >
                            Show all 28 skills <ChevronRight className="w-4 h-4" />
                        </Link>
                    </CardContent>
                </Card>

                {/* Recommendations Section */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-base">Recommendations</CardTitle>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Plus className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Pencil className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2 mb-4">
                            <Button variant="default" size="sm" className="rounded-full text-xs">
                                Received
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-full text-xs">
                                Given
                            </Button>
                        </div>
                        <div className="text-center py-6 text-gray-500">
                            <Heart className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">No recommendations yet</p>
                            <p className="text-xs">Ask colleagues for recommendations to build credibility</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Languages Section */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-base">Languages</CardTitle>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Plus className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Pencil className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <h4 className="font-semibold text-sm text-gray-900">English</h4>
                            <p className="text-xs text-gray-500">Full professional proficiency</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Interests Section */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Interests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2 mb-4 overflow-x-auto">
                            <Button variant="default" size="sm" className="rounded-full text-xs bg-green-700 hover:bg-green-800 whitespace-nowrap">
                                Top Voices
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-full text-xs whitespace-nowrap">
                                Companies
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-full text-xs whitespace-nowrap">
                                Groups
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-full text-xs whitespace-nowrap">
                                Newsletters
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-full text-xs whitespace-nowrap">
                                Schools
                            </Button>
                        </div>
                        <div className="text-center py-4 text-gray-500">
                            <p className="text-sm">Follow topics and thought leaders to grow your network</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Sidebar - 4 columns */}
            <div className="col-span-12 lg:col-span-4 space-y-4">
                {/* Profile Language & URL */}
                <Card className="border-none shadow-sm">
                    <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-700">Profile language</p>
                                <p className="text-xs text-gray-500">English</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Pencil className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-700">Public profile & URL</p>
                                <p className="text-xs text-gray-500 truncate max-w-[180px]">supplychainhub.com/p/{user.id?.slice(0, 8)}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Pencil className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Trust Score Card - ChainCred Unique Feature */}
                <TrustScoreCard trustScoreBreakdown={trustScoreBreakdown} />

                {/* Premium Ad */}
                <Card className="border-none shadow-sm overflow-hidden">
                    <CardContent className="p-4 text-center">
                        <div className="flex items-center gap-3 mb-3">
                            <Avatar className="h-12 w-12 border">
                                <AvatarImage src={user.profilePhotoUrl || ""} />
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                    {user.firstName?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            <Badge className="bg-amber-100 text-amber-700">
                                <Sparkles className="w-3 h-3 mr-1" /> Premium
                            </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">
                            Get hired faster with exclusive tools and features
                        </p>
                        <Link href="/dashboard/billing">
                            <Button variant="outline" className="rounded-full border-amber-500 text-amber-600 hover:bg-amber-50 w-full">
                                Redeem offer
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Who viewed your profile also viewed */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Who your viewers also viewed</CardTitle>
                        <CardDescription className="flex items-center gap-1 text-xs">
                            <Eye className="w-3 h-3" /> Private to you
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {suggestions?.slice(0, 3).map((person: any) => (
                            <div key={person.id} className="flex items-start gap-3">
                                <Link href={`/p/${person.id}`}>
                                    <Avatar className="h-12 w-12 border">
                                        <AvatarImage src={person.profilePhotoUrl} />
                                        <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                                            {person.firstName?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div className="flex-1 min-w-0">
                                    <Link href={`/p/${person.id}`} className="hover:underline">
                                        <p className="font-semibold text-sm text-gray-900 truncate">
                                            {person.firstName} {person.lastName}
                                        </p>
                                    </Link>
                                    <p className="text-xs text-gray-500 line-clamp-2">
                                        {person.headline || person.currentRole || "Professional"}
                                    </p>
                                    <Button variant="outline" size="sm" className="mt-2 rounded-full text-xs h-7">
                                        View
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* People you may know */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">People you may know</CardTitle>
                        <CardDescription className="text-xs">From your industry</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {suggestions?.slice(3, 8).map((person: any) => (
                            <div key={person.id} className="flex items-start gap-3">
                                <Link href={`/p/${person.id}`}>
                                    <Avatar className="h-12 w-12 border">
                                        <AvatarImage src={person.profilePhotoUrl} />
                                        <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                                            {person.firstName?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div className="flex-1 min-w-0">
                                    <Link href={`/p/${person.id}`} className="hover:underline">
                                        <p className="font-semibold text-sm text-gray-900 truncate flex items-center gap-1">
                                            {person.firstName} {person.lastName}
                                            {person.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                                        </p>
                                    </Link>
                                    <p className="text-xs text-gray-500 line-clamp-2">
                                        {person.headline || person.currentRole || "Professional"}
                                    </p>
                                    <Button variant="outline" size="sm" className="mt-2 rounded-full text-xs h-7 gap-1">
                                        <UserPlus className="w-3.5 h-3.5" /> Connect
                                    </Button>
                                </div>
                            </div>
                        ))}
                        <Link
                            href="/dashboard/network/discover"
                            className="flex items-center justify-center gap-1 text-sm text-gray-600 hover:text-blue-600 font-medium pt-2"
                        >
                            Show all
                        </Link>
                    </CardContent>
                </Card>

                {/* See who's hiring */}
                <Card className="border-none shadow-sm overflow-hidden">
                    <div className="h-32 bg-gradient-to-br from-teal-600 to-emerald-700 flex items-center justify-center">
                        <div className="text-center text-white">
                            <p className="font-semibold">See who&apos;s hiring</p>
                            <p className="text-xs opacity-90">on SupplyChain Hub</p>
                        </div>
                    </div>
                </Card>

                {/* Footer Links */}
                <div className="text-[11px] text-gray-500 space-y-1 px-2">
                    <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                        <Link href="#" className="hover:text-blue-600 hover:underline">About</Link>
                        <Link href="#" className="hover:text-blue-600 hover:underline">Accessibility</Link>
                        <Link href="#" className="hover:text-blue-600 hover:underline">Help Center</Link>
                    </div>
                    <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                        <Link href="#" className="hover:text-blue-600 hover:underline">Privacy & Terms</Link>
                        <Link href="#" className="hover:text-blue-600 hover:underline">Ad Choices</Link>
                    </div>
                    <p className="pt-2 flex items-center gap-1">
                        <span className="w-4 h-4 bg-blue-600 rounded text-white text-[8px] flex items-center justify-center font-bold">
                            <LinkIcon className="w-2.5 h-2.5" strokeWidth={2} />
                        </span>
                        SupplyChain Hub Corporation © 2024
                    </p>
                </div>
            </div>
        </div>
    );
}
