import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, TrendingUp } from "lucide-react";
import Link from "next/link";

export interface ProfessionalSuggestion {
    id: string;
    name: string;
    headline: string;
    state: string;
    industry: string;
    trustScore: number;
    avatar?: string | null;
    username: string;
    mutualConnections?: number;
}

interface ProfessionalSuggestionCardProps {
    professional: ProfessionalSuggestion;
}

export function ProfessionalSuggestionCard({ professional }: ProfessionalSuggestionCardProps) {
    const getTrustScoreColor = (score: number) => {
        if (score >= 80) return "text-emerald-600";
        if (score >= 50) return "text-amber-600";
        return "text-slate-600";
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-3">
                    <Link href={`/p/${professional.username}`}>
                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                            <AvatarImage src={professional.avatar || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                {professional.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                    <div className="flex-1 min-w-0">
                        <Link href={`/p/${professional.username}`} className="hover:underline">
                            <h4 className="font-semibold text-slate-900 leading-tight">{professional.name}</h4>
                        </Link>
                        <p className="text-sm text-slate-600 line-clamp-2 mt-0.5">{professional.headline}</p>
                    </div>
                </div>

                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span>{professional.state} • {professional.industry}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <TrendingUp className={`w-4 h-4 flex-shrink-0 ${getTrustScoreColor(professional.trustScore)}`} />
                        <span className={`font-medium ${getTrustScoreColor(professional.trustScore)}`}>
                            Trust Score: {professional.trustScore}
                        </span>
                        {professional.trustScore >= 80 && <span className="text-emerald-600">🟢</span>}
                        {professional.trustScore >= 50 && professional.trustScore < 80 && <span className="text-amber-600">🟡</span>}
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/p/${professional.username}`}>View Profile</Link>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" disabled>
                        Connect
                    </Button>
                </div>

                {professional.mutualConnections && professional.mutualConnections > 0 && (
                    <p className="text-xs text-slate-500 text-center">
                        {professional.mutualConnections} mutual connection{professional.mutualConnections > 1 ? "s" : ""}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
