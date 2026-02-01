import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getNotifications } from "@/lib/actions/dashboard.actions";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageSquare, UserPlus, BellOff } from "lucide-react";
import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/shared/FadeIn";

export const metadata: Metadata = {
    title: "Notifications | SupplyChain Hub",
    description: "View your latest notifications.",
};

export default async function NotificationsPage() {
    const notifications = await getNotifications();

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Notifications</h1>
                    <p className="text-slate-500 text-sm mt-1">Stay updated with your network activity</p>
                </div>
                {notifications.length > 0 && (
                    <Button variant="outline" size="sm" className="hidden sm:flex text-slate-600">
                        Mark all as read
                    </Button>
                )}
            </div>

            <FadeInStagger className="space-y-3">
                {notifications.length > 0 ? (
                    notifications.map((notification: any) => (
                        <FadeInItem
                            key={notification.id}
                            className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl p-4 transition-all hover:shadow-md hover:border-blue-200/50 group flex gap-4 items-start"
                        >
                            <Link href={`/p/${notification.actor.id}`} className="shrink-0">
                                <Avatar className="h-12 w-12 border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                                    <AvatarImage src={notification.actor.profilePhotoUrl} />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-medium">
                                        {notification.actor.firstName?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                            </Link>

                            <div className="flex-1 min-w-0 pt-0.5">
                                <div className="text-sm text-slate-900 leading-relaxed">
                                    <Link href={`/p/${notification.actor.id}`} className="font-semibold hover:text-blue-600 hover:underline decoration-blue-300 underline-offset-2">
                                        {notification.actor.firstName} {notification.actor.lastName}
                                    </Link>
                                    {" "}
                                    <span className="text-slate-600">{notification.preview}</span>
                                </div>

                                {notification.resourcePreview && (
                                    <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic line-clamp-1 max-w-md shadow-sm">
                                        "{notification.resourcePreview}"
                                    </div>
                                )}

                                <div className="mt-3 flex items-center gap-3">
                                    {notification.type === "FOLLOW" && (
                                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100 gap-1.5 px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold shadow-none">
                                            <UserPlus className="w-3 h-3" /> Connection
                                        </Badge>
                                    )}
                                    {notification.type === "LIKE" && (
                                        <Badge variant="secondary" className="bg-red-50 text-red-600 hover:bg-red-100 border-red-100 gap-1.5 px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold shadow-none">
                                            <Heart className="w-3 h-3 fill-current" /> Like
                                        </Badge>
                                    )}
                                    {notification.type === "COMMENT" && (
                                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-100 gap-1.5 px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold shadow-none">
                                            <MessageSquare className="w-3 h-3" /> Comment
                                        </Badge>
                                    )}
                                    <span className="text-xs text-slate-400 font-medium">
                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                    </span>
                                </div>
                            </div>

                            <div className="shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                            </div>
                        </FadeInItem>
                    ))
                ) : (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                            <BellOff className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900">No notifications yet</h3>
                        <p className="text-slate-500 mt-2 max-w-sm mx-auto">When professional interactions happen, they will appear here. Start connecting!</p>
                    </div>
                )}
            </FadeInStagger>
        </div>
    );
}
