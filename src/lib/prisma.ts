import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient | null; isDatabaseReady: boolean };

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

// Test database connection asynchronously
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
  globalForPrisma.isDatabaseReady = true;
  
  // Test connection in background (don't block)
  prisma.$connect()
    .then(() => {
      console.log('Database connected successfully');
      isDatabaseAvailable = true;
      globalForPrisma.isDatabaseReady = true;
    })
    .catch((error) => {
      console.log('Database connection failed, using fallback mode:', error.message);
      isDatabaseAvailable = false;
      globalForPrisma.isDatabaseReady = false;
    });
}

export function isDatabaseReady(): boolean {
  return globalForPrisma.isDatabaseReady !== false && isDatabaseAvailable;
}

export async function safePrismaOperation<T>(operation: () => Promise<T>, fallbackValue?: T): Promise<T> {
  try {
    if (!isDatabaseReady()) {
      console.log('Database not ready, returning fallback');
      return fallbackValue as T;
    }
    return await operation();
  } catch (error: any) {
    console.error('Database operation failed:', error.message);
    if (error.message?.includes('database') || error.message?.includes('file')) {
      globalForPrisma.isDatabaseReady = false;
      isDatabaseAvailable = false;
    }
    return fallbackValue as T;
  }
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
