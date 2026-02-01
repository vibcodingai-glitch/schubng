"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter, Award, CheckCircle2, Clock } from "lucide-react";
import { CertificationCard } from "@/components/cards/CertificationCard";
import { ROUTES } from "@/constants";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/shared/FadeIn";

interface CertificationsListProps {
    certifications: any[];
}

export function CertificationsList({ certifications }: CertificationsListProps) {
    const [filter, setFilter] = useState("all");
    const [sort, setSort] = useState("newest");
    const [search, setSearch] = useState("");

    const filteredCerts = certifications
        .filter((cert) => {
            if (filter !== "all" && cert.status !== filter.toUpperCase()) return false;
            if (search && !cert.name.toLowerCase().includes(search.toLowerCase())) return false;
            return true;
        })
        .sort((a, b) => {
            if (sort === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            if (sort === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            if (sort === "az") return a.name.localeCompare(b.name);
            return 0;
        });

    const stats = {
        total: certifications.length,
        verified: certifications.filter((c) => c.status === "VERIFIED").length,
        pending: certifications.filter((c) => c.status === "PENDING").length,
        unverified: certifications.filter((c) => c.status === "UNVERIFIED" || c.status === "REJECTED").length,
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">My Certifications</h1>
                    <p className="text-slate-600 mt-2 text-lg">Manage and verify your professional credentials</p>
                </div>
                <Link href={ROUTES.newCertification}>
                    <Button className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:scale-105">
                        <Plus className="w-4 h-4" /> Add Certification
                    </Button>
                </Link>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-card rounded-xl p-5 flex flex-col items-center justify-center text-center backdrop-blur-md bg-white/60">
                    <span className="text-4xl font-extrabold text-slate-800">{stats.total}</span>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-2">Total Certs</span>
                </div>
                <div className="glass-card rounded-xl p-5 flex flex-col items-center justify-center text-center bg-emerald-50/50 border-emerald-100">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-4xl font-extrabold text-emerald-600">{stats.verified}</span>
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 uppercase tracking-widest">Verified</span>
                </div>
                <div className="glass-card rounded-xl p-5 flex flex-col items-center justify-center text-center bg-amber-50/50 border-amber-100">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-4xl font-extrabold text-amber-500">{stats.pending}</span>
                        <Clock className="w-6 h-6 text-amber-500" />
                    </div>
                    <span className="text-xs font-semibold text-amber-700 uppercase tracking-widest">Pending</span>
                </div>
                <div className="glass-card rounded-xl p-5 flex flex-col items-center justify-center text-center bg-slate-50/50">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-4xl font-extrabold text-slate-500">{stats.unverified}</span>
                        <div className="w-4 h-4 rounded-full border-2 border-slate-400" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Unverified</span>
                </div>
            </div>

            {/* Filter/Sort Bar */}
            <div className="glass-card rounded-xl p-2 flex flex-col md:flex-row gap-2 bg-white/80">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search certifications..."
                        className="pl-10 border-transparent bg-transparent focus-visible:ring-0 focus-visible:bg-slate-50 transition-all placeholder:text-slate-400"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-2 md:pt-0 md:pl-2">
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="w-full md:w-[150px] border-transparent bg-transparent hover:bg-slate-50 focus:ring-0">
                            <Filter className="w-4 h-4 mr-2 text-slate-500" />
                            <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="verified">Verified</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="unverified">Unverified</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={sort} onValueChange={setSort}>
                        <SelectTrigger className="w-full md:w-[170px] border-transparent bg-transparent hover:bg-slate-50 focus:ring-0">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Date (Newest)</SelectItem>
                            <SelectItem value="oldest">Date (Oldest)</SelectItem>
                            <SelectItem value="az">Name A-Z</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Certifications Grid */}
            {filteredCerts.length > 0 ? (
                <FadeInStagger className="grid md:grid-cols-2 gap-6 pb-20">
                    {filteredCerts.map((cert) => (
                        <FadeInItem key={cert.id}>
                            <CertificationCard {...cert} status={cert.status.toLowerCase()} />
                        </FadeInItem>
                    ))}
                </FadeInStagger>
            ) : (
                <div className="glass-card rounded-xl border-dashed border-2 border-slate-200 bg-slate-50/30">
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                            <Award className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No certifications found</h3>
                        <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">
                            {search || filter !== "all"
                                ? "We couldn't find matches for your current filters. Try adjusting them."
                                : "Showcase your expertise. Add your professional certifications to boost your Trust Score."}
                        </p>
                        {(search || filter !== "all") ? (
                            <Button variant="outline" onClick={() => { setFilter("all"); setSearch(""); }}>
                                Clear Filters
                            </Button>
                        ) : (
                            <Link href={ROUTES.newCertification}>
                                <Button className="shadow-lg shadow-blue-500/20">Add Your First Certification</Button>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
