import "dotenv/config";
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL!

declare global {
  var prisma: PrismaClient | undefined;
}

const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = global.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") global.prisma = prisma

export { prisma }