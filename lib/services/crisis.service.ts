"use server";
import mammoth from "mammoth";
import { prisma } from "../prisma";
import { supabaseAdmin } from "@/lib/supabase/server";
export const getAllCrisis = async () => {
  try {
    const resp: any = await prisma.crisis.findMany();
    return {
      success: true,
      message: "Fetched Successfully",
      crisis: resp,
    };
  } catch (err: any) {
    console.error("❌ Crisis fetching failed:", err);
    return { success: false, error: err.message };
  }
};

export const createCrisis = async (formData: FormData) => {
  try {
    // --------------------------------------------------
    // 1️⃣ Extract & validate form data
    // --------------------------------------------------
    const title = formData.get("title");
    const file = formData.get("file");
    const created_by = formData.get("created_by");
    const priority = formData.get("priority");

    if (!title || typeof title !== "string") {
      throw new Error("Title is required");
    }

    if (!file || !(file instanceof File)) {
      throw new Error("File is required");
    }

    if (!created_by) {
      throw new Error("Created_by is required");
    }

    if (!["LOW", "MEDIUM", "HIGH"].includes(priority as string)) {
      throw new Error("Invalid priority value");
    }

    // --------------------------------------------------
    // 2️⃣ Upload file to Supabase Storage
    // --------------------------------------------------
    const fileExt = file.name.split(".").pop();
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");

    const storagePath = `crisis/${Date.now()}-${crypto.randomUUID()}-${safeFileName}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabaseAdmin.storage
      .from("crisis")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    // --------------------------------------------------
    // 3️⃣ Get public URL
    // --------------------------------------------------
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("crisis")
      .getPublicUrl(storagePath);

    if (!publicUrlData?.publicUrl) {
      throw new Error("Failed to generate public file URL");
    }

    // --------------------------------------------------
    // 4️⃣ Save crisis record in DB
    // --------------------------------------------------
    const crisis = await prisma.crisis.create({
      data: {
        title,
        priority: priority as "LOW" | "MEDIUM" | "HIGH",
        file_path: publicUrlData.publicUrl,
        created_by: Number(created_by),
      },
    });

    // --------------------------------------------------
    // 5️⃣ Return safe response
    // --------------------------------------------------
    return {
      success: true,
      message: "Crisis created successfully",
      data: {
        id: crisis.id,
        title: crisis.title,
        priority: crisis.priority,
        file_path: crisis.file_path,
      },
    };
  } catch (error: any) {
    console.error("❌ createCrisis failed:", error);

    return {
      success: false,
      message: error.message ?? "Failed to create crisis",
    };
  }
};

export const deleteCrisis = async (id: number) => {
  try {
    const deletedCrisis = await prisma.crisis.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Deleted Successfully",
      data: deletedCrisis,
    };
  } catch (err: any) {
    console.error("❌ Crisis deletion failed:", err);
    return { success: false, error: err.message };
  }
};

export async function getCrisisById(id: number) {
  const crisis = await prisma.crisis.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          username: true,
        },
      },
    },
  });

  if (!crisis) return null;

  let previewContent = "";

  if (crisis.file_path?.toLowerCase().endsWith(".docx")) {
    try {
      const res = await fetch(crisis.file_path);
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
  return {
    id: crisis.id,
    title: crisis.title,
    file_path: crisis.file_path,
    priority: crisis.priority,
    created_at: crisis.created_at,
    author: crisis.author ?? null,
    previewContent,
  };
}
