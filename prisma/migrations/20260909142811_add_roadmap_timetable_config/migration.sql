-- CreateTable
CREATE TABLE "RoadmapPhase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order" INTEGER NOT NULL DEFAULT 0,
    "dateRange" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RoadmapDeliverable" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phaseId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    CONSTRAINT "RoadmapDeliverable_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "RoadmapPhase" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TimetableRow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order" INTEGER NOT NULL DEFAULT 0,
    "timeLabel" TEXT NOT NULL,
    "mon" TEXT NOT NULL,
    "tue" TEXT NOT NULL,
    "wed" TEXT NOT NULL,
    "thu" TEXT NOT NULL,
    "fri" TEXT NOT NULL,
    "sat" TEXT NOT NULL,
    "sun" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "RoadmapPhase_order_idx" ON "RoadmapPhase"("order");

-- CreateIndex
CREATE INDEX "RoadmapDeliverable_phaseId_order_idx" ON "RoadmapDeliverable"("phaseId", "order");

-- CreateIndex
CREATE INDEX "TimetableRow_order_idx" ON "TimetableRow"("order");
