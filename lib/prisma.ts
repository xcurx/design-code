import { PrismaClient } from "@/app/generated/prisma/client"
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = global as unknown as {
    prisma: PrismaClient
}

const connectionString = `${process.env.DATABASE_URL}`;

function createPrismaClient() {
    const adapter = new PrismaPg({ connectionString, ssl: { rejectUnauthorized: false } });
    return new PrismaClient({
        adapter
    })
}

const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma