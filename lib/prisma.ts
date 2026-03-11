import { PrismaClient } from "@/app/generated/prisma/client"
import { PrismaPostgresAdapter } from '@prisma/adapter-ppg'

const globalForPrisma = global as unknown as {
    prisma: PrismaClient
}

const connectionString = `${process.env.DATABASE_URL}`;

function createPrismaClient() {
    const adapter = new PrismaPostgresAdapter({
        connectionString
    });
    return new PrismaClient({
        adapter
    })
}

const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma