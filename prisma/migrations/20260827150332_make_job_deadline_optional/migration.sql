-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JobApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "company" TEXT NOT NULL,
    "deadline" DATETIME,
    "platformId" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Interested',
    "note" TEXT,
    "submittedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "JobApplication_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "JobPlatform" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_JobApplication" ("company", "createdAt", "deadline", "id", "link", "note", "platformId", "status", "submittedAt", "updatedAt") SELECT "company", "createdAt", "deadline", "id", "link", "note", "platformId", "status", "submittedAt", "updatedAt" FROM "JobApplication";
DROP TABLE "JobApplication";
ALTER TABLE "new_JobApplication" RENAME TO "JobApplication";
CREATE INDEX "JobApplication_platformId_idx" ON "JobApplication"("platformId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
