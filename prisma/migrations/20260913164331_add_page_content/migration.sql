-- CreateTable
CREATE TABLE "PageText" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "page" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PageBlock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "page" TEXT NOT NULL,
    "section" TEXT NOT NULL DEFAULT 'default',
    "order" INTEGER NOT NULL DEFAULT 0,
    "badge" TEXT,
    "title" TEXT,
    "desc" TEXT,
    "value" TEXT,
    "weight" INTEGER,
    "variant" TEXT,
    "bullets" TEXT,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "PageText_page_idx" ON "PageText"("page");

-- CreateIndex
CREATE UNIQUE INDEX "PageText_page_key_key" ON "PageText"("page", "key");

-- CreateIndex
CREATE INDEX "PageBlock_page_section_order_idx" ON "PageBlock"("page", "section", "order");
