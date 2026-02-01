"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Image as ImageIcon,
    Video,
    FileText,
    TrendingUp,
    Send,
    UserPlus,
    Users,
    Bookmark,
    Users2,
    Newspaper,
    CalendarDays,
    ChevronRight,
    Sparkles,
    ThumbsUp,
    MessageCircle,
    Repeat2,
    MoreHorizontal,
    X,
    Globe,
    Building2,
    Puzzle,
    Link as LinkIcon,
    Trash2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FeedCard, type FeedItem } from "@/components/network/FeedCard";
import { CreatePostModal } from "@/components/feed/CreatePostModal";
import { useState, useEffect } from "react";
import { getNetworkData, getDashboardData, getNetworkFeed, createPost, togglePostLike, deletePost } from "@/lib/actions/dashboard.actions";
import { getSuggestedConnections, toggleConnection } from "@/lib/actions/user.actions";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
    const { toast } = useToast();

    // State for real data
    const [userProfile, setUserProfile] = useState<any>(null);
    const [connections, setConnections] = useState<any[]>([]);
    const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Post creation state
    const [postContent, setPostContent] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const dashboardData = await getDashboardData();
                setUserProfile(dashboardData?.user);

                const networkConnections = await getNetworkData();
                setConnections(networkConnections || []);

                const posts = await getNetworkFeed();
                const suggest = await getSuggestedConnections();
                setSuggestions(suggest || []);

                const transformedFeed: FeedItem[] = posts.map((post: any) => ({
                    id: post.id,
                    type: "post",
                    user: {
                        id: post.author.id,
                        name: `${post.author.firstName} ${post.author.lastName}`,
                        headline: post.author.headline || "Professional",
                        avatar: post.author.profilePhotoUrl,
                        username: post.author.firstName?.toLowerCase()
                    },
                    data: {
                        content: post.content,
                        image: post.imageUrl
                    },
                    congratulations: post.likesCount,
                    comments: post.commentsCount,
                    createdAt: post.createdAt,
                    liked: post.isLiked
                }));

                setFeedItems(transformedFeed);

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
            setSuggestions(prev => prev.filter(s => s.id !== userId));
            const movedUser = suggestions.find(s => s.id === userId);
            if (movedUser && result.isConnected) {
                setConnections(prev => [...prev, movedUser]);
            }
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.error || "Action failed",
            });
        }
    };

    const handleDeletePost = async (postId: string) => {
        // Optimistic delete
        setFeedItems(prev => prev.filter(item => item.id !== postId));

        try {
            const result = await deletePost(postId);
            if (result.success) {
                toast({ title: "Post deleted" });
            } else {
                toast({ variant: "destructive", title: "Error", description: result.error || "Failed to delete post" });
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleLike = async (postId: string) => {
        setFeedItems(prev => prev.map(item => {
            if (item.id === postId) {
                const newLiked = !item.liked;
                return {
                    ...item,
                    liked: newLiked,
                    congratulations: newLiked ? (item.congratulations || 0) + 1 : (item.congratulations || 0) - 1
                };
            }
            return item;
        }));

        try {
            const result = await togglePostLike(postId);
            if (!result.success) {
                toast({ variant: "destructive", title: "Error", description: result.error || "Failed to like post" });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreatePost = async (content: string) => {
        if (!content.trim()) return;

        setIsPosting(true);
        try {
            const result = await createPost(content);
            if (result.success) {
                toast({
                    title: "Post created",
                    description: "Your post has been shared with your network.",
                });
                // Optimistic update or reload
                window.location.reload();
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: result.error || "Failed to create post",
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsPosting(false);
        }
    };

    const connectionCount = connections.length;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!userProfile) {
        return <div className="flex items-center justify-center py-20">Please log in to view your dashboard.</div>;
    }

    return (
        <>
            {/* Create Post Modal */}
            <CreatePostModal
                isOpen={isPostModalOpen}
                onClose={() => setIsPostModalOpen(false)}
                user={userProfile}
                onPost={handleCreatePost}
                isPosting={isPosting}
            />

            <div className="grid grid-cols-12 gap-6">

                {/* LEFT SIDEBAR */}
                <div className="hidden lg:block col-span-3 space-y-2">
                    {/* Profile Card */}
                    <Card className="overflow-hidden border-none shadow-sm">
                        <div className="h-14 bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500" />
                        <div className="px-4 -mt-8">
                            <Link href="/dashboard/overview">
                                <Avatar className="h-16 w-16 border-4 border-white">
                                    <AvatarImage src={userProfile.profilePhotoUrl || ""} />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                        {userProfile.firstName?.[0]}{userProfile.lastName?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                            </Link>
                        </div>
                        <div className="px-4 pt-2 pb-3 text-center">
                            <Link href="/dashboard/overview" className="hover:underline">
                                <h3 className="font-semibold text-gray-900 text-sm">{userProfile.firstName} {userProfile.lastName}</h3>
                            </Link>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{userProfile.headline || userProfile.currentRole}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{userProfile.location}</p>
                            {userProfile.currentCompany && (
                                <div className="flex items-center justify-center gap-1 mt-1 text-xs text-gray-500">
                                    <Building2 className="w-3 h-3" />
                                    <span>{userProfile.currentCompany}</span>
                                </div>
                            )}
                        </div>
                        <Separator />
                        <div className="p-3 space-y-1 text-xs">
                            <Link href="/dashboard/overview" className="flex justify-between hover:bg-gray-100 -mx-3 px-3 py-2 transition-colors">
                                <span className="text-gray-600">Profile viewers</span>
                                <span className="text-blue-600 font-semibold">56</span>
                            </Link>
                            <Link href="/dashboard/overview" className="flex justify-between hover:bg-gray-100 -mx-3 px-3 py-2 transition-colors">
                                <span className="text-gray-600">Post impressions</span>
                                <span className="text-blue-600 font-semibold">69</span>
                            </Link>
                        </div>
                    </Card>

                    {/* Page Card (like ONETRACQ) */}
                    <Card className="border-none shadow-sm">
                        <CardContent className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">
                                    <LinkIcon className="w-5 h-5" strokeWidth={2} />
                                </div>
                                <span className="font-semibold text-sm text-gray-900">SupplyChain Hub</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <Link href="#" className="flex justify-between hover:bg-gray-100 p-2 rounded transition-colors">
                                    <span className="text-gray-600">Activity</span>
                                    <span className="text-blue-600 font-semibold">0</span>
                                </Link>
                                <Link href="#" className="flex justify-between hover:bg-gray-100 p-2 rounded transition-colors">
                                    <span className="text-gray-600">Page visitors</span>
                                    <span className="text-blue-600 font-semibold">0</span>
                                </Link>
                            </div>
                            <Separator className="my-2" />
                            <p className="text-xs text-gray-500 mb-2">Grow your business faster</p>
                            <Link href="/dashboard/billing" className="flex items-center gap-1 text-xs text-gray-700 hover:text-blue-600 py-1">
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                Try Premium Page for SupplyChain Hub
                            </Link>
                            <Link href="#" className="block text-xs text-gray-700 hover:text-blue-600 py-1">
                                ⓘ Advertise on SupplyChain Hub
                            </Link>
                            <Separator className="my-2" />
                            <Link href="/dashboard/overview" className="block text-xs text-gray-700 hover:text-blue-600 text-center py-1">
                                See visitor analytics
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Navigation Links */}
                    <Card className="border-none shadow-sm">
                        <CardContent className="p-3 space-y-1">
                            <Link href="#" className="flex items-center gap-2 text-xs text-gray-700 hover:text-blue-600 py-1.5">
                                <Bookmark className="w-4 h-4" />
                                Saved items
                            </Link>
                            <Link href="/dashboard/network" className="flex items-center gap-2 text-xs text-gray-700 hover:text-blue-600 py-1.5">
                                <Users2 className="w-4 h-4" />
                                Groups
                            </Link>
                            <Link href="#" className="flex items-center gap-2 text-xs text-gray-700 hover:text-blue-600 py-1.5">
                                <Newspaper className="w-4 h-4" />
                                Newsletters
                            </Link>
                            <Link href="#" className="flex items-center gap-2 text-xs text-gray-700 hover:text-blue-600 py-1.5">
                                <CalendarDays className="w-4 h-4" />
                                Events
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* CENTER COLUMN - FEED */}
                <div className="col-span-12 lg:col-span-6 space-y-4">
                    {/* Start a Post Box */}
                    <Card className="border-none shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <Avatar className="h-12 w-12 border">
                                    <AvatarImage src={userProfile.profilePhotoUrl || ""} />
                                    <AvatarFallback className="bg-blue-100 text-blue-600">
                                        {userProfile.firstName?.[0]}{userProfile.lastName?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <button
                                    className="flex-1 text-left px-4 py-3 bg-transparent border border-gray-300 rounded-full text-sm text-gray-500 hover:bg-gray-100 transition-colors"
                                    onClick={() => setIsPostModalOpen(true)}
                                >
                                    Start a post
                                </button>
                            </div>
                            <div className="flex justify-between items-center">
                                <Button variant="ghost" size="sm" className="text-gray-600 gap-1.5 text-xs hover:bg-gray-100">
                                    <Video className="w-5 h-5 text-blue-500" />
                                    Video
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-600 gap-1.5 text-xs hover:bg-gray-100">
                                    <ImageIcon className="w-5 h-5 text-green-500" />
                                    Photo
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-600 gap-1.5 text-xs hover:bg-gray-100">
                                    <FileText className="w-5 h-5 text-orange-500" />
                                    Write article
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sort By */}
                    <div className="flex items-center gap-2">
                        <Separator className="flex-1" />
                        <span className="text-xs text-gray-500">Sort by:</span>
                        <button className="text-xs font-semibold text-gray-700 hover:text-blue-600 flex items-center gap-1">
                            Top <ChevronRight className="w-3 h-3 rotate-90" />
                        </button>
                    </div>

                    {/* Feed Posts */}
                    {feedItems.length > 0 ? (
                        feedItems.map((item) => (
                            <FeedCard key={item.id} item={item} />
                        ))
                    ) : (
                        <Card className="border-none shadow-sm">
                            <CardContent className="py-12 text-center">
                                <Newspaper className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                <p className="text-gray-500">No posts in your feed yet.</p>
                                <p className="text-sm text-gray-400">Connect with professionals to see their updates.</p>
                                <Link href="/dashboard/network/discover">
                                    <Button className="mt-4" variant="outline">
                                        Discover Professionals
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="hidden lg:block col-span-3 space-y-4">
                    {/* Today's Puzzle */}
                    <Card className="border-none shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">Today's puzzle</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-500 rounded-lg flex items-center justify-center">
                                            <Puzzle className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-700">Zip - a quick brain teaser</p>
                                            <p className="text-xs text-gray-500">Solve in 60s or less!</p>
                                            <p className="text-xs text-gray-400">{connectionCount} connections played</p>
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Add to your feed */}
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-1">
                                Add to your feed
                                <span className="text-gray-400 text-xs cursor-help">ⓘ</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {suggestions.slice(0, 3).map((user) => (
                                <div key={user.id} className="flex items-start gap-3">
                                    <Link href={`/p/${user.id}`}>
                                        <Avatar className="h-12 w-12 border">
                                            <AvatarImage src={user.profilePhotoUrl} />
                                            <AvatarFallback className="text-sm bg-blue-100 text-blue-600">
                                                {user.firstName?.[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/p/${user.id}`} className="hover:underline">
                                            <p className="font-semibold text-sm text-gray-900 truncate">
                                                {user.firstName} {user.lastName}
                                            </p>
                                        </Link>
                                        <p className="text-xs text-gray-500 line-clamp-2">
                                            {user.headline || user.currentRole || "Professional"}
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-2 rounded-full text-xs h-7 gap-1 border-gray-700 text-gray-700 hover:bg-gray-100 hover:border-gray-900"
                                            onClick={() => handleConnect(user.id)}
                                        >
                                            <UserPlus className="w-3.5 h-3.5" /> Follow
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            <Link
                                href="/dashboard/network/discover"
                                className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 font-medium pt-2"
                            >
                                View all recommendations <ChevronRight className="w-4 h-4" />
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Premium Ad */}
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardContent className="p-4 text-center">
                            <p className="text-right text-[10px] text-gray-400 mb-2">Ad · · ·</p>
                            <p className="text-xs text-gray-600 mb-3">
                                {userProfile.firstName}, enjoy 50% off 2 months of SupplyChain Hub Premium
                            </p>
                            <div className="flex justify-center items-center gap-3 mb-3">
                                <Avatar className="h-14 w-14 border-2 border-amber-400">
                                    <AvatarImage src={userProfile.profilePhotoUrl} />
                                    <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                                        {userProfile.firstName?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <Badge className="bg-amber-100 text-amber-700">
                                    <Sparkles className="w-3 h-3 mr-1" /> Premium
                                </Badge>
                            </div>
                            <p className="text-xs text-gray-600 mb-3">
                                Stand out and get ahead in your job search
                            </p>
                            <Link href="/dashboard/billing">
                                <Button variant="outline" className="rounded-full border-amber-500 text-amber-600 hover:bg-amber-50">
                                    Redeem offer
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Footer Links */}
                    <div className="text-[11px] text-gray-500 space-y-1 px-2">
                        <div className="flex flex-wrap gap-x-2 gap-y-0.5 justify-center">
                            <Link href="#" className="hover:text-blue-600 hover:underline">About</Link>
                            <Link href="#" className="hover:text-blue-600 hover:underline">Accessibility</Link>
                            <Link href="#" className="hover:text-blue-600 hover:underline">Help Center</Link>
                        </div>
                        <div className="flex flex-wrap gap-x-2 gap-y-0.5 justify-center">
                            <Link href="#" className="hover:text-blue-600 hover:underline">Privacy & Terms ▾</Link>
                            <Link href="#" className="hover:text-blue-600 hover:underline">Ad Choices</Link>
                        </div>
                        <div className="flex flex-wrap gap-x-2 gap-y-0.5 justify-center">
                            <Link href="#" className="hover:text-blue-600 hover:underline">Advertising</Link>
                            <Link href="#" className="hover:text-blue-600 hover:underline">Business Services ▾</Link>
                        </div>
                        <div className="flex flex-wrap gap-x-2 gap-y-0.5 justify-center">
                            <Link href="#" className="hover:text-blue-600 hover:underline">Get the SupplyChain Hub app</Link>
                            <Link href="#" className="hover:text-blue-600 hover:underline">More</Link>
                        </div>
                        <p className="text-center pt-2 flex items-center justify-center gap-1">
                            <span className="w-4 h-4 bg-blue-600 rounded text-white text-[8px] flex items-center justify-center font-bold">
                                <LinkIcon className="w-2.5 h-2.5" strokeWidth={2} />
                            </span>
                            SupplyChain Hub Corporation © 2024
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
