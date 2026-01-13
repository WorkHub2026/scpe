/*
  Warnings:

  - You are about to drop the column `adminNote` on the `PasswordResetRequest` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `PasswordResetRequest` table. All the data in the column will be lost.
  - You are about to drop the column `reviewedAt` on the `PasswordResetRequest` table. All the data in the column will be lost.
  - You are about to drop the column `reviewedBy` on the `PasswordResetRequest` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `PasswordResetRequest` table. All the data in the column will be lost.
  - Added the required column `ministry` to the `PasswordResetRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PasswordResetRequest" DROP CONSTRAINT "PasswordResetRequest_reviewedBy_fkey";

-- DropForeignKey
ALTER TABLE "PasswordResetRequest" DROP CONSTRAINT "PasswordResetRequest_userId_fkey";

-- AlterTable
ALTER TABLE "PasswordResetRequest" DROP COLUMN "adminNote",
DROP COLUMN "createdAt",
DROP COLUMN "reviewedAt",
DROP COLUMN "reviewedBy",
DROP COLUMN "userId",
ADD COLUMN     "ministry" TEXT NOT NULL;
