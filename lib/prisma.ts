/**
 * Prisma Singleton Pattern
 * 
 * Fix lỗi:
 * - Too many connections
 * - P2024 connection pool timeout
 * - Dev reload tạo nhiều PrismaClient
 */

import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error"],
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

/**
 * END PRISMA SINGLETON
 */