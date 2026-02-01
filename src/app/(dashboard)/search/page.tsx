"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { searchUsers } from "@/lib/actions/user.actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search,
    MapPin,
    Briefcase,
    Users,
    ShieldCheck,
    ArrowLeft,
    Filter
} from "lucide-react";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/shared/FadeIn";

interface SearchResult {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    headline?: string;
    currentRole?: string;
    currentCompany?: string;
    location?: string;
    profilePhotoUrl?: string;
    trustScore: number;
    industry?: string;
    skills: string[];
}

function SearchPageContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("q") || "";

    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const performSearch = async (searchQuery: string) => {
        if (searchQuery.trim().length < 2) {
            setResults([]);
            return;
        }

        setIsLoading(true);
        setHasSearched(true);
        try {
            const data = await searchUsers(searchQuery);
            setResults(data);
        } catch (error) {
            console.error("Search error:", error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (initialQuery) {
            performSearch(initialQuery);
        }
    }, [initialQuery]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        performSearch(query);
        // Update URL without reload
        window.history.pushState({}, "", `/search?q=${encodeURIComponent(query)}`);
    };

    const getTrustBadgeColor = (score: number) => {
        if (score >= 80) return "bg-emerald-100 text-emerald-700 border-emerald-200";
        if (score >= 50) return "bg-amber-100 text-amber-700 border-amber-200";
        return "bg-slate-100 text-slate-600 border-slate-200";
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Search Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-slate-500 hover:text-slate-900 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>

                        <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    type="search"
                                    placeholder="Search professionals by name, role, company, or skills..."
                                    className="pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <Button type="submit" className="h-11 px-6 bg-blue-600 hover:bg-blue-700">
                                Search
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Results Header */}
                {hasSearched && !isLoading && (
                    <div className="mb-6">
                        <h1 className="text-xl font-semibold text-slate-900">
                            {results.length > 0
                                ? `${results.length} result${results.length !== 1 ? 's' : ''} for "${initialQuery || query}"`
                                : `No results for "${initialQuery || query}"`
                            }
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Search across professionals, companies, and skills
                        </p>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="animate-pulse">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 bg-slate-200 rounded-full"></div>
                                        <div className="flex-1 space-y-3">
                                            <div className="h-5 bg-slate-200 rounded w-1/3"></div>
                                            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                                            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && hasSearched && results.length === 0 && (
                    <FadeIn>
                        <Card className="border-dashed">
                            <CardContent className="py-16 text-center">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">No professionals found</h3>
                                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                                    Try adjusting your search terms or browse our network to discover professionals.
                                </p>
                                <Link href="/dashboard/network">
                                    <Button variant="outline">
                                        Browse Network
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </FadeIn>
                )}

                {/* Initial State */}
                {!isLoading && !hasSearched && (
                    <FadeIn>
                        <Card className="border-dashed">
                            <CardContent className="py-16 text-center">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-blue-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">Search for professionals</h3>
                                <p className="text-slate-500 max-w-md mx-auto">
                                    Enter a name, job title, company, or skill to find supply chain professionals.
                                </p>
                            </CardContent>
                        </Card>
                    </FadeIn>
                )}

                {/* Results List */}
                {!isLoading && results.length > 0 && (
                    <FadeInStagger className="space-y-4">
                        {results.map((user) => (
                            <FadeInItem key={user.id}>
                                <Link href={`/p/${user.id}`}>
                                    <Card className="hover:shadow-md transition-all hover:border-blue-200 cursor-pointer group">
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-4">
                                                {/* Avatar */}
                                                <Avatar className="w-16 h-16 border-2 border-white shadow-md group-hover:shadow-lg transition-shadow">
                                                    <AvatarImage src={user.profilePhotoUrl} />
                                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg font-semibold">
                                                        {user.firstName?.[0]}{user.lastName?.[0]}
                                                    </AvatarFallback>
                                                </Avatar>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                                {user.firstName} {user.lastName}
                                                            </h3>
                                                            <p className="text-slate-600 mt-0.5">
                                                                {user.headline || user.currentRole || "Supply Chain Professional"}
                                                            </p>
                                                        </div>

                                                        {/* Trust Score */}
                                                        <Badge
                                                            variant="outline"
                                                            className={`shrink-0 ${getTrustBadgeColor(user.trustScore)}`}
                                                        >
                                                            <ShieldCheck className="w-3 h-3 mr-1" />
                                                            {user.trustScore}%
                                                        </Badge>
                                                    </div>

                                                    {/* Meta */}
                                                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
                                                        {user.currentCompany && (
                                                            <span className="flex items-center gap-1">
                                                                <Briefcase className="w-4 h-4" />
                                                                {user.currentCompany}
                                                            </span>
                                                        )}
                                                        {user.location && (
                                                            <span className="flex items-center gap-1">
                                                                <MapPin className="w-4 h-4" />
                                                                {user.location}
                                                            </span>
                                                        )}
                                                        {user.industry && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                {user.industry}
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    {/* Skills */}
                                                    {user.skills && user.skills.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mt-3">
                                                            {user.skills.slice(0, 4).map((skill, i) => (
                                                                <Badge
                                                                    key={i}
                                                                    variant="outline"
                                                                    className="text-xs bg-slate-50 text-slate-600"
                                                                >
                                                                    {skill}
                                                                </Badge>
                                                            ))}
                                                            {user.skills.length > 4 && (
                                                                <span className="text-xs text-slate-400">
                                                                    +{user.skills.length - 4} more
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </FadeInItem>
                        ))}
                    </FadeInStagger>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        }>
            <SearchPageContent />
        </Suspense>
    );
}
