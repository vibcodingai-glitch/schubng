import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DIRECT_URL
        }
    }
})

async function main() {
    try {
        console.log('Attempting to connect to database...')
        await prisma.$connect()
        console.log('Successfully connected to database!')

        // Try a simple query
        const count = await prisma.user.count()
        console.log(`Current user count: ${count}`)

    } catch (error) {
        console.error('Error connecting to database:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
