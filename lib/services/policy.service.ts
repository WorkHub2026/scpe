"use server";
import fs from "fs";
import path from "path";
import mammoth from "mammoth";

import { prisma } from "../prisma";
import { supabaseAdmin } from "../supabase/server";

export const getAllPolicy = async () => {
  try {
    const resp = await prisma.policy.findMany();
    return {
      success: true,
      data: resp,
    };
  } catch (err: any) {
    console.log("❌ Error at fetching policy:", err);
    return {
      success: false,
      message: err.message,
    };
  }
};
export async function createPolicyAction(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const createdBy = Number(formData.get("created_by"));
    const file = formData.get("file") as File | null;

    if (!file || !title) {
      return { success: false, message: "Missing required fields" };
    }

    // Generate unique file name
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;

    // Upload file to Supabase bucket
    const { data, error: uploadError } = await supabaseAdmin.storage
      .from("policies") // your bucket name
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError || !data) {
      console.error("❌ Supabase upload error:", uploadError);
      return { success: false, message: "Failed to upload file" };
    }

    // Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("policies")
      .getPublicUrl(fileName);

    const filePath = publicUrlData.publicUrl;

    // Save policy record in database
    const policy = await prisma.policy.create({
      data: {
        title,
        file_path: filePath,
        created_by: createdBy,
      },
    });

    return { success: true, policy };
  } catch (error) {
    console.error("❌ Create policy error:", error);
    return { success: false, message: "Server error" };
  }
}

export const deletePolicy = async (id: number) => {
  try {
    const deletedPolicy = await prisma.policy.delete({
      where: {
        id: id,
      },
    });
    return {
      success: true,
      data: deletedPolicy,
      message: "Deleted Successfully",
    };
  } catch (err: any) {
    console.error("❌ Policy deleting failed:", err);
    return {
      success: true,
      message: err.message,
    };
  }
};

export async function getPolicyById(id: number) {
  const policy = await prisma.policy.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          username: true,
        },
      },
    },
  });

  if (!policy) return null;

  let previewContent = "";
  if (policy.file_path.toLowerCase().endsWith(".docx")) {
    try {
      const res = await fetch(policy.file_path);
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
    ...policy,
    previewContent,
  };
}
