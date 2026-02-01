import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle2, Briefcase, GraduationCap, Award, TrendingUp } from "lucide-react";
import { TrustScoreBreakdown } from "@/lib/trust-score";

interface TrustScoreCardProps {
    trustScoreBreakdown: TrustScoreBreakdown | null;
}

export function TrustScoreCard({ trustScoreBreakdown }: TrustScoreCardProps) {
    const getTrustScoreColor = (score: number) => {
        if (score >= 80) return "text-emerald-600";
        if (score >= 50) return "text-blue-600";
        return "text-amber-600";
    };

    return (
        <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="pb-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    <CardTitle className="text-base">Trust Score</CardTitle>
                </div>
                <CardDescription className="text-blue-100 text-xs">
                    Your professional credibility rating
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="text-center mb-4">
                    <div className="relative inline-flex items-center justify-center">
                        <svg className="w-24 h-24 transform -rotate-90">
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="#e5e7eb"
                                strokeWidth="8"
                                fill="none"
                            />
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke={
                                    (trustScoreBreakdown?.totalScore ?? 0) >= 80 ? "#10b981" :
                                        (trustScoreBreakdown?.totalScore ?? 0) >= 50 ? "#3b82f6" : "#f59e0b"
                                }
                                strokeWidth="8"
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={`${((trustScoreBreakdown?.totalScore ?? 0) / 100) * 251.2} 251.2`}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-2xl font-bold ${getTrustScoreColor(trustScoreBreakdown?.totalScore ?? 0)}`}>
                                {trustScoreBreakdown?.totalScore ?? 0}
                            </span>
                            <span className="text-xs text-gray-500">/ 100</span>
                        </div>
                    </div>
                    <Badge className={`mt-2 ${(trustScoreBreakdown?.totalScore ?? 0) >= 80 ? "bg-emerald-100 text-emerald-700" :
                        (trustScoreBreakdown?.totalScore ?? 0) >= 50 ? "bg-blue-100 text-blue-700" :
                            "bg-amber-100 text-amber-700"
                        }`}>
                        {trustScoreBreakdown?.level ?? "Building"}
                    </Badge>
                </div>

                {/* Score Breakdown */}
                <div className="space-y-3 text-xs border-t pt-3">
                    <p className="font-semibold text-gray-700 text-sm">Score Breakdown</p>

                    {/* Experience */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700">Experience</span>
                            {trustScoreBreakdown?.experienceVerified ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                                <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Pending</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`font-semibold ${trustScoreBreakdown?.experienceVerified ? "text-emerald-600" : "text-gray-400"}`}>
                                {trustScoreBreakdown?.experienceScore ?? 0}/35
                            </span>
                        </div>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${((trustScoreBreakdown?.experienceScore ?? 0) / 35) * 100}%` }}
                        />
                    </div>

                    {/* Education */}
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700">Education</span>
                            {trustScoreBreakdown?.educationVerified ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                                <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Pending</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`font-semibold ${trustScoreBreakdown?.educationVerified ? "text-emerald-600" : "text-gray-400"}`}>
                                {trustScoreBreakdown?.educationScore ?? 0}/35
                            </span>
                        </div>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${((trustScoreBreakdown?.educationScore ?? 0) / 35) * 100}%` }}
                        />
                    </div>

                    {/* Certifications */}
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700">Certifications</span>
                            {trustScoreBreakdown?.hasNoCertifications ? (
                                <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Bonus</span>
                            ) : trustScoreBreakdown?.certificationsVerified === trustScoreBreakdown?.certificationsTotal ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                                <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                                    {trustScoreBreakdown?.certificationsVerified ?? 0}/{trustScoreBreakdown?.certificationsTotal ?? 0} Verified
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`font-semibold ${(trustScoreBreakdown?.certificationScore ?? 0) === 30 ? "text-emerald-600" :
                                (trustScoreBreakdown?.certificationScore ?? 0) > 0 ? "text-blue-600" : "text-gray-400"
                                }`}>
                                {trustScoreBreakdown?.certificationScore ?? 0}/30
                            </span>
                        </div>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${((trustScoreBreakdown?.certificationScore ?? 0) / 30) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="space-y-2 text-xs border-t pt-3 mt-3">
                    <div className="flex justify-between text-gray-500">
                        <span>Total Experience Items</span>
                        <span className="font-medium text-gray-700">{trustScoreBreakdown?.experienceVerified ? "Verified" : "Pending"}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                        <span>Total Education Items</span>
                        <span className="font-medium text-gray-700">{trustScoreBreakdown?.educationVerified ? "Verified" : "Pending"}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                        <span>Verified Certifications</span>
                        <span className="font-medium text-gray-700">{trustScoreBreakdown?.certificationsVerified ?? 0}/{trustScoreBreakdown?.certificationsTotal ?? 0}</span>
                    </div>
                </div>

                {/* Boost Button */}
                <div className="mt-4">
                    <button className="w-full bg-slate-900 text-white rounded-lg py-2 text-xs font-semibold hover:bg-slate-800 transition shadow-sm flex items-center justify-center gap-2">
                        <TrendingUp className="w-3.5 h-3.5" /> Boost Your Score
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}


