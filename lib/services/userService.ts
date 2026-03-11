"use server";

// services/userService.ts
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  verifyPassword,
  signJwt,
  userToTokenPayload,
} from "@/lib/auth";

/** Create a new user (Admin/Reviewer/MinistryUser).
 *  password is plain text here and will be hashed.
 */
export async function createUser(data: {
  username: string;
  email: string;
  password: string;
  role: "Admin" | "MinistryUser";
  ministry_id?: number | null;
  must_change_password?: boolean;
  temp_password_expires?: Date | null;
}) {
  const password_hash = await hashPassword(data.password);
  const created = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email.toLowerCase(),
      password_hash,
      must_change_password: data.must_change_password ?? false,
      temp_password_expires: data.temp_password_expires ?? null,
      role: data.role,
      ministry_id: data.ministry_id ?? null,
    },
  });
  return created;
}

export async function getUserById(user_id: number) {
  return prisma.user.findFirst({ where: { user_id } });
}

export async function listUsers() {
  return prisma.user.findMany({
    orderBy: { created_at: "desc" },
    include: { ministry: true },
  });
}

export async function updateUser(
  user_id: number,
  data: Partial<{
    password?: string;
    must_change_password?: boolean;
    temp_password_expires?: Date | null;
  }>
) {
  const updateData: any = { ...data };
  if (data.password) {
    updateData.password_hash = await hashPassword(data.password);
    delete updateData.password;
  }
  return prisma.user.update({
    where: { user_id },
    data: updateData,
  });
}

export async function deleteUser(user_id: number) {
  return prisma.user.delete({ where: { user_id } });
}

/** LOGIN - returns { user, token } or throws */
export async function loginUser(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { username },
  });
  if (!user) throw new Error("Invalid credentials");

  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) throw new Error("Invalid credentials");

  if (
    user.must_change_password &&
    user.temp_password_expires &&
    user.temp_password_expires.getTime() < Date.now()
  ) {
    throw new Error("Temporary password expired. Contact an admin.");
  }

  // update last login
  await prisma.user.update({
    where: { user_id: user.user_id },
    data: { last_login: new Date() },
  });

  const token = signJwt(userToTokenPayload(user));
  // remove password_hash before returning
  const { password_hash, ...safeUser } = user as any;
  return { user: safeUser, token };
}

export async function changeUserPassword(params: {
  user_id: number;
  currentPassword: string;
  newPassword: string;
}) {
  const user = await prisma.user.findUnique({
    where: { user_id: params.user_id },
  });
  if (!user) throw new Error("User not found");

  const ok = await verifyPassword(params.currentPassword, user.password_hash);
  if (!ok) throw new Error("Current password is incorrect");

  const password_hash = await hashPassword(params.newPassword);
  const updated = await prisma.user.update({
    where: { user_id: params.user_id },
    data: {
      password_hash,
      must_change_password: false,
      temp_password_expires: null,
    },
  });

  const { password_hash: _ph, ...safeUser } = updated as any;
  return safeUser;
}

export async function adminSetTemporaryPassword(params: {
  user_id: number;
  temporaryPassword: string;
  expiresInHours?: number;
}) {
  const expiresInHours = params.expiresInHours ?? 24;
  const password_hash = await hashPassword(params.temporaryPassword);
  await prisma.user.update({
    where: { user_id: params.user_id },
    data: {
      password_hash,
      must_change_password: true,
      temp_password_expires: new Date(Date.now() + expiresInHours * 60 * 60 * 1000),
    },
  });
  return { success: true };
}

export async function resetPasswordByUsername(
  user_id: number,
  newPass: string
) {
  try {
    // 1. Check if user exists
    const user = await prisma.user.findFirst({
      where: { user_id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // 2. Hash the new password
    const hashedPassword = await hashPassword(newPass);

    // 3. Update the database
    await prisma.user.update({
      where: { user_id },
      data: {
        password_hash: hashedPassword,
        must_change_password: true,
        temp_password_expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
