"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Lock, Bell, User, Shield, LogOut, AlertTriangle, Eye, Globe, Mail, Smartphone, Download, Cookie, Laptop } from "lucide-react";
import { getDashboardData } from "@/lib/actions/dashboard.actions";

export default function SettingsPage() {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadSettings() {
            setLoading(true);
            try {
                const data = await getDashboardData();
                if (data && data.user) {
                    setUser(data.user);
                }
            } catch (error) {
                console.error("Failed to load settings data", error);
            } finally {
                setLoading(false);
            }
        }
        loadSettings();
    }, []);

    const handleSave = (section: string) => {
        setIsSaving(true);
        // Simulate save
        setTimeout(() => {
            setIsSaving(false);
            toast({
                title: "Settings saved",
                description: `${section} settings have been updated successfully.`,
            });
        }, 1000);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p>Please log in to manage settings.</p>
            </div>
        )
    }

    const profileUrl = `chaincred.com/p/${user.firstName?.toLowerCase() || 'user'}-${user.lastName?.toLowerCase() || 'id'}`;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
                <p className="text-slate-600 mt-2">
                    Manage your account preferences and security settings
                </p>
            </div>

            <Tabs defaultValue="account" className="space-y-6">
                <TabsList className="w-full justify-start overflow-x-auto flex-nowrap h-auto p-1 gap-1 bg-slate-100/50 lg:w-[600px]">
                    <TabsTrigger value="account" className="flex-1 min-w-[100px]">Account</TabsTrigger>
                    <TabsTrigger value="privacy" className="flex-1 min-w-[100px]">Privacy</TabsTrigger>
                    <TabsTrigger value="notifications" className="flex-1 min-w-[100px]">Notifications</TabsTrigger>
                    <TabsTrigger value="security" className="flex-1 min-w-[100px]">Security</TabsTrigger>
                </TabsList>

                {/* Account Tab */}
                <TabsContent value="account" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Manage your contact details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <Label>Email Address</Label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-900">{user.email || "No email set"}</span>
                                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Verified</Badge>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">Change Email</Button>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label>Phone Number</Label>
                                    <div className="text-slate-900">{user.phone || "No phone linked"}</div>
                                </div>
                                <Button variant="outline" size="sm">Change Phone</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Settings</CardTitle>
                            <CardDescription>Manage your public profile URL</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label>Profile URL</Label>
                                    <div className="text-slate-600 text-sm">
                                        chaincred.com/p/<span className="font-semibold text-slate-900">{user.firstName?.toLowerCase()}-{user.lastName?.toLowerCase()}</span>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">Edit</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-red-200">
                        <CardHeader>
                            <CardTitle className="text-red-600">Danger Zone</CardTitle>
                            <CardDescription>Irreversible actions for your account</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="font-medium text-slate-900">Deactivate Account</p>
                                    <p className="text-sm text-slate-500">Temporarily hide your profile and data</p>
                                </div>
                                <Switch />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="font-medium text-slate-900">Delete Account</p>
                                    <p className="text-sm text-slate-500">Permanently delete your account and all data</p>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">Delete Account</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle className="flex items-center gap-2 text-red-600">
                                                <AlertTriangle className="w-5 h-5" /> Delete your account?
                                            </DialogTitle>
                                            <DialogDescription>
                                                This will permanently delete your account and all associated data. This action cannot be undone.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="confirm-delete" />
                                                <label htmlFor="confirm-delete" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                    I understand this action is irreversible
                                                </label>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Type DELETE to confirm</Label>
                                                <Input placeholder="DELETE" />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline">Cancel</Button>
                                            <Button variant="destructive" disabled>Delete Account</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Privacy Tab */}
                <TabsContent value="privacy" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Visibility</CardTitle>
                            <CardDescription>Control who can see your profile</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Show my profile in public search</Label>
                                    <p className="text-sm text-slate-500">Recruiters can find you in search results</p>
                                </div>
                                <Switch defaultChecked onCheckedChange={() => handleSave("Privacy")} />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Show my profile in recruiter searches</Label>
                                    <p className="text-sm text-slate-500">Allow verified recruiters to find you</p>
                                </div>
                                <Switch defaultChecked onCheckedChange={() => handleSave("Privacy")} />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Allow profile to be indexed by Google</Label>
                                    <p className="text-sm text-slate-500">Your profile can appear in Google search results</p>
                                </div>
                                <Switch onCheckedChange={() => handleSave("Privacy")} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Keep existing privacy options... */}
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-6">
                    {/* Keep existing notifications options... */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Email Notifications</CardTitle>
                            <CardDescription>Choose what emails you want to receive</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* ... same switches ... */}
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Verification updates</Label>
                                    <p className="text-sm text-slate-500">Get notified when your verification status changes</p>
                                </div>
                                <Switch defaultChecked onCheckedChange={() => handleSave("Notifications")} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="space-y-6">
                    {/* ... keep security options ... */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Connected Accounts</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                        <Globe className="w-4 h-4 text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">Google</p>
                                        <p className="text-sm text-slate-500">Not connected</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">Connect</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
