import dotenv from 'dotenv';
dotenv.config();
import prisma from "../lib/prisma";

async function main() {
    const email = process.argv[2];

    if (!email) {
        console.error('Please provide an email address as an argument.');
        process.exit(1);
    }

    console.log(`Attempting to promote user with email: ${email}...`);

    try {
        const user = await prisma.user.update({
            where: { email: email },
            data: { role: 'ADMIN' },
        });

        console.log(`Successfully promoted ${user.firstName} ${user.lastName} (${user.email}) to ADMIN.`);
    } catch (error: any) {
        if (error.code === 'P2025') {
            console.error(`User with email ${email} not found.`);
        } else {
            console.error('Error updating user:', error);
        }
    } finally {
        // We don't need to disconnect explicitly as the specialized instance might handle it, 
        // but usually okay to let process exit clean it up or try disconnect if method exists.
        // The shared instance `prisma` might not expose $disconnect directly if it was wrapped? 
        // Actually it is PrismaClient instance.
        await prisma.$disconnect();
    }
}

main();
