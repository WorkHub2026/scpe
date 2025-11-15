"use server";
// services/notificationService.ts
import { prisma } from "@/lib/prisma";

export async function createNotification(user_id: number, message: string) {
  return prisma.notification.create({ data: { user_id, message } });
}

export async function listNotifications(
  user_id: number,
  { onlyUnread = false } = {}
) {
  const where: any = { user_id };
  if (onlyUnread) where.is_read = false;
  return prisma.notification.findMany({
    where,
    orderBy: { created_at: "desc" },
  });
}

export async function markNotificationRead(notification_id: number) {
  return prisma.notification.update({
    where: { notification_id },
    data: { is_read: true },
  });
}

export async function deleteNotification(notification_id: number) {
  return prisma.notification.delete({ where: { notification_id } });
}
