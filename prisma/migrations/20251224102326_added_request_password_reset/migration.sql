/*
  Warnings:

  - You are about to drop the `PasswordChangeRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ResetStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED');

-- DropForeignKey
ALTER TABLE "PasswordChangeRequest" DROP CONSTRAINT "PasswordChangeRequest_userId_fkey";

-- DropTable
DROP TABLE "PasswordChangeRequest";

-- DropEnum
DROP TYPE "PasswordRequestStatus";

-- CreateTable
CREATE TABLE "PasswordResetRequest" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" "ResetStatus" NOT NULL DEFAULT 'PENDING',
    "reason" TEXT,
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" INTEGER,

    CONSTRAINT "PasswordResetRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PasswordResetRequest" ADD CONSTRAINT "PasswordResetRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetRequest" ADD CONSTRAINT "PasswordResetRequest_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
