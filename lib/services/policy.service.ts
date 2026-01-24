"use server";
import fs from "fs";
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

export async function createPolicyAction(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const createdBy = Number(formData.get("created_by"));
    const file = formData.get("file") as File | null;

    if (!file || !title) {
      return { success: false, message: "Missing required fields" };
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "policies");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const policy = await prisma.policy.create({
      data: {
        title,
        file_path: `/uploads/policies/${fileName}`,
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
