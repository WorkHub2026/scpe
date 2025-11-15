"use server";
// services/ministryService.ts
import { prisma } from "@/lib/prisma";

export async function createMinistry(data: {
  name: string;
  description?: string;
  contact_email?: string;
  contact_phone?: string;
}) {
  return prisma.ministry.create({
    data,
  });
}

export async function getMinistryById(ministry_id: number) {
  return prisma.ministry.findUnique({
    where: { ministry_id },
    include: { users: true, documents: true },
  });
}

export async function getMinistryByName(name: string) {
  return prisma.ministry.findUnique({ where: { name } });
}

export async function listMinistries({ skip = 0, take = 50 } = {}) {
  return prisma.ministry.findMany({
    skip,
    take,
    orderBy: { created_at: "desc" },
  });
}

export async function updateMinistry(
  ministry_id: number,
  data: Partial<{
    name: string;
    description: string | null;
    contact_email: string | null;
    contact_phone: string | null;
  }>
) {
  return prisma.ministry.update({
    where: { ministry_id },
    data,
  });
}

export async function deleteMinistry(ministry_id: number) {
  // this will cascade delete documents because of onDelete: Cascade in schema
  return prisma.ministry.delete({ where: { ministry_id } });
}
