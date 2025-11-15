"use server";
// services/activityLogService.ts
import { prisma } from "@/lib/prisma";

export async function logActivity(data: {
  user_id?: number | null;
  action: string;
  document_id?: number | null;
  details?: string | null;
}) {
  return prisma.activityLog.create({ data });
}

export async function listActivityLogs({ skip = 0, take = 100 } = {}) {
  return prisma.activityLog.findMany({
    skip,
    take,
    orderBy: { timestamp: "desc" },
    include: { user: true, document: true },
  });
}
