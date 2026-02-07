"use server";

import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function getDashboardData() {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) return { error: "Authentication failed: No user" };

    try {
        const user = await prisma.user.findUnique({
            where: { id: authUser.id },
            include: {
                certifications: {
                    orderBy: { createdAt: "desc" },
                    take: 5
                },
                activityLogs: {
                    orderBy: { createdAt: "desc" },
                    take: 5
                },
                workExperience: {
                    orderBy: { startDate: "desc" }
                },
                education: {
                    orderBy: { startYear: "desc" }
                },
                _count: {
                    select: {
                        followers: true,
                        following: true
                    }
                }
            }
        });

        if (!user) return { error: "User not found in database", userId: authUser.id };

        // Calculate stats
        let totalCount = 0;
        let verifiedCount = 0;
        let pendingCount = 0;
        let totalImpressions = 0;
        let userProfileViews = user.profileViews;

        try {
            const stats = await prisma.certification.groupBy({
                by: ['status'],
                where: { userId: user.id },
                _count: true,
            });

            totalCount = stats.reduce((acc: number, curr: { _count: number }) => acc + curr._count, 0);
            verifiedCount = stats.find((s: { status: string, _count: number }) => s.status === "VERIFIED")?._count || 0;
            pendingCount = stats.find((s: { status: string, _count: number }) => s.status === "PENDING")?._count || 0;

            // Calculate total post impressions
            // Note: If the schema update hasn't propagated to the running server, this might fail.
            // We'll try to fetch with impressions, but fallback if it fails.
            const posts = await prisma.post.findMany({
                where: { authorId: user.id },
                // select: { impressions: true } // Removed to avoid runtime error if client is stale
            });
            // Manual fallback if impressions field exists on the object (any cast to avoid TS error if types are missing)
            totalImpressions = posts.reduce((acc, curr: any) => acc + (curr.impressions || 0), 0);

        } catch (statsError) {
            console.error("Error calculating stats:", statsError);
            // Continue execution to return user data at least
        }


        return {
            user: {
                ...user,
                profilePhotoUrl: user.profilePhotoUrl,
            },
            stats: {
                totalCerts: totalCount,
                verifiedCerts: verifiedCount,
                pendingCerts: pendingCount,
                profileViews: userProfileViews,
                totalImpressions: totalImpressions,
                searchAppearances: 0
            },
            certifications: user.certifications,
            activity: user.activityLogs
        };

    } catch (error: any) {
        console.error("Error fetching dashboard data:", error);
        return { error: "Exception thrown", details: error.message };
    }
}

export async function getNetworkData() {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return null;

    try {
        // Fetch connections (people the user is following)
        // For MVP "Network" usually means Connections (mutual or following)
        // Let's fetch following for now as "My Network"
        const following = await prisma.connection.findMany({
            where: { followerId: authUser.id },
            include: {
                following: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profilePhotoUrl: true,
                        headline: true,
                        currentRole: true,
                        currentCompany: true,
                        industry: true,
                        location: true,
                    }
                }
            }
        });

        return following.map((c: { following: any }) => c.following);
    } catch (error) {
        console.error("Error fetching network data:", error);
        return [];
    }
}

export async function getVerificationData() {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return null;

    try {
        // Fetch certification requests created by this user (if they are an issuer?)
        // OR fetch certifications of this user that are being verified?
        // Context: "Verification Status" page for a professional usually means "Where are my certs in the process?"

        const myVerifications = await prisma.certification.findMany({
            where: {
                userId: authUser.id,
                status: {
                    in: ["PENDING", "VERIFIED", "REJECTED"]
                }
            },
            include: {
                verificationRequests: {
                    select: {
                        status: true,
                        updatedAt: true,
                        notes: true
                    }
                }
            },
            orderBy: { updatedAt: "desc" }
        });

        return myVerifications;
    } catch (error) {
        console.error("Error fetching verification data:", error);
        return [];
    }
}

export async function getBillingData() {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return null;

    try {
        const transactions = await prisma.transaction.findMany({
            where: { userId: authUser.id },
            orderBy: { createdAt: "desc" }
        });

        // Also fetch current plan status
        const user = await prisma.user.findUnique({
            where: { id: authUser.id },
            select: { plan: true }
        });

        return {
            transactions,
            currentPlan: user?.plan || "FREE"
        };
    } catch (error) {
        console.error("Error fetching billing data:", error);
        return null;
    }
}
export async function getNetworkFeed() {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    try {
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profilePhotoUrl: true,
                        headline: true
                    }
                },
                _count: {
                    select: {
                        comments: true,
                        likes: true,
                        reposts: true
                    }
                },
                likes: {
                    where: { userId: authUser?.id || "" },
                    select: { userId: true }
                },
                originalPost: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                profilePhotoUrl: true,
                                headline: true
                            }
                        }
                    }
                }
            }
        });

        // Transform to add "isLiked" boolean and handle reposts
        return posts.map((post: any) => ({
            ...post,
            isLiked: post.likes.length > 0,
            likesCount: post._count.likes,
            commentsCount: post._count.comments,
            repostsCount: post._count.reposts,
            originalPost: post.originalPost
        }));
    } catch (error) {
        console.error("Error fetching network feed:", error);
        return [];
    }
}

export async function repostPost(originalPostId: string) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) return { error: "Unauthorized" };

    try {
        // Create a new post that references the original post
        const repost = await prisma.post.create({
            data: {
                authorId: authUser.id,
                repostId: originalPostId,
                content: "" // Reposts might not have innovative content, or we could allow adding a thought later.
            },
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profilePhotoUrl: true,
                        headline: true
                    }
                },
                originalPost: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                profilePhotoUrl: true,
                                headline: true
                            }
                        }
                    }
                }
            }
        });
        return { success: true, post: repost };
    } catch (error: any) {
        console.error("Error reposting:", error);
        return { error: "Failed to repost" };
    }
}

export async function createPost(content: string, imageUrl?: string) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) throw new Error("Unauthorized");
    if (!content && !imageUrl) throw new Error("Post cannot be empty");

    try {
        const newPost = await prisma.post.create({
            data: {
                content,
                imageUrl,
                authorId: authUser.id
            }
        });
        return { success: true, post: newPost };
    } catch (error: any) {
        console.error("Error creating post:", error);
        return { success: false, error: error.message || "Failed to create post" };
    }
}

export async function addComment(postId: string, content: string) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) return { error: "Unauthorized" };
    if (!content.trim()) return { error: "Comment cannot be empty" };

    try {
        const comment = await prisma.comment.create({
            data: {
                content,
                postId,
                authorId: authUser.id
            },
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profilePhotoUrl: true,
                        headline: true
                    }
                }
            }
        });
        return { success: true, comment };
    } catch (error: any) {
        console.error("Error adding comment:", error);
        return { error: "Failed to add comment" };
    }
}

export async function getPostComments(postId: string) {
    try {
        const comments = await prisma.comment.findMany({
            where: { postId },
            orderBy: { createdAt: "asc" },
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profilePhotoUrl: true,
                        headline: true
                    }
                }
            }
        });
        return comments;
    } catch (error) {
        console.error("Error fetching comments:", error);
        return [];
    }
}

export async function getNotifications() {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) return [];

    try {
        const [newFollowers, newLikes, newComments] = await Promise.all([
            // 1. New Followers
            prisma.connection.findMany({
                where: { followingId: authUser.id },
                orderBy: { createdAt: "desc" },
                take: 10,
                include: {
                    follower: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profilePhotoUrl: true
                        }
                    }
                }
            }),

            // 2. Likes on my posts
            prisma.like.findMany({
                where: {
                    post: {
                        authorId: authUser.id
                    },
                    userId: { not: authUser.id } // Exclude self-likes
                },
                orderBy: { createdAt: "desc" },
                take: 10,
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profilePhotoUrl: true
                        }
                    },
                    post: {
                        select: {
                            id: true,
                            content: true
                        }
                    }
                }
            }),

            // 3. Comments on my posts
            prisma.comment.findMany({
                where: {
                    post: {
                        authorId: authUser.id
                    },
                    authorId: { not: authUser.id } // Exclude self-comments
                },
                orderBy: { createdAt: "desc" },
                take: 10,
                include: {
                    author: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profilePhotoUrl: true
                        }
                    },
                    post: {
                        select: {
                            id: true,
                            content: true
                        }
                    }
                }
            })
        ]);

        // Normalize and merge
        const notifications = [
            ...newFollowers.map(f => ({
                id: f.id,
                type: "FOLLOW",
                actor: f.follower,
                createdAt: f.createdAt,
                preview: "started following you"
            })),
            ...newLikes.map(l => ({
                id: l.id,
                type: "LIKE",
                actor: l.user,
                createdAt: l.createdAt,
                preview: "liked your post",
                resourceId: l.post.id,
                resourcePreview: l.post.content ? l.post.content.substring(0, 30) + (l.post.content.length > 30 ? "..." : "") : "Photo"
            })),
            ...newComments.map(c => ({
                id: c.id,
                type: "COMMENT",
                actor: c.author,
                createdAt: c.createdAt,
                preview: "commented on your post",
                resourceId: c.post.id,
                resourcePreview: c.content.substring(0, 30) + (c.content.length > 30 ? "..." : "")
            }))
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return notifications;

    } catch (error) {
        console.error("Error fetching notifications:", error);
        return [];
    }
}

export async function togglePostLike(postId: string) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) return { error: "Unauthorized" };

    try {
        const existingLike = await prisma.like.findUnique({
            where: {
                postId_userId: {
                    userId: authUser.id,
                    postId
                }
            }
        });

        if (existingLike) {
            await prisma.like.delete({
                where: {
                    postId_userId: {
                        userId: authUser.id,
                        postId
                    }
                }
            });
            return { success: true, liked: false };
        } else {
            await prisma.like.create({
                data: {
                    userId: authUser.id,
                    postId
                }
            });
            return { success: true, liked: true };
        }
    } catch (error: any) {
        console.error("Error toggling like:", error);
        return { error: "Failed to update like post" };
    }
}

export async function deletePost(postId: string) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) return { error: "Unauthorized" };

    try {
        const post = await prisma.post.findUnique({
            where: { id: postId }
        });

        if (!post) return { error: "Post not found" };
        if (post.authorId !== authUser.id) return { error: "Unauthorized" };

        await prisma.post.delete({
            where: { id: postId }
        });
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting post:", error);
        return { error: "Failed to delete post" };
    }
}
