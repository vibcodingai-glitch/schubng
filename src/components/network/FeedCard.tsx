"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    ThumbsUp,
    MessageCircle,
    Repeat2,
    Send,
    Award,
    MapPin,
    MoreHorizontal,
    X
} from "lucide-react";
import Link from "next/link";

export interface FeedItem {
    id: string;
    type: "post" | "verification" | "new_member" | "profile_update" | "certification_added" | "milestone";
    user: {
        id: string;
        name: string;
        headline: string;
        avatar?: string | null;
        username: string;
        state?: string;
        industry?: string;
        skills?: string[];
    };
    data?: any;
    congratulations?: number;
    comments?: number;
    createdAt: string;
    liked?: boolean;
}

interface FeedCardProps {
    item: FeedItem;
}

import { addComment, getPostComments } from "@/lib/actions/dashboard.actions";
import { Input } from "@/components/ui/input";

export function FeedCard({ item }: FeedCardProps) {
    const [isLiked, setIsLiked] = React.useState(item.liked || false);
    const [localLikes, setLocalLikes] = React.useState(item.congratulations || 0);

    // Comment State
    const [showComments, setShowComments] = React.useState(false);
    const [comments, setComments] = React.useState<any[]>([]);
    const [commentText, setCommentText] = React.useState("");
    const [loadingComments, setLoadingComments] = React.useState(false);

    const getTimeAgo = () => {
        const now = new Date();
        const created = new Date(item.createdAt);
        const diffMs = now.getTime() - created.getTime();
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHrs / 24);

        if (diffHrs < 1) return "just now";
        if (diffHrs < 24) return `${diffHrs}h`;
        if (diffDays < 7) return `${diffDays}d`;
        return `${Math.floor(diffDays / 7)}w`;
    };

    const handleLike = () => {
        if (!isLiked) {
            setIsLiked(true);
            setLocalLikes(prev => prev + 1);
        } else {
            setIsLiked(false);
            setLocalLikes(prev => prev - 1);
        }
    };

    const handleToggleComments = async () => {
        console.log("Toggle comments clicked", item.id, "Current state:", showComments);
        if (!showComments) {
            setShowComments(true);
            if (comments.length === 0) {
                setLoadingComments(true);
                try {
                    const fetchedComments = await getPostComments(item.id);
                    console.log("Fetched comments:", fetchedComments);
                    setComments(fetchedComments || []);
                } catch (error) {
                    console.error("Error fetching comments in component:", error);
                } finally {
                    setLoadingComments(false);
                }
            }
        } else {
            setShowComments(false);
        }
    };

    const handleSubmitComment = async () => {
        if (!commentText.trim()) return;

        // Optimistic update could go here, but let's wait for server response for ID
        const result = await addComment(item.id, commentText);
        if (result.success && result.comment) {
            setComments([...comments, result.comment]);
            setCommentText("");
        } else {
            // Handle error (e.g., toast)
            console.error(result.error);
        }
    };

    return (
        <Card>
            <CardContent className="p-0">
                {/* Header */}
                <div className="p-3 flex items-start justify-between">
                    <div className="flex items-start gap-2 flex-1">
                        <Link href={`/p/${item.user.username}`}>
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={item.user.avatar || undefined} />
                                <AvatarFallback className="bg-gray-200 text-gray-700 font-semibold">
                                    {item.user.name.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                            </Avatar>
                        </Link>
                        <div className="flex-1 min-w-0">
                            <Link href={`/p/${item.user.username}`} className="hover:underline">
                                <h3 className="font-semibold text-sm text-gray-900">{item.user.name}</h3>
                            </Link>
                            <p className="text-xs text-gray-500 line-clamp-2">{item.user.headline}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{getTimeAgo()} • 🌍</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>

                {/* Content */}
                <div className="px-3 pb-3">
                    {item.type === "post" && (
                        <div className="space-y-3">
                            {item.data.content && (
                                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                                    {item.data.content}
                                </p>
                            )}
                            {item.data.image && (
                                <div className="rounded-lg overflow-hidden border border-gray-100">
                                    <img
                                        src={item.data.image}
                                        alt="Post content"
                                        className="w-full h-auto object-cover max-h-[500px]"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {item.type === "verification" && (
                        <div className="space-y-2">
                            <p className="text-sm text-gray-900">
                                🎉 Just got verified!
                            </p>
                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                                <div className="flex items-center gap-2">
                                    <Award className=" w-5 h-5 text-emerald-600" />
                                    <div>
                                        <p className="font-semibold text-sm text-emerald-900">{item.data.certification}</p>
                                        <p className="text-xs text-emerald-700">{item.data.issuingBody}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {item.type === "new_member" && (
                        <div className="space-y-2">
                            <p className="text-sm text-gray-900">
                                👋 Joined SupplyChain Hub
                            </p>
                            {item.user.state && (
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <MapPin className="w-3 h-3" />
                                    <span>{item.user.state}, Nigeria</span>
                                    {item.user.industry && <span>• {item.user.industry}</span>}
                                </div>
                            )}
                            {item.user.skills && item.user.skills.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {item.user.skills.slice(0, 3).map((skill, idx) => (
                                        <Badge key={idx} variant="secondary" className="text-xs py-0">
                                            {skill}
                                        </Badge>
                                    ))}
                                    {item.user.skills.length > 3 && (
                                        <Badge variant="secondary" className="text-xs py-0">
                                            +{item.user.skills.length - 3}
                                        </Badge>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {item.type === "profile_update" && (
                        <div className="space-y-2">
                            <p className="text-sm text-gray-900">
                                📝 New position
                            </p>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-sm text-gray-900 font-medium">{item.data.newRole} at {item.data.newCompany}</p>
                                <p className="text-xs text-gray-500 mt-1">Previously: {item.data.oldRole}</p>
                            </div>
                        </div>
                    )}

                    {item.type === "certification_added" && (
                        <div className="space-y-2">
                            <p className="text-sm text-gray-900">
                                📜 Added a new certification
                            </p>
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                <p className="font-semibold text-sm text-amber-900">{item.data.certification}</p>
                                <p className="text-xs text-amber-700 mt-1">Status: {item.data.status} ⏳</p>
                            </div>
                        </div>
                    )}

                    {item.type === "milestone" && (
                        <div className="space-y-2">
                            <p className="text-sm text-gray-900">
                                🏆 {item.data.achievement}
                            </p>
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                                <p className="text-sm text-purple-900">{item.data.description}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Engagement Stats */}
                {(localLikes > 0 || (item.comments || 0) > 0 || comments.length > 0) && (
                    <>
                        <Separator />
                        <div className="px-3 py-2 flex items-center justify-between text-xs text-gray-500">
                            {localLikes > 0 ? (
                                <span>{localLikes} {localLikes === 1 ? 'person' : 'people'} liked this</span>
                            ) : <span />}
                            {(item.comments || 0) + comments.length > 0 && (
                                <span>{(item.comments || 0) + comments.length} comment{((item.comments || 0) + comments.length) > 1 ? 's' : ''}</span>
                            )}
                        </div>
                    </>
                )}

                {/* Actions */}
                <Separator />
                <div className="flex items-center px-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`flex-1 rounded-none ${isLiked ? 'text-blue-600' : 'text-gray-600'}`}
                        onClick={handleLike}
                    >
                        <ThumbsUp className={`w-4 h-4 mr-2 ${isLiked ? 'fill-blue-600' : ''}`} />
                        Like
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 text-gray-600 rounded-none"
                        onClick={handleToggleComments}
                    >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Comment
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 text-gray-600 rounded-none">
                        <Repeat2 className="w-4 h-4 mr-2" />
                        Repost
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 text-gray-600 rounded-none">
                        <Send className="w-4 h-4 mr-2" />
                        Send
                    </Button>
                </div>

                {/* Comments Section */}
                {showComments && (
                    <div className="bg-gray-50 p-3 space-y-3">
                        {loadingComments && <p className="text-xs text-center text-gray-500">Loading comments...</p>}

                        {comments.length > 0 && (
                            <div className="space-y-3">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="flex gap-2 text-sm">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={comment.author.profilePhotoUrl} />
                                            <AvatarFallback>{comment.author.firstName?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="bg-white p-2 rounded-lg rounded-tl-none shadow-sm flex-1">
                                            <div className="flex justify-between items-baseline">
                                                <span className="font-semibold text-gray-900 text-xs">
                                                    {comment.author.firstName} {comment.author.lastName}
                                                </span>
                                                <span className="text-[10px] text-gray-400">
                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 leading-snug">{comment.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-2 items-center">
                            <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">ME</AvatarFallback>
                            </Avatar>
                            <Input
                                placeholder="Add a comment..."
                                className="h-9 text-sm bg-white"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
                            />
                            <Button size="icon" className="h-9 w-9" onClick={handleSubmitComment} disabled={!commentText.trim()}>
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
