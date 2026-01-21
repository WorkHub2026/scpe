"use server";
import * as fs from "fs";
import path from "path";
import mammoth from "mammoth";

import { prisma } from "../prisma";

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

export const createPolicy = async (data: {
  title: string;
  file: File;
  created_by: number;
}) => {
  try {
    if (!data.file) throw new Error("No file uploaded");

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", "policy");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const fileName = `${Date.now()}-${data.file.name}`;
    const filePath = path.join(uploadDir, fileName);

    // Save file
    const buffer = Buffer.from(await data.file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Save record
    const resp = await prisma.policy.create({
      data: {
        title: data.title,
        file_path: `/uploads/policy/${fileName}`, // ✅ FIXED
        created_by: data.created_by,
      },
    });

    return {
      success: true,
      message: "Created Successfully",
      data: resp,
    };
  } catch (err: any) {
    console.log("❌ Error at creating policy", err.message);
    return {
      success: false,
      message: err.message,
    };
  }
};

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

  // ✅ FIX: avoid path duplication
  const filePath = path.join(process.cwd(), "public", policy.file_path);

  // ✅ SAFETY CHECK (prevents ENOENT)
  try {
    await fs.promises.access(filePath);
  } catch {
    throw new Error(`File not found: ${filePath}`);
  }

  let previewContent = "";

  if (filePath.endsWith(".docx")) {
    const result = await mammoth.convertToHtml({ path: filePath });
    previewContent = result.value;
  } else if (filePath.endsWith(".txt")) {
    previewContent = await fs.promises.readFile(filePath, "utf-8");
  }

  return {
    ...policy,
    previewContent,
  };
}
