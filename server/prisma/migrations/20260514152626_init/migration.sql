-- DropIndex
DROP INDEX "Card_userId_deckId_due_idx";

-- AlterTable
ALTER TABLE "Deck" ADD COLUMN     "color" TEXT NOT NULL DEFAULT 'yellow';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dailyGoal" INTEGER NOT NULL DEFAULT 20,
ADD COLUMN     "lastStudiedAt" TIMESTAMP(3),
ADD COLUMN     "streak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "xp" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "StudySession" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "cardsReviewed" INTEGER NOT NULL DEFAULT 0,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "StudySession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StudySession_userId_idx" ON "StudySession"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StudySession_userId_date_key" ON "StudySession"("userId", "date");

-- AddForeignKey
ALTER TABLE "StudySession" ADD CONSTRAINT "StudySession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
