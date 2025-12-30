"use server";

import { prisma } from "../prisma";

export const markNotificationAsRead = async (adminId: number) => {
  const resp = await prisma.notification.updateMany({
    where: {
      receiver_id: adminId,
      is_read: false,
    },
    data: {
      is_read: true,
    },
  });
  return resp;
};

export const getNotifications = async (adminId: number) => {
  const resp = await prisma.notification.findMany({
    orderBy: { created_at: "desc" },
    where: {
      receiver_id: adminId,
    },
  });

  return resp;
};
