/*
  Warnings:

  - You are about to drop the `RewardLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "RewardLog";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "DailyAchievment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "earnedStar" BOOLEAN NOT NULL DEFAULT false,
    "xpGained" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "DailyAchievment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyAchievment_userId_key" ON "DailyAchievment"("userId");

-- CreateIndex
CREATE INDEX "DailyAchievment_userId_date_idx" ON "DailyAchievment"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyAchievment_userId_date_key" ON "DailyAchievment"("userId", "date");
