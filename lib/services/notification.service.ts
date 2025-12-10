"use server";

import { prisma } from "../prisma";

// Fetch all admin notifications (newest first)
export async function fetchNotifications(receiverId: number) {
  try {
    const notifs = await prisma.notification.findMany({
      where: { receiver_id: receiverId },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, notifications: notifs };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export const markNotificationRead = async (id: number) => {
  return prisma.notification.update({
    where: { id },
    data: { read: true },
  });
};
export async function markAllNotificationsAsRead(userId: number) {
  try {
    await prisma.notification.updateMany({
      where: { receiver_id: userId, read: false },
      data: { read: true },
    });

    return { success: true };
  } catch (error) {
    console.error("❌ Failed to mark all as read:", error);
    return { success: false, error: "Failed to update notifications." };
  }
}
