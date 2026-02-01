"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserPlus, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getNetworkData, getDashboardData } from "@/lib/actions/dashboard.actions";
import { getSuggestedConnections, toggleConnection } from "@/lib/actions/user.actions";
import { useToast } from "@/components/ui/use-toast";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/shared/FadeIn";

export default function NetworkPage() {
    const { toast } = useToast();

    // State for real data
    const [connections, setConnections] = useState<any[]>([]);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                // Fetch real network connections
                const networkConnections = await getNetworkData();
                setConnections(networkConnections || []);

                // Fetch suggestions
                const suggest = await getSuggestedConnections(12);
                setSuggestions(suggest || []);

            } catch (error) {
                console.error("Failed to load network data", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const handleConnect = async (userId: string) => {
        const result = await toggleConnection(userId);
        if (result.success) {
            toast({
                title: result.isConnected ? "Connected" : "Disconnected",
                description: result.isConnected ? "You are now following this user." : "You have unfollowed this user.",
            });
            // Update UI
            if (result.isConnected) {
                const connectedUser = suggestions.find(s => s.id === userId);
                if (connectedUser) {
                    setSuggestions(prev => prev.filter(s => s.id !== userId));
                    setConnections(prev => [...prev, connectedUser]);
                }
            }
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.error || "Action failed",
            });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-40">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-10">
            {/* Stats / Header */}
            <FadeIn className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-gradient-to-b from-white/90 to-blue-50/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

                <h1 className="text-3xl font-extrabold text-slate-900 mb-2">My Professional Network</h1>
                <p className="text-slate-600 max-w-lg mx-auto mb-8">
                    Expand your influence and connect with industry leaders.
                </p>

                <div className="flex gap-8 md:gap-16">
                    <div className="flex flex-col items-center">
                        <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600">
                            {connections.length}
                        </span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                            Connections
                        </span>
                    </div>
                </div>
            </FadeIn>

            {/* Invitations Section */}
            <FadeIn delay={0.1} className="glass-card rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-bold text-lg text-slate-900">Invitations</h2>
                    <Button variant="ghost" className="text-slate-500 hover:text-blue-600 gap-1 text-sm font-medium" disabled>
                        Manage All <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>
                <div className="p-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 rounded-full mb-4">
                        <Users className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-slate-500">No pending invitations at the moment.</p>
                </div>
            </FadeIn>

            {/* Suggestions */}
            <div>
                <div className="flex items-center justify-between mb-6 px-1">
                    <h2 className="text-xl font-bold text-slate-900">People you may know</h2>
                    <Button variant="link" className="text-blue-600">See all</Button>
                </div>

                {suggestions.length > 0 ? (
                    <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {suggestions.map((user) => (
                            <FadeInItem key={user.id} className="glass-card relative rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group bg-white">
                                <div className="h-20 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute top-10 left-1/2 -translate-x-1/2">
                                    <Link href={`/p/${user.id}`}>
                                        <Avatar className="h-20 w-20 border-[4px] border-white shadow-md cursor-pointer transition-transform group-hover:scale-105">
                                            <AvatarImage src={user.profilePhotoUrl} className="object-cover" />
                                            <AvatarFallback className="text-xl bg-slate-100 text-slate-600 font-bold">
                                                {user.firstName?.[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Link>
                                </div>
                                <div className="pt-14 pb-5 px-4 text-center flex flex-col h-full">
                                    <Link href={`/p/${user.id}`} className="hover:underline decoration-blue-500 underline-offset-2">
                                        <h3 className="font-bold text-slate-900 truncate text-lg">
                                            {user.firstName} {user.lastName}
                                        </h3>
                                    </Link>
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 min-h-[2.5em] leading-relaxed mb-4">
                                        {user.headline || "Professional"}
                                    </p>

                                    <div className="mt-auto">
                                        <Button
                                            className="w-full rounded-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold transition-colors shadow-sm"
                                            size="sm"
                                            onClick={() => handleConnect(user.id)}
                                        >
                                            <UserPlus className="w-4 h-4 mr-1.5" /> Connect
                                        </Button>
                                    </div>
                                </div>
                            </FadeInItem>
                        ))}
                    </FadeInStagger>
                ) : (
                    <FadeIn delay={0.2} className="glass-card rounded-xl p-10 text-center text-slate-500">
                        No new suggestions at the moment. Check back later!
                    </FadeIn>
                )}
            </div>
        </div>
    );
}
