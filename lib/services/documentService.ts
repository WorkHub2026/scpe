"use server";
// services/documentService.ts
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";
import mammoth from "mammoth";

export async function createDocument(data: {
  title: string;
  type: "Report" | "Script";
  file: File;
  status?: "Submitted" | "Under_Review" | "Accepted" | "Denied" | "Revised";
  submitted_by?: number | null;
  ministry_id?: number | null;
  reviewed_by?: number | null;
}) {
  try {
    if (!data.file) throw new Error("No file uploaded");

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    // Save file to disk
    const fileName = `${Date.now()}-${data.file.name}`; // prepend timestamp to avoid collisions
    const filePath = path.join(uploadDir, fileName);
    const buffer = Buffer.from(await data.file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Store document record in database
    const newDoc = await prisma.document.create({
      data: {
        title: data.title,
        type: data.type,
        file_path: `/uploads/${fileName}`, // store relative path for frontend
        status: "Submitted",
        submitted_by: data.submitted_by ?? null,
        ministry_id: data.ministry_id ?? null,
        reviewed_by: data.reviewed_by ?? null,
      },
      include: { ministry: true, submittedBy: true },
    });

    return {
      success: true,
      document: newDoc,
    };
  } catch (err: any) {
    console.error("❌ Document creation failed:", err);
    return { success: false, error: err.message };
  }
}

export async function getDocumentById(id: number) {
  const doc = await prisma.document.findUnique({
    where: { document_id: id },
    include: {
      ministry: true,
      submittedBy: true,
      feedbacks: {
        // include feedbacks
        include: {
          reviewer: true, // optional: include reviewer info
        },
      },
    },
  });

  if (!doc) return null;

  const filePath = path.join(process.cwd(), "public", doc.file_path);

  let previewContent = "";
  if (filePath.endsWith(".docx")) {
    const result = await mammoth.convertToHtml({ path: filePath });
    previewContent = result.value; // sanitized HTML
  } else if (filePath.endsWith(".txt")) {
    previewContent = fs.readFileSync(filePath, "utf-8");
  }

  return {
    ...doc,
    previewContent,
    // make sure nested objects exist to avoid undefined errors
    ministry: doc.ministry || null,
    submittedBy: doc.submittedBy || null,
    feedbacks: doc.feedbacks || [],
  };
}

export async function listDocuments({
  skip = 0,
  take = 50,
  ministry_id,
  status,
  submitted_by,
}: {
  skip?: number;
  take?: number;
  ministry_id?: number;
  status?: string;
  submitted_by?: number;
} = {}) {
  const where: any = {};
  if (ministry_id) where.ministry_id = ministry_id;
  if (status) where.status = status;
  if (submitted_by) where.submitted_by = submitted_by;

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

export async function updateDocument(
  document_id: number,
  data: Partial<{
    title: string;
    file_path: string | null;
    type: "Report" | "Script";
    ministry_id: number | null;
    feedbacks: Array<any>;
    status: "Submitted" | "Under_Review" | "Accepted" | "Denied" | "Revised";
  }>
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
  reviewed_by?: number | null
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
  notes?: string
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
  action_required = false
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

// get document statistics
