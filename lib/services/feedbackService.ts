"use server";
// services/feedbackService.ts
import { prisma } from "@/lib/prisma";

export async function createFeedback(data: {
  document_id: number;
  reviewer_id: number;
  feedback_text: string;
  action_required?: boolean;
}) {
  const fb = await prisma.feedback.create({ data });
  await prisma.activityLog.create({
    data: {
      user_id: data.reviewer_id,
      action: "Added feedback",
      document_id: data.document_id,
      details: data.feedback_text,
    },
  });
  return fb;
}

export async function listFeedbackForDocument(document_id: number) {
  return prisma.feedback.findMany({
    where: { document_id },
    orderBy: { feedback_date: "desc" },
    include: { reviewer: true },
  });
}

export async function deleteFeedback(feedback_id: number) {
  return prisma.feedback.delete({ where: { feedback_id } });
}
