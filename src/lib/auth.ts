import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE = "session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30; // 30 days

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(userId: number): Promise<string> {
  return new SignJWT({ sub: String(userId) })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<number | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.sub !== "string") return null;
    const userId = Number(payload.sub);
    return Number.isFinite(userId) ? userId : null;
  } catch {
    return null;
  }
}

// Secure by default. Only opt out (env COOKIE_SECURE=false) for local testing
// over plain HTTP against a host Chromium doesn't treat as a trustworthy
// origin — e.g. the Android emulator's 10.0.2.2, which (unlike "localhost")
// gets no secure-cookie exception, so a Secure cookie set over it is silently
// dropped and every subsequent request looks unauthenticated.
const SESSION_COOKIE_SECURE = process.env.COOKIE_SECURE !== "false";

export { SESSION_COOKIE, SESSION_COOKIE_SECURE, SESSION_DURATION_SECONDS };
