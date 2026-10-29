import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined
}

const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL || 'file:./dev.db'
})

export const prisma = global.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma
