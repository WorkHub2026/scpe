"use server";
// services/reviewService.ts
import { prisma } from "@/lib/prisma";

/** Create or update a review and set document status based on decision */
export async function createOrUpdateReview(params: {
  document_id: number;
  reviewer_id: number;
  quality_score?: number | null;
  comments?: string | null;
  decision: "Accepted" | "Under_Review" | "Denied";
}) {
  // create review
  const review = await prisma.review.create({
    data: {
      document_id: params.document_id,
      reviewer_id: params.reviewer_id,
      quality_score: params.quality_score ?? null,
      comments: params.comments ?? null,
      decision: params.decision,
    },
  });

  // update document's reviewed_by/reviewed_at/status and log
  await prisma.document.update({
    where: { document_id: params.document_id },
    data: {
      reviewed_by: params.reviewer_id,
      reviewed_at: new Date(),
      status:
        params.decision === "Accepted"
          ? "Accepted"
          : params.decision === "Denied"
          ? "Denied"
          : "Under_Review",
      last_feedback: params.comments ?? undefined,
    },
  });

  await prisma.activityLog.create({
    data: {
      user_id: params.reviewer_id,
      action: `Review: ${params.decision}`,
      document_id: params.document_id,
      details: params.comments ?? undefined,
    },
  });

  return review;
}

export async function getReviewById(review_id: number) {
  return prisma.review.findUnique({ where: { review_id } });
}

export async function listReviewsForDocument(document_id: number) {
  return prisma.review.findMany({
    where: { document_id },
    orderBy: { reviewed_at: "desc" },
    include: { reviewer: true },
  });
}

export async function deleteReview(review_id: number) {
  return prisma.review.delete({ where: { review_id } });
}
