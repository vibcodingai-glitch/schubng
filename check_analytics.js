
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
dotenv.config();

const prisma = new PrismaClient();

async function checkAnalytics() {
    try {
        const user = await prisma.user.findUnique({
            where: { email: 'binisah.info@gmail.com' },
            include: {
                _count: {
                    select: {
                        followers: true,
                        following: true
                    }
                }
            }
        });

        if (!user) {
            console.log("User not found");
            return;
        }

        console.log("User ID:", user.id);
        console.log("Profile Views (DB):", user.profileViews);
        console.log("Followers count (DB):", user._count.followers);

        const posts = await prisma.post.findMany({
            where: { authorId: user.id }
        });

        console.log("Post count:", posts.length);
        let totalImpressions = 0;
        posts.forEach(p => {
            console.log(`Post ID: ${p.id}, Impressions: ${p.impressions}`);
            totalImpressions += (p.impressions || 0);
        });
        console.log("Total Impressions (Calculated):", totalImpressions);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

checkAnalytics();
