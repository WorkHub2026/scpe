"use server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
export const submitPasswordRequest = async (
  userId: number,
  reason?: string
) => {
  try {
    const existingRequest = await prisma.passwordResetRequest.findFirst({
      where: {
        userId,
        status: "PENDING",
      },
    });

    if (existingRequest) {
      return existingRequest;
    }

    const req = await prisma.passwordResetRequest.create({
      data: {
        userId,
        reason: reason,
      },
      include: {
        user: true,
      },
    });

    // Notify admins about the new password reset request
    const admins = await prisma.user.findMany({
      where: { role: "Admin" },
      select: { user_id: true },
    });

    await prisma.notification.createMany({
      data: admins.map((admin) => ({
        title: "Password Reset Request",
        message: `${req.user.username} has requested a password change.`,
        sender_id: req.user.user_id,
        receiver_id: admin.user_id,
      })),
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to submit password request");
  }
};

export const adminGetsPasswordRequests = async () => {
  try {
    const requests = await prisma.passwordResetRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            user_id: true,
            email: true,
            username: true,
            ministry: true,
          },
        },
      },
    });

    return requests;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get password requests");
  }
};

export const reviewResetRequest = async (
  requestId: number,
  status: "APPROVED" | "REJECTED",
  adminId: number,
  adminNote?: string
) => {
  try {
    return await prisma.passwordResetRequest.update({
      where: { id: requestId },
      data: {
        status,
        adminNote,
        reviewedBy: adminId,
        reviewedAt: new Date(),
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to review password request");
  }
};

export const adminResetsUserPassword = async (
  userId: number,
  newPassword: string
) => {
  try {
    const hashedPwd = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { user_id: userId },
      data: {
        password_hash: hashedPwd,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to reset user password");
  }
};

export const userHasPendingRequest = async (userId: number) => {
  return prisma.passwordResetRequest.findFirst({
    where: {
      userId: userId,
      status: "PENDING",
    },
  });
};
