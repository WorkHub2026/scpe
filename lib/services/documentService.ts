"use server";

import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase/server";
import mammoth from "mammoth";

export async function createDocument(formData: FormData) {
  try {
    // --------------------------------------------------
    // 1️⃣ Extract & validate input
    // --------------------------------------------------
    const title = formData.get("title");
    const type = formData.get("type");
    const file = formData.get("file");
    const submittedBy = formData.get("submitted_by");
    const ministryId = formData.get("ministry_id");

    if (typeof title !== "string" || !title.trim()) {
      throw new Error("Title is required");
    }

    if (type !== "Report" && type !== "Script") {
      throw new Error("Invalid document type");
    }

    if (!(file instanceof File)) {
      throw new Error("File is required");
    }

    // --------------------------------------------------
    // 2️⃣ Upload file to Supabase Storage
    // --------------------------------------------------
    const extension = file.name.split(".").pop();
    const storagePath = `documents/${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabaseAdmin.storage
      .from("documents")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabaseAdmin.storage
      .from("documents")
      .getPublicUrl(storagePath);

    if (!publicUrlData?.publicUrl) {
      throw new Error("Failed to generate public URL");
    }

    // --------------------------------------------------
    // 3️⃣ Create DB records (transaction)
    // --------------------------------------------------
    const newDoc = await prisma.$transaction(async (tx) => {
      const document = await tx.document.create({
        data: {
          title: title.trim(),
          type,
          status: "Submitted",
          file_path: publicUrlData.publicUrl,
          submitted_by: submittedBy ? Number(submittedBy) : null,
          ministry_id: ministryId ? Number(ministryId) : null,
        },
      });

      await tx.chatThread.create({
        data: {
          document_id: document.document_id,
        },
      });

      return document;
    });

    // --------------------------------------------------
    // 4️⃣ Return safe response
    // --------------------------------------------------
    return {
      success: true,
      document: {
        document_id: newDoc.document_id,
        title: newDoc.title,
        type: newDoc.type,
        status: newDoc.status,
        file_path: newDoc.file_path,
      },
    };
  } catch (error: any) {
    console.error("❌ createDocument failed:", error);
    return {
      success: false,
      error: error.message ?? "Failed to create document",
    };
  }
}

export async function getDocumentById(id: number) {
  if (!id || Number.isNaN(id)) return null;

  // --------------------------------------------------
  // 1️⃣ Fetch document + relations
  // --------------------------------------------------
  const doc = await prisma.document.findUnique({
    where: { document_id: id },
    include: {
      ministry: true,
      submittedBy: true,
      feedbacks: {
        include: {
          reviewer: true,
        },
      },
    },
  });

  if (!doc) return null;

  // --------------------------------------------------
  // 2️⃣ Generate preview (best-effort)
  // --------------------------------------------------
  let previewContent = "";

  if (doc.file_path?.toLowerCase().endsWith(".docx")) {
    try {
      const res = await fetch(doc.file_path);
      if (!res.ok) throw new Error("Fetch failed");

      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const result = await mammoth.convertToHtml({ buffer });
      previewContent = result.value;
    } catch (err) {
      console.error("⚠️ DOCX preview failed:", err);
      previewContent = "";
    }
  }

  // --------------------------------------------------
  // 3️⃣ Normalized response
  // --------------------------------------------------
  return {
    document_id: doc.document_id,
    title: doc.title,
    type: doc.type,
    status: doc.status,
    file_path: doc.file_path,
    submitted_at: doc.submitted_at,

    ministry: doc.ministry ?? null,
    submittedBy: doc.submittedBy ?? null,
    feedbacks: doc.feedbacks ?? [],

    previewContent,
  };
}

export async function listDocuments({
  skip = 0,
  take = 50,
  ministry_id,
  status,
  submitted_by,
  search,
  startDate,
  endDate,
}: {
  skip?: number;
  take?: number;
  ministry_id?: number;
  status?: string;
  submitted_by?: number;
  search?: string;
  startDate?: Date;
  endDate?: Date;
} = {}) {
  const where: any = {};
  if (ministry_id) where.ministry_id = ministry_id;
  if (status) where.status = status;
  if (submitted_by) where.submitted_by = submitted_by;

  // Date filtering
  if (startDate || endDate) {
    where.submitted_at = {};
    if (startDate) {
      where.submitted_at.gte = startDate;
    }
    if (endDate) {
      // Set endDate to end of day
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      where.submitted_at.lte = endOfDay;
    }
  }

  // Search filtering (by title or ministry name)
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { ministry: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  return prisma.document.findMany({
    where,
    skip,
    take,
    orderBy: { submitted_at: "desc" },
    include: {
      ministry: true,
      feedbacks: true,
    },
  });
}

// Get document counts by ministry for a specific time period
export async function getDocumentCountsByMinistry({
  startDate,
  endDate,
}: {
  startDate?: Date;
  endDate?: Date;
} = {}) {
  const where: any = {};

  if (startDate || endDate) {
    where.submitted_at = {};
    if (startDate) {
      where.submitted_at.gte = startDate;
    }
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      where.submitted_at.lte = endOfDay;
    }
  }

  const documents = await prisma.document.findMany({
    where,
    include: {
      ministry: true,
    },
  });

  // Group by ministry and count
  const counts: Record<string, number> = {};
  documents.forEach((doc) => {
    const ministryName = doc.ministry?.name || "Unknown";
    counts[ministryName] = (counts[ministryName] || 0) + 1;
  });

  return Object.entries(counts).map(([name, count]) => ({
    ministry: name,
    count,
  }));
}

export async function updateDocument(
  document_id: number,
  data: Partial<{
    title: string;
    file_path: string | null;
    type: "Report" | "Script";
    ministry_id: number | null;
    feedbacks: Array<any>;
    status: "Submitted" | "Under_Review" | "Accepted" | "Denied" | "Revised";
  }>,
) {
  // Build an update payload that matches Prisma's update input shapes.
  const updateData: any = {};

  if (data.title !== undefined) {
    updateData.title = data.title;
  }

  if (data.type !== undefined) {
    updateData.type = data.type;
  }

  // For nullable scalar fields Prisma expects the FieldUpdateOperations format when setting null.
  if (Object.prototype.hasOwnProperty.call(data, "file_path")) {
    // file_path can be string or null
    updateData.file_path = { set: data.file_path ?? null };
  }

  if (Object.prototype.hasOwnProperty.call(data, "ministry_id")) {
    // ministry_id can be number or null
    updateData.ministry_id = { set: data.ministry_id ?? null };
  }

  return prisma.document.update({
    where: { document_id },
    data: updateData,
  });
}

export async function deleteDocument(document_id: number) {
  // cascade will remove reviews/feedbacks/revisions/logs
  return prisma.document.delete({ where: { document_id } });
}

/** Change status (Submitted, Under_Review, Accepted, Denied, Revised) */
export async function changeDocumentStatus(
  document_id: number,
  status: "Submitted" | "Under_Review" | "Accepted" | "Denied" | "Revised",
  reviewed_by?: number | null,
) {
  return prisma.document.update({
    where: { document_id },
    data: {
      status,
      reviewed_by: reviewed_by ?? undefined,
      reviewed_at:
        status === "Accepted" || status === "Denied" ? new Date() : undefined,
    },
  });
}

/** assign reviewer */
export async function assignReviewer(document_id: number, reviewer_id: number) {
  // create Review record with decision Under_Review
  return prisma.review.create({
    data: {
      document_id,
      reviewer_id,
      decision: "Under_Review",
      comments: null,
    },
  });
}

/** Attach a new revision */
export async function createRevision(
  document_id: number,
  revised_by: number,
  new_version_path?: string,
  old_version_path?: string,
  notes?: string,
) {
  return prisma.revision.create({
    data: {
      document_id,
      revised_by,
      new_version_path: new_version_path ?? null,
      old_version_path: old_version_path ?? null,
      notes: notes ?? null,
    },
  });
}

/** Attach feedback */
export async function createFeedback(
  document_id: number,
  reviewer_id: number,
  feedback_text: string,
  action_required = false,
) {
  return prisma.feedback.create({
    data: {
      document_id,
      reviewer_id,
      feedback_text,
      action_required,
    },
  });
}

/** Log an activity */
export async function createActivityLog(data: {
  user_id?: number | null;
  action: string;
  document_id?: number | null;
  details?: string | null;
}) {
  return prisma.activityLog.create({
    data: {
      user_id: data.user_id ?? null,
      action: data.action,
      document_id: data.document_id ?? null,
      details: data.details ?? null,
    },
  });
}
