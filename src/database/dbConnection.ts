import { PrismaClient } from './prisma-client/client';

const db = new PrismaClient({
    log: ['query'],
});
db.$connect().catch((e) => {
    console.error("Failed to connect to the database:", e);
    process.exit(1);
});

export default db;
