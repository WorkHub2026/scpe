// lib/auth.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);
const JWT_SECRET = process.env.JWT_SECRET ?? "replace_me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export function signJwt(payload: Record<string, any>) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyJwt<T = any>(token: string): T {
  return jwt.verify(token, JWT_SECRET) as T;
}

/** Minimal safe user payload for token */
export function userToTokenPayload(user: Partial<User>) {
  return {
    user_id: user.user_id,
    email: user.email,
    role: user.role,
    ministry_id: (user as any).ministry_id ?? null,
  };
}

export type UserRole = "Admin" | "MinistryUser";

export interface AppUser {
  id: number;
  email: string;
  role: UserRole;
  ministry_id?: number | null;
}

export function isAdmin(user: AppUser) {
  return user.role === "Admin";
}

export function isMinistryUser(user: AppUser) {
  return user.role === "MinistryUser";
}
