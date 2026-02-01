"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    User,
    Briefcase,
    GraduationCap,
    Award,
    MapPin,
    Link as LinkIcon,
    Plus,
    Pencil,
    Trash2,
    ExternalLink,
    CheckCircle2,
    Loader2,
    Upload,
    X,
    Building2,
} from "lucide-react";
import { NIGERIAN_STATES } from "@/constants";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import {
    updateUserProfile,
    uploadProfilePhoto,
    addWorkExperience,
    deleteWorkExperience,
    addEducation,
    deleteEducation
} from "@/lib/actions/user.actions";
import { useRef, ChangeEvent, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface ProfileFormProps {
    user: any; // Type efficiently later
}

// Mock Data for fallback
const mockProfile = {
    firstName: "",
    lastName: "",
    headline: "",
    email: "",
    phone: "",
    linkedin: "",
    state: "",
    city: "",
    summary: "",
    experiences: [],
    education: [],
    skills: [],
};

export function ProfileForm({ user }: ProfileFormProps) {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("basic");

    // Initialize with real user data or fallbacks
    const [formData, setFormData] = useState({
        ...mockProfile,
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        linkedin: user?.linkedinUrl || "",
        headline: user?.headline || "",
        summary: user?.summary || "",
        // Parse location to state/city if possible, or just use location field
        city: user?.location?.split(',')[0]?.trim() || "",
        state: user?.location?.split(',')[1]?.trim() || "",

        experiences: user?.workExperience || [],
        education: user?.education || [],
        skills: user?.skills || [],
    });

    // Update state when user data changes (e.g. after server action revalidation)
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phone: user.phone || "",
                linkedin: user.linkedinUrl || "",
                headline: user.headline || "",
                summary: user.summary || "",
                city: user.location?.split(',')[0]?.trim() || "",
                state: user.location?.split(',')[1]?.trim() || "",
                experiences: user.workExperience || [],
                education: user.education || [],
                skills: user.skills || [],
            }));
            setProfilePhoto(user.profilePhotoUrl || "");
        }
    }, [user]);

    const [newSkill, setNewSkill] = useState("");
    const [profilePhoto, setProfilePhoto] = useState(user?.profilePhotoUrl || "");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // New State for Dialog Forms
    const [openExpDialog, setOpenExpDialog] = useState(false);
    const [expForm, setExpForm] = useState({
        company: "",
        role: "",
        location: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
        description: "",
    });

    const [openEduDialog, setOpenEduDialog] = useState(false);
    const [eduForm, setEduForm] = useState({
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startYear: new Date().getFullYear(),
        endYear: new Date().getFullYear() + 4,
    });

    const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast({
                title: "Error",
                description: "File size must be less than 2MB",
                variant: "destructive",
            });
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const result = await uploadProfilePhoto(formData);
            console.log("Upload result:", result);
            if (result.error) {
                toast({
                    title: "Upload Error",
                    description: result.error as string,
                    variant: "destructive",
                });
            } else if (result.url) {
                setProfilePhoto(result.url as string);
                toast({
                    title: "Success",
                    description: "Profile photo updated successfully",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong uploading the photo",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };
    const handleAddExperience = async () => {
        setIsSaving(true);
        try {
            const result = await addWorkExperience(expForm);
            if (result.error) {
                toast({ title: "Error", description: result.error, variant: "destructive" });
            } else {
                toast({ title: "Success", description: "Experience added successfully" });
                setOpenExpDialog(false);
                setExpForm({
                    company: "", role: "", location: "", startDate: "", endDate: "", isCurrent: false, description: ""
                });
                // In a real app, we might want to refresh the user data here or accept the new item from the server action
                // For now, let's just assume simple success, but revalidatePath in action handles the server state.
                // To update UI instantly without refresh, we could append to formData.But revalidatePath should trigger a server update.
                // Actually, passing the new item back from action is better.
                // For MVP, if we don't refresh, the list won't update. 
                // Let's rely on Revalidation.
                // Wait... Next.js server actions revalidatePath refreshes the route.
                // So the `user` prop passed to this component will be stale unless the parent server component refetches.
                // But the parent is a Server Component, so revalidatePath should cause a re-render of the parent and thus this client component with new props.
                // UNKNOWN: Does revalidatePath refresh the current page's props? Yes it should.
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to add experience", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteExperience = async (id: string) => {
        if (!confirm("Are you sure you want to delete this experience?")) return;
        try {
            const result = await deleteWorkExperience(id);
            if (result.error) {
                toast({ title: "Error", description: result.error, variant: "destructive" });
            } else {
                toast({ title: "Success", description: "Experience deleted" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
        }
    };

    const handleAddEducation = async () => {
        setIsSaving(true);
        try {
            const result = await addEducation(eduForm);
            if (result.error) {
                toast({ title: "Error", description: result.error, variant: "destructive" });
            } else {
                toast({ title: "Success", description: "Education added successfully" });
                setOpenEduDialog(false);
                setEduForm({
                    institution: "", degree: "", fieldOfStudy: "", startYear: new Date().getFullYear(), endYear: new Date().getFullYear() + 4
                });
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to add education", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteEducation = async (id: string) => {
        if (!confirm("Are you sure you want to delete this education?")) return;
        try {
            const result = await deleteEducation(id);
            if (result.error) {
                toast({ title: "Error", description: result.error, variant: "destructive" });
            } else {
                toast({ title: "Success", description: "Education deleted" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Map form data to update schema
            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phone,
                linkedInUrl: formData.linkedin,
                headline: formData.headline,
                summary: formData.summary,
                city: formData.city,
                state: formData.state,
                skills: formData.skills,
            };

            const result = await updateUserProfile(payload);

            if (result.error) {
                toast({
                    title: "Error",
                    description: result.error,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Profile updated",
                    description: "Your changes have been saved successfully.",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const addSkill = () => {
        // Optimistic UI only for now - need DB implementation for skills
        if (newSkill && !formData.skills.includes(newSkill as never) && formData.skills.length < 20) {
            setFormData({ ...formData, skills: [...formData.skills, newSkill] as any });
            setNewSkill("");
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter((skill: any) => skill !== skillToRemove),
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Profile</h1>
                    <p className="text-slate-600 mt-2">Manage your professional information</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href={`/p/${user?.id}`} target="_blank">
                        <Button variant="outline" className="gap-2">
                            <ExternalLink className="w-4 h-4" />
                            Preview Public Profile
                        </Button>
                    </Link>
                    <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                        {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Left Side: Profile Form (70%) */}
                <div className="lg:col-span-8 space-y-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="w-full justify-start overflow-x-auto flex-nowrap h-auto p-1 gap-1 bg-slate-100/50">
                            <TabsTrigger value="basic" className="flex-1 min-w-[100px]">Basic Info</TabsTrigger>
                            <TabsTrigger value="experience" className="flex-1 min-w-[100px]">Experience</TabsTrigger>
                            <TabsTrigger value="education" className="flex-1 min-w-[100px]">Education</TabsTrigger>
                            <TabsTrigger value="skills" className="flex-1 min-w-[100px]">Skills</TabsTrigger>
                        </TabsList>

                        {/* Tab 1: Basic Information */}
                        <TabsContent value="basic" className="space-y-6 mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profile Photo</CardTitle>
                                    <CardDescription>Upload a professional photo to build trust</CardDescription>
                                </CardHeader>
                                <CardContent className="flex items-center gap-6">
                                    <Avatar className="w-24 h-24 border-4 border-white shadow-sm">
                                        <AvatarImage src={profilePhoto || "/placeholder-avatar.jpg"} />
                                        <AvatarFallback className="text-2xl bg-blue-100 text-blue-700">
                                            {formData.firstName?.[0]}{formData.lastName?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-2">
                                        <div className="flex gap-3">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handlePhotoUpload}
                                            />
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-2"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={isUploading}
                                            >
                                                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                                {isUploading ? "Uploading..." : "Upload Photo"}
                                            </Button>
                                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                Remove
                                            </Button>
                                        </div>
                                        <p className="text-xs text-slate-500">JPG or PNG, max 2MB</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Personal Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                                            <Input id="firstName" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                                            <Input id="lastName" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="headline">Headline <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="headline"
                                            value={formData.headline}
                                            onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                                            placeholder="e.g., Senior Supply Chain Manager | CSCP Certified"
                                            maxLength={120}
                                        />
                                        <p className="text-xs text-right text-slate-500">{formData.headline.length}/120</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <div className="relative">
                                                <Input id="email" value={formData.email} disabled className="bg-slate-50 pr-24" />
                                                <Badge variant="secondary" className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 gap-1">
                                                    <CheckCircle2 className="w-3 h-3" /> Verified
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
                                        <div className="relative">
                                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input
                                                id="linkedin"
                                                value={formData.linkedin}
                                                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                                className="pl-10"
                                                placeholder="https://linkedin.com/in/..."
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="state">State</Label>
                                            <Select value={formData.state} onValueChange={(val) => setFormData({ ...formData, state: val })}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select State" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {NIGERIAN_STATES.map((state) => (
                                                        <SelectItem key={state} value={state}>{state}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="city">City</Label>
                                            <Input id="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="summary">Professional Summary</Label>
                                        <Textarea
                                            id="summary"
                                            value={formData.summary}
                                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                            placeholder="Tell recruiters about your experience..."
                                            rows={6}
                                            maxLength={2000}
                                        />
                                        <p className="text-xs text-right text-slate-500">{formData.summary.length}/2000</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Tab 2: Experience */}
                        <TabsContent value="experience" className="space-y-6 mt-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Work Experience</CardTitle>
                                    <Dialog open={openExpDialog} onOpenChange={setOpenExpDialog}>
                                        <DialogTrigger asChild>
                                            <Button size="sm" className="gap-2">
                                                <Plus className="w-4 h-4" /> Add Experience
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl">
                                            <DialogHeader>
                                                <DialogTitle>Add Work Experience</DialogTitle>
                                                <DialogDescription>Add details about your professional roles.</DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="company">Company</Label>
                                                        <Input id="company" value={expForm.company} onChange={(e) => setExpForm({ ...expForm, company: e.target.value })} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="role">Role / Job Title</Label>
                                                        <Input id="role" value={expForm.role} onChange={(e) => setExpForm({ ...expForm, role: e.target.value })} />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="location">Location</Label>
                                                    <Input id="location" value={expForm.location} onChange={(e) => setExpForm({ ...expForm, location: e.target.value })} />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="startDate">Start Date</Label>
                                                        <Input type="date" id="startDate" value={expForm.startDate} onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="endDate">End Date</Label>
                                                        <Input type="date" id="endDate" value={expForm.endDate} onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })} disabled={expForm.isCurrent} />
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox id="currentRole" checked={expForm.isCurrent} onCheckedChange={(checked) => setExpForm({ ...expForm, isCurrent: checked as boolean, endDate: checked ? "" : expForm.endDate })} />
                                                    <Label htmlFor="currentRole">I still work here</Label>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="description">Description</Label>
                                                    <Textarea id="description" value={expForm.description} onChange={(e) => setExpForm({ ...expForm, description: e.target.value })} rows={4} />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button onClick={handleAddExperience} disabled={isSaving}>
                                                    {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                                    Save Experience
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {formData.experiences.length > 0 ? (
                                        formData.experiences.map((exp: any) => (
                                            <div key={exp.id} className="flex gap-4 group relative">
                                                <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center flex-shrink-0">
                                                    <Building2 className="w-6 h-6 text-slate-400" />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-semibold text-slate-900">{exp.company}</h3>
                                                            <p className="text-slate-600">{exp.role}</p>
                                                        </div>
                                                        <Button variant="ghost" size="icon" className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeleteExperience(exp.id)}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                    <p className="text-sm text-slate-500">
                                                        {new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} -
                                                        {exp.isCurrent ? ' Present' : exp.endDate ? ` ${new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}` : ''}
                                                    </p>
                                                    {exp.location && <p className="text-sm text-slate-400">{exp.location}</p>}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6 text-slate-500">No experience listed yet.</div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Tab 3: Education */}
                        <TabsContent value="education" className="space-y-6 mt-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Education</CardTitle>
                                    <Dialog open={openEduDialog} onOpenChange={setOpenEduDialog}>
                                        <DialogTrigger asChild>
                                            <Button size="sm" className="gap-2">
                                                <Plus className="w-4 h-4" /> Add Education
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-xl">
                                            <DialogHeader>
                                                <DialogTitle>Add Education</DialogTitle>
                                                <DialogDescription>Add your academic qualifications.</DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="institution">Institution</Label>
                                                    <Input id="institution" value={eduForm.institution} onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })} />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="degree">Degree</Label>
                                                        <Input id="degree" value={eduForm.degree} onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="fieldOfStudy">Field of Study</Label>
                                                        <Input id="fieldOfStudy" value={eduForm.fieldOfStudy} onChange={(e) => setEduForm({ ...eduForm, fieldOfStudy: e.target.value })} />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="startYear">Start Year</Label>
                                                        <Input type="number" id="startYear" value={eduForm.startYear} onChange={(e) => setEduForm({ ...eduForm, startYear: parseInt(e.target.value) })} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="endYear">End Year (or Expected)</Label>
                                                        <Input type="number" id="endYear" value={eduForm.endYear} onChange={(e) => setEduForm({ ...eduForm, endYear: parseInt(e.target.value) })} />
                                                    </div>
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button onClick={handleAddEducation} disabled={isSaving}>
                                                    {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                                    Save Education
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {formData.education.length > 0 ? (
                                        formData.education.map((edu: any) => (
                                            <div key={edu.id} className="flex gap-4 group relative">
                                                <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center flex-shrink-0">
                                                    <GraduationCap className="w-6 h-6 text-slate-400" />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex justify-between items-start">
                                                        <div className="space-y-1">
                                                            <h3 className="font-semibold text-slate-900">{edu.institution}</h3>
                                                            <p className="text-slate-600">{edu.degree} in {edu.fieldOfStudy}</p>
                                                        </div>
                                                        <Button variant="ghost" size="icon" className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeleteEducation(edu.id)}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                    <p className="text-sm text-slate-500">{edu.startYear} - {edu.endYear || 'Present'}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6 text-slate-500">No education listed yet.</div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Tab 4: Skills */}
                        <TabsContent value="skills" className="space-y-6 mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Skills</CardTitle>
                                    <CardDescription>Add skills to highlight your expertise</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Add a skill"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                                        />
                                        <Button onClick={addSkill}>Add</Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.skills.map((skill: string) => (
                                            <Badge key={skill} variant="secondary">
                                                {skill}
                                                <button onClick={() => removeSkill(skill)} className="ml-2 hover:text-red-500"><X className="w-3 h-3" /></button>
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right Side: Preview (30%) */}
                <div className="lg:col-span-4">
                    <div className="sticky top-24 space-y-6">
                        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Profile Preview</h3>
                        <Card className="overflow-hidden border-none shadow-lg">
                            <div className="h-24 bg-gradient-to-r from-blue-600 to-emerald-600"></div>
                            <CardContent className="relative pt-0 pb-6 text-center">
                                <Avatar className="w-24 h-24 border-4 border-white shadow-md mx-auto -mt-12 mb-4">
                                    <AvatarImage src={profilePhoto || "/placeholder-avatar.jpg"} />
                                    <AvatarFallback className="text-2xl bg-blue-100 text-blue-700">
                                        {formData.firstName?.[0]}{formData.lastName?.[0]}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="space-y-2 mb-4">
                                    <h3 className="text-xl font-bold text-slate-900">{formData.firstName} {formData.lastName}</h3>
                                    <p className="text-sm text-slate-600 line-clamp-2 px-4">{formData.headline}</p>
                                </div>

                                <div className="flex justify-center gap-2 mb-6">
                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                        <CheckCircle2 className="w-3 h-3 mr-1" /> Verified Pro
                                    </Badge>
                                </div>

                                <Separator className="mb-4" />

                                <div className="space-y-3 text-sm text-slate-600 text-left px-2">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-slate-400" />
                                        <span>{formData.city}, {formData.state}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
