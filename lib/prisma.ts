import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

import { PrismaClient } from "@/generated/prisma/client";

// Prisma 7 với provider "sqlite" bắt buộc phải truyền driver adapter tại runtime
// (schema.prisma không khai báo `url = env("DATABASE_URL")`, việc kết nối hoàn
// toàn do adapter đảm nhiệm). Xem `@prisma/adapter-better-sqlite3`.
function createPrismaClient(): PrismaClient {
  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./prisma/dev.db"
  });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { __dylanPlanPrisma?: PrismaClient };

// Singleton dùng chung để tránh tạo nhiều connection khi Next.js hot-reload ở dev.
export const prisma: PrismaClient = globalForPrisma.__dylanPlanPrisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__dylanPlanPrisma = prisma;
}
