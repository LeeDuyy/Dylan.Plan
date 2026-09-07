-- CreateTable
CREATE TABLE "IncomeSource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "monthId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "IncomeSource_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "MonthBudget" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "IncomeSource_monthId_idx" ON "IncomeSource"("monthId");

-- CreateIndex
CREATE INDEX "IncomeSource_monthId_order_idx" ON "IncomeSource"("monthId", "order");
