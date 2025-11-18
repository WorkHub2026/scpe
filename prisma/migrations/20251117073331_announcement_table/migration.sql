/*
  Warnings:

  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_user_id_fkey";

-- DropTable
DROP TABLE "Notification";

-- CreateTable
CREATE TABLE "Announcement" (
    "announcement_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image_path" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("announcement_id")
);

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
