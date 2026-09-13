"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";
import { requireUserId } from "@/lib/session";

export async function updatePassword(_prevState: string | undefined, formData: FormData) {
  const userId = await requireUserId();

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (newPassword !== confirmPassword) {
    return "New passwords do not match.";
  }
  if (newPassword.length < 8) {
    return "New password must be at least 8 characters.";
  }

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
    return "Current password is incorrect.";
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await db.update(users).set({ passwordHash }).where(eq(users.id, userId));

  return "Password updated.";
}
