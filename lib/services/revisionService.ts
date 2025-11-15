"use server";
// services/revisionService.ts
import { prisma } from "@/lib/prisma";

export async function createRevision(data: {
  document_id: number;
  revised_by: number;
  old_version_path?: string | null;
  new_version_path?: string | null;
  notes?: string | null;
}) {
  const rev = await prisma.revision.create({ data });
  await prisma.activityLog.create({
    data: {
      user_id: data.revised_by,
      action: "Created revision",
      document_id: data.document_id,
      details: data.notes ?? null,
    },
  });
  return rev;
}

export async function listRevisionsForDocument(document_id: number) {
  return prisma.revision.findMany({
    where: { document_id },
    orderBy: { revised_at: "desc" },
  });
}

export async function deleteRevision(revision_id: number) {
  return prisma.revision.delete({ where: { revision_id } });
}
