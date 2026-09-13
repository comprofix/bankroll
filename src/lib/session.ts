import "server-only";
import { cookies } from "next/headers";

import { SESSION_COOKIE, verifySessionToken } from "./auth";

export async function getCurrentUserId(): Promise<number | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireUserId(): Promise<number> {
  const userId = await getCurrentUserId();
  if (userId === null) {
    throw new Error("Not authenticated");
  }
  return userId;
}
