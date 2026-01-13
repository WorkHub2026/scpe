/*
  Warnings:

  - You are about to drop the column `receiver_id` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `sender_id` on the `Notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "receiver_id",
DROP COLUMN "sender_id";

-- AlterTable
ALTER TABLE "PasswordResetRequest" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
