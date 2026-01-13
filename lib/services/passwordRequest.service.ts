"use server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
export const submitPasswordRequest = async (
  ministry: string,
  reason?: string
) => {
  try {
    const req = await prisma.passwordResetRequest.create({
      data: {
        ministry,
        reason: reason,
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
        message: `${req.ministry} has requested a password change.`,
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
  adminId: number
) => {
  try {
    return await prisma.passwordResetRequest.update({
      where: { id: requestId },
      data: {
        status,
        reviewedBy: adminId,
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
