-- CreateTable
CREATE TABLE "plants" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "latin" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "zone" TEXT,
    "native" TEXT,
    "droughtTolerant" BOOLEAN,
    "floodTolerant" BOOLEAN,
    "height" REAL,
    "spread" REAL,
    "saltTolerance" TEXT,
    "family" TEXT,
    "genus" TEXT,
    "species" TEXT,
    "functionalGroup" TEXT
);

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_plants_1" ON "plants"("code");
Pragma writable_schema=0;
