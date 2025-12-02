"use server";

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

export const createPolicy = async (data: any) => {
  try {
    const resp = await prisma.policy.create({
      data: data,
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
