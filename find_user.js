
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        where: {
            OR: [
                { email: { contains: 'abdulrahman', mode: 'insensitive' } },
                { firstName: { contains: 'abdulrahman', mode: 'insensitive' } },
                { lastName: { contains: 'abdulrahman', mode: 'insensitive' } }
            ]
        }
    });
    console.log(JSON.stringify(users, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
