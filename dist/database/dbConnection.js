"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./prisma-client/client");
const db = new client_1.PrismaClient({
    log: ['query'],
});
db.$connect().catch((e) => {
    console.error("Failed to connect to the database:", e);
    process.exit(1);
});
exports.default = db;
