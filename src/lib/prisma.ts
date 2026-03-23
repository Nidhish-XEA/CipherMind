import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient | null };

// Database availability check
let isDatabaseAvailable = true;

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:./dev.db',
    },
  },
  errorFormat: 'minimal',
});

// Test database connection
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
  
  // Test connection on first use
  prisma.$connect()
    .then(() => {
      console.log('Database connected successfully');
      isDatabaseAvailable = true;
    })
    .catch((error) => {
      console.log('Database connection failed, using fallback mode:', error.message);
      isDatabaseAvailable = false;
    });
}

export function isDatabaseReady(): boolean {
  return isDatabaseAvailable;
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
