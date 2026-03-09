/*
  Warnings:

  - You are about to drop the column `profileUserId` on the `achievement` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "achievement" DROP CONSTRAINT "achievement_profileUserId_fkey";

-- DropForeignKey
ALTER TABLE "achievement" DROP CONSTRAINT "achievement_userId_fkey";

-- AlterTable
ALTER TABLE "achievement" DROP COLUMN "profileUserId";

-- AddForeignKey
ALTER TABLE "achievement" ADD CONSTRAINT "achievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
