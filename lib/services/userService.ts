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
  role: "Admin" | "Reviewer" | "MinistryUser";
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
  return prisma.user.findUnique({ where: { user_id } });
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
    full_name: string;
    email: string;
    password?: string;
    role?: "Admin" | "Reviewer" | "MinistryUser";
    status?: boolean;
    ministry_id?: number | null;
  }>
) {
  const updateData: any = { ...data };
  if (data.password) {
    updateData.password_hash = await hashPassword(data.password);
    delete updateData.password;
  }
  if (data.email) updateData.email = data.email.toLowerCase();
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
