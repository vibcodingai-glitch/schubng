"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, Briefcase, Award, X, ChevronDown, TrendingUp } from "lucide-react";
import { ProfessionalSuggestionCard, type ProfessionalSuggestion } from "@/components/network/ProfessionalSuggestionCard";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { INDUSTRIES, NIGERIAN_STATES, JOB_ROLES, CERTIFICATION_TYPES } from "@/types";

// Expanded mock data
const mockProfessionals: ProfessionalSuggestion[] = [
    {
        id: "s1",
        name: "Ada Eze",
        headline: "Supply Chain Analyst at Unilever Nigeria",
        state: "Lagos",
        industry: "FMCG / Consumer Goods",
        trustScore: 75,
        avatar: null,
        username: "ada-eze",
        mutualConnections: 3
    },
    {
        id: "s2",
        name: "Ibrahim Mohammed",
        headline: "Operations Manager at Nestle Nigeria",
        state: "Ogun",
        industry: "FMCG / Consumer Goods",
        trustScore: 82,
        avatar: null,
        username: "ibrahim-mohammed"
    },
    {
        id: "s3",
        name: "Blessing Okonkwo",
        headline: "Warehouse Manager at Guinness Nigeria",
        state: "Anambra",
        industry: "FMCG / Consumer Goods",
        trustScore: 64,
        avatar: null,
        username: "blessing-okonkwo",
        mutualConnections: 1
    },
    {
        id: "s4",
        name: "Fatima Abubakar",
        headline: "Demand Planning Manager at MTN Nigeria",
        state: "FCT",
        industry: "Telecommunications",
        trustScore: 81,
        avatar: null,
        username: "fatima-abubakar"
    },
    {
        id: "s5",
        name: "Chidi Ugwu",
        headline: "Logistics Manager at Dangote Group",
        state: "Lagos",
        industry: "Manufacturing",
        trustScore: 62,
        avatar: null,
        username: "chidi-ugwu"
    },
    {
        id: "s6",
        name: "Tunde Adeyemi",
        headline: "Chief Procurement Officer at Chevron Nigeria",
        state: "Rivers",
        industry: "Oil & Gas",
        trustScore: 92,
        avatar: null,
        username: "tunde-adeyemi",
        mutualConnections: 2
    },
    {
        id: "s7",
        name: "Ngozi Eze",
        headline: "Procurement Specialist at Ecobank Nigeria",
        state: "Lagos",
        industry: "Banking & Financial Services",
        trustScore: 45,
        avatar: null,
        username: "ngozi-eze"
    },
    {
        id: "s8",
        name: "Emeka Okafor",
        headline: "Supply Chain Director at Shell Nigeria",
        state: "Rivers",
        industry: "Oil & Gas",
        trustScore: 95,
        avatar: null,
        username: "emeka-okafor"
    },
];

type FilterState = {
    query: string;
    state: string;
    industry: string;
    verifiedOnly: boolean;
    trustScoreMin: number;
    role: string;
};

export default function DiscoverPage() {
    const [filters, setFilters] = React.useState<FilterState>({
        query: "",
        state: "all",
        industry: "all",
        verifiedOnly: false,
        trustScoreMin: 0,
        role: "all"
    });
    const [showFilters, setShowFilters] = React.useState(true);
    const [sortBy, setSortBy] = React.useState("relevant");

    const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
        if (key === "query") return false;
        if (key === "state" || key === "industry" || key === "role") return value !== "all";
        if (key === "verifiedOnly") return value === true;
        if (key === "trustScoreMin") return value > 0;
        return false;
    }).length;

    const clearFilters = () => {
        setFilters({
            query: "",
            state: "all",
            industry: "all",
            verifiedOnly: false,
            trustScoreMin: 0,
            role: "all"
        });
    };

    const removeFilter = (filterKey: keyof FilterState) => {
        setFilters(prev => ({
            ...prev,
            [filterKey]: filterKey === "verifiedOnly" ? false : filterKey === "trustScoreMin" ? 0 : "all"
        }));
    };

    // Filter professionals based on current filters
    const filteredProfessionals = mockProfessionals.filter(prof => {
        if (filters.state !== "all" && prof.state !== filters.state) return false;
        if (filters.industry !== "all" && prof.industry !== filters.industry) return false;
        if (filters.verifiedOnly && prof.trustScore < 70) return false;
        if (prof.trustScore < filters.trustScoreMin) return false;
        if (filters.query && !prof.name.toLowerCase().includes(filters.query.toLowerCase()) &&
            !prof.headline.toLowerCase().includes(filters.query.toLowerCase())) return false;
        return true;
    });

    // Sort professionals
    const sortedProfessionals = [...filteredProfessionals].sort((a, b) => {
        if (sortBy === "trust_score") return b.trustScore - a.trustScore;
        if (sortBy === "recent") return 0; // Would use joinedAt in real app
        return 0; // relevant is default
    });

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-900">Discover Professionals</h1>
                    <p className="text-slate-600 mt-2">Find and connect with verified supply chain talent across Nigeria</p>
                </div>

                {/* Main Search */}
                <Card className="mb-4">
                    <CardContent className="pt-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Search by name, company, or keyword..."
                                value={filters.query}
                                onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                                className="pl-10 h-12 text-base"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Filters Section */}
                <Collapsible open={showFilters} onOpenChange={setShowFilters}>
                    <Card className="mb-4">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Filter className="w-5 h-5" />
                                    Advanced Filters
                                    {activeFilterCount > 0 && (
                                        <Badge variant="secondary" className="ml-2">
                                            {activeFilterCount} active
                                        </Badge>
                                    )}
                                </CardTitle>
                                <CollapsibleTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                                    </Button>
                                </CollapsibleTrigger>
                            </div>
                        </CardHeader>
                        <CollapsibleContent>
                            <CardContent className="space-y-4">
                                {/* Filter Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* State Filter */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4" />
                                            State
                                        </label>
                                        <Select value={filters.state} onValueChange={(value) => setFilters(prev => ({ ...prev, state: value }))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All States" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All States</SelectItem>
                                                {NIGERIAN_STATES.map(state => (
                                                    <SelectItem key={state} value={state}>{state}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Industry Filter */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                                            <Briefcase className="w-4 h-4" />
                                            Industry
                                        </label>
                                        <Select value={filters.industry} onValueChange={(value) => setFilters(prev => ({ ...prev, industry: value }))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Industries" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Industries</SelectItem>
                                                {INDUSTRIES.map(industry => (
                                                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Role Filter */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                                            <Award className="w-4 h-4" />
                                            Role/Title
                                        </label>
                                        <Select value={filters.role} onValueChange={(value) => setFilters(prev => ({ ...prev, role: value }))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Roles" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Roles</SelectItem>
                                                {JOB_ROLES.map(role => (
                                                    <SelectItem key={role} value={role}>{role}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Trust Score Filter */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                                            <TrendingUp className="w-4 h-4" />
                                            Trust Score
                                        </label>
                                        <Select value={filters.trustScoreMin.toString()} onValueChange={(value) => setFilters(prev => ({ ...prev, trustScoreMin: parseInt(value) }))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Any Score" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="0">Any Score</SelectItem>
                                                <SelectItem value="80">80+ (Highly Verified)</SelectItem>
                                                <SelectItem value="60">60+ (Verified)</SelectItem>
                                                <SelectItem value="50">50+ (Basic Verification)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Quick Toggle Filters */}
                                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
                                    <Button
                                        variant={filters.verifiedOnly ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setFilters(prev => ({ ...prev, verifiedOnly: !prev.verifiedOnly }))}
                                        className={filters.verifiedOnly ? "bg-blue-600 hover:bg-blue-700" : ""}
                                    >
                                        <Award className="w-4 h-4 mr-1.5" />
                                        Verified Only
                                    </Button>
                                </div>

                                {/* Filter Actions */}
                                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                                    <Button variant="ghost" size="sm" onClick={clearFilters} disabled={activeFilterCount === 0}>
                                        <X className="w-4 h-4 mr-1.5" />
                                        Clear All Filters
                                    </Button>
                                </div>
                            </CardContent>
                        </CollapsibleContent>
                    </Card>
                </Collapsible>

                {/* Active Filters Display */}
                {activeFilterCount > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                        {filters.state !== "all" && (
                            <Badge variant="secondary" className="pl-2 pr-1">
                                State: {filters.state}
                                <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1" onClick={() => removeFilter('state')}>
                                    <X className="w-3 h-3" />
                                </Button>
                            </Badge>
                        )}
                        {filters.industry !== "all" && (
                            <Badge variant="secondary" className="pl-2 pr-1">
                                Industry: {filters.industry}
                                <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1" onClick={() => removeFilter('industry')}>
                                    <X className="w-3 h-3" />
                                </Button>
                            </Badge>
                        )}
                        {filters.verifiedOnly && (
                            <Badge variant="secondary" className="pl-2 pr-1">
                                Verified Only
                                <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1" onClick={() => removeFilter('verifiedOnly')}>
                                    <X className="w-3 h-3" />
                                </Button>
                            </Badge>
                        )}
                        {filters.trustScoreMin > 0 && (
                            <Badge variant="secondary" className="pl-2 pr-1">
                                Trust Score: {filters.trustScoreMin}+
                                <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1" onClick={() => removeFilter('trustScoreMin')}>
                                    <X className="w-3 h-3" />
                                </Button>
                            </Badge>
                        )}
                    </div>
                )}

                {/* Results Header */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-slate-600">
                        Showing <span className="font-semibold">{sortedProfessionals.length}</span> professional{sortedProfessionals.length !== 1 ? 's' : ''}
                        {activeFilterCount > 0 && " matching your filters"}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">Sort by:</span>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="relevant">Most Relevant</SelectItem>
                                <SelectItem value="trust_score">Trust Score (High to Low)</SelectItem>
                                <SelectItem value="recent">Recently Joined</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Professionals Grid */}
                {sortedProfessionals.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                            {sortedProfessionals.map((professional) => (
                                <div key={professional.id} className="animate-fade-in">
                                    <ProfessionalSuggestionCard professional={professional} />
                                </div>
                            ))}
                        </div>

                        {/* Load More */}
                        {sortedProfessionals.length >= 8 && (
                            <div className="text-center">
                                <Button variant="outline" size="lg">
                                    Load More Professionals
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <Card className="py-12">
                        <CardContent className="text-center space-y-4">
                            <div className="text-slate-400 text-6xl">🔍</div>
                            <h3 className="text-xl font-semibold text-slate-900">No professionals found</h3>
                            <p className="text-slate-600">Try adjusting your filters or search terms</p>
                            <div className="flex flex-wrap justify-center gap-2 mt-4">
                                <Button variant="outline" size="sm" onClick={clearFilters}>
                                    Remove all filters
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => setFilters(prev => ({ ...prev, query: "" }))}>
                                    Clear search
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
