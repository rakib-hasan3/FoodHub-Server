/*
  Warnings:

  - Added the required column `updatedAt` to the `Meals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Meals" ADD COLUMN     "calories" INTEGER,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "discountPercent" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ingredients" TEXT[],
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "orderCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "preparationTime" TEXT,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "servingSize" TEXT,
ADD COLUMN     "spiceLevel" TEXT,
ADD COLUMN     "totalReviews" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "trending" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Meals_category_id_idx" ON "Meals"("category_id");

-- CreateIndex
CREATE INDEX "Meals_featured_idx" ON "Meals"("featured");

-- CreateIndex
CREATE INDEX "Meals_trending_idx" ON "Meals"("trending");

-- CreateIndex
CREATE INDEX "Meals_isAvailable_idx" ON "Meals"("isAvailable");

-- CreateIndex
CREATE INDEX "Meals_spiceLevel_idx" ON "Meals"("spiceLevel");

-- CreateIndex
CREATE INDEX "Meals_rating_idx" ON "Meals"("rating");

-- CreateIndex
CREATE INDEX "Meals_orderCount_idx" ON "Meals"("orderCount");

-- CreateIndex
CREATE INDEX "Meals_createdAt_idx" ON "Meals"("createdAt");
