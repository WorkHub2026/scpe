"use server";

import fs from "fs";
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
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${data.file.name}`;
    const filePath = path.join(uploadDir, fileName);

    const buffer = Buffer.from(await data.file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Save to database
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
    where: { id: id },
  });

  if (!crisis) return null;

  const filePath = path.join(process.cwd(), "public/crisis", crisis.file_path);

  let previewContent = "";
  if (filePath.endsWith(".docx")) {
    const result = await mammoth.convertToHtml({ path: filePath });
    previewContent = result.value; // sanitized HTML
  } else if (filePath.endsWith(".txt")) {
    previewContent = fs.readFileSync(filePath, "utf-8");
  }

  return {
    ...crisis,
    previewContent,
  };
}
