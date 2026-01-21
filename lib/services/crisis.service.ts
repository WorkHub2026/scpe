"use server";

import { promises as fs } from "fs";
import path from "path";
import mammoth from "mammoth";
import { prisma } from "../prisma";
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

export const createCrisis = async (data: {
  title: string;
  file: File;
  created_by: number;
  priority: "LOW" | "MEDIUM" | "HIGH";
}) => {
  try {
    if (!data.file) throw new Error("No file uploaded");

    const uploadDir = path.join(process.cwd(), "public", "uploads", "crisis");

    // Ensure /uploads/crisis folder exists
    await fs.mkdir(uploadDir, { recursive: true });

    // ✅ SANITIZE filename (FIX)
    const safeName = data.file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${Date.now()}-${safeName}`;

    const filePath = path.join(uploadDir, fileName);

    const buffer = Buffer.from(await data.file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // Save relative path only
    const resp = await prisma.crisis.create({
      data: {
        title: data.title,
        priority: data.priority,
        file_path: `/uploads/crisis/${fileName}`,
        created_by: data.created_by,
      },
    });

    return {
      success: true,
      message: "Created Successfully",
      data: resp,
    };
  } catch (err: any) {
    console.error("❌ Error creating crisis:", err.message);
    return {
      success: false,
      message: err.message,
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

  // ✅ FIX: avoid path duplication
  const filePath = path.join(process.cwd(), "public", crisis.file_path);

  // ✅ SAFETY CHECK (prevents ENOENT)
  try {
    await fs.access(filePath);
  } catch {
    throw new Error(`File not found: ${filePath}`);
  }

  let previewContent = "";

  if (filePath.endsWith(".docx")) {
    const result = await mammoth.convertToHtml({ path: filePath });
    previewContent = result.value;
  } else if (filePath.endsWith(".txt")) {
    previewContent = await fs.readFile(filePath, "utf-8");
  }

  return {
    ...crisis,
    previewContent,
  };
}
