"use client";

import { useState } from "react";
import {
    TrustScoreBadge,
    VerificationBadge,
    CertificationCard,
    UserAvatar,
    EmptyState,
    PageHeader,
    StatCard,
    LoadingState,
    FileUpload,
    ConfirmDialog
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Users,
    FileText,
    TrendingUp,
    CheckCircle,
    Files
} from "lucide-react";
import { mockUsers, mockCertifications } from "@/data/mock-data";

/**
 * Component Showcase Page
 * 
 * Demonstrates all shared components with live examples
 */

export default function ComponentShowcase() {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const sampleUser = mockUsers[0];
    const sampleCert = mockCertifications[0];

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

                {/* Page Header */}
                <PageHeader
                    title="SupplyChain Hub Component Library"
                    subtitle="Reusable components for the SupplyChain Hub platform"
                    breadcrumbs={[
                        { label: "Home", href: "/" },
                        { label: "Components" }
                    ]}
                    actions={
                        <Button>View Documentation</Button>
                    }
                />

                {/* Trust Score Badge */}
                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Trust Score Badge</h2>
                    <Card>
                        <CardContent className="p-8">
                            <div className="flex flex-wrap items-center justify-around gap-8">
                                <div className="text-center">
                                    <TrustScoreBadge score={92} size="sm" showLabel />
                                    <p className="text-sm text-slate-600 mt-2">Small</p>
                                </div>
                                <div className="text-center">
                                    <TrustScoreBadge score={75} size="md" showLabel />
                                    <p className="text-sm text-slate-600 mt-2">Medium</p>
                                </div>
                                <div className="text-center">
                                    <TrustScoreBadge score={45} size="lg" showLabel />
                                    <p className="text-sm text-slate-600 mt-2">Large</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Verification Badge */}
                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Verification Badge</h2>
                    <Card>
                        <CardContent className="p-8">
                            <div className="flex flex-wrap items-center gap-4">
                                <VerificationBadge status="verified" />
                                <VerificationBadge status="pending" />
                                <VerificationBadge status="in_review" />
                                <VerificationBadge status="failed" />
                                <VerificationBadge status="expired" />
                                <VerificationBadge status="unverified" />
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* User Avatar */}
                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">User Avatar</h2>
                    <Card>
                        <CardContent className="p-8">
                            <div className="flex flex-wrap items-center gap-8">
                                <UserAvatar user={{ name: "Emeka Okafor" }} size="xs" />
                                <UserAvatar user={{ name: "Ada Nwachukwu" }} size="sm" />
                                <UserAvatar user={{ name: "Chidi Ugwu" }} size="md" />
                                <UserAvatar user={{ name: "Fatima Abubakar" }} size="lg" showVerifiedRing />
                                <UserAvatar
                                    user={{
                                        name: "Tunde Adeyemi",
                                        avatar: "https://i.pravatar.cc/150?u=tunde"
                                    }}
                                    size="xl"
                                    showVerifiedRing
                                />
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Stat Cards */}
                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Stat Cards</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            label="Total Users"
                            value="523"
                            change={{ value: "+24 this week", type: "positive" }}
                            icon={Users}
                        />
                        <StatCard
                            label="Pending Verifications"
                            value="18"
                            change={{ value: "+5 today", type: "neutral" }}
                            icon={FileText}
                        />
                        <StatCard
                            label="Verified This Month"
                            value="142"
                            change={{ value: "+12% from last month", type: "positive" }}
                            icon={CheckCircle}
                        />
                        <StatCard
                            label="Revenue"
                            value="₦2.4M"
                            change={{ value: "-3% from last month", type: "negative" }}
                            icon={TrendingUp}
                        />
                    </div>
                </section>

                {/* Certification Card */}
                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Certification Card</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <CertificationCard
                            certification={sampleCert}
                            variant="full"
                            onVerify={() => alert("Verify clicked")}
                            onEdit={() => alert("Edit clicked")}
                            onDelete={() => alert("Delete clicked")}
                            onView={() => alert("View clicked")}
                        />
                        <div className="space-y-4">
                            <CertificationCard
                                certification={mockCertifications[2]}
                                variant="compact"
                                onVerify={() => alert("Verify clicked")}
                            />
                            <CertificationCard
                                certification={mockCertifications[3]}
                                variant="compact"
                            />
                        </div>
                    </div>
                </section>

                {/* Empty State */}
                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Empty State</h2>
                    <Card>
                        <CardContent className="p-0">
                            <EmptyState
                                icon={Files}
                                title="No certifications yet"
                                description="Get started by adding your first professional certification to build your verified profile."
                                action={{
                                    label: "Add Certification",
                                    onClick: () => alert("Add clicked")
                                }}
                            />
                        </CardContent>
                    </Card>
                </section>

                {/* Loading States */}
                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Loading States</h2>
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Inline Loading</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <LoadingState type="inline" message="Processing your request..." />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Section Loading</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <LoadingState type="section" message="Loading certification data..." />
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* File Upload */}
                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">File Upload</h2>
                    <Card>
                        <CardContent className="p-8">
                            <FileUpload
                                accept="image/*,.pdf"
                                maxSize={5 * 1024 * 1024} // 5MB
                                onUpload={(file) => {
                                    setSelectedFile(file);
                                    console.log("File uploaded:", file);
                                }}
                            />
                            {selectedFile && (
                                <p className="mt-4 text-sm text-slate-600">
                                    Selected: {selectedFile.name}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </section>

                {/* Confirm Dialog */}
                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Confirm Dialog</h2>
                    <Card>
                        <CardContent className="p-8">
                            <div className="flex gap-4">
                                <Button
                                    variant="destructive"
                                    onClick={() => setConfirmOpen(true)}
                                >
                                    Delete Item
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <ConfirmDialog
                    open={confirmOpen}
                    onOpenChange={setConfirmOpen}
                    title="Are you sure?"
                    description="This action cannot be undone. This will permanently delete the certification."
                    confirmLabel="Delete"
                    variant="danger"
                    onConfirm={() => {
                        alert("Item deleted!");
                        setConfirmOpen(false);
                    }}
                    onCancel={() => setConfirmOpen(false)}
                />
            </div>
        </div>
    );
}
