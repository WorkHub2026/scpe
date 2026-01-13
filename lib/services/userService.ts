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
}) {
  const password_hash = await hashPassword(data.password);
  const created = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email.toLowerCase(),
      password_hash,
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
      data: { password_hash: hashedPassword },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
