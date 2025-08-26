import { PrismaBetterSQLite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from './prisma-client/client';

/* const adapter = new PrismaBetterSQLite3({
    url: "file:../../database/dev.db"
});
*/
const db = new PrismaClient();
db.$connect().catch((e) => {
    console.error("Failed to connect to the database:", e);
    process.exit(1);
});

export default db;
