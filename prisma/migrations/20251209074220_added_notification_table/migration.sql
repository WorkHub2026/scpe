-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "receiver_id" INTEGER NOT NULL,
    "sender_id" INTEGER,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);
