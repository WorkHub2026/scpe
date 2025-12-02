"use server";

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

export const createCrisis = async (data: any) => {
  try {
    const resp = await prisma.crisis.create({
      data: data,
    });

    return {
      success: true,
      message: "Created Successfully",
      crisis: resp,
    };
  } catch (err: any) {
    console.error("❌ Crisis creation failed:", err);
    return { success: false, error: err.message };
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
