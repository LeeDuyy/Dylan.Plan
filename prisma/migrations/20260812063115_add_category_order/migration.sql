-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "monthId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "budget" INTEGER NOT NULL,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "isFallback" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Category_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "MonthBudget" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Category" ("budget", "createdAt", "id", "isFallback", "locked", "monthId", "name", "type", "updatedAt") SELECT "budget", "createdAt", "id", "isFallback", "locked", "monthId", "name", "type", "updatedAt" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE INDEX "Category_monthId_idx" ON "Category"("monthId");
CREATE INDEX "Category_monthId_order_idx" ON "Category"("monthId", "order");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
