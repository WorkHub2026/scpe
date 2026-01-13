/*
  Warnings:

  - Added the required column `receiver_id` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "receiver_id" INTEGER NOT NULL;
