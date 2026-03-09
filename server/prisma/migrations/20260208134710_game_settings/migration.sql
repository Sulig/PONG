-- CreateEnum
CREATE TYPE "PlayMode" AS ENUM ('AI', 'LOCAL');

-- CreateEnum
CREATE TYPE "AiLevel" AS ENUM ('EASY', 'MID', 'HARD');

-- CreateEnum
CREATE TYPE "Paddle" AS ENUM ('LEFT', 'RIGHT');

-- AlterTable
ALTER TABLE "match" ADD COLUMN     "aiLevel" "AiLevel" NOT NULL DEFAULT 'EASY',
ADD COLUMN     "paddle" "Paddle" NOT NULL DEFAULT 'LEFT',
ADD COLUMN     "playMode" "PlayMode" NOT NULL DEFAULT 'AI',
ADD COLUMN     "winPoints" INTEGER NOT NULL DEFAULT 5;
