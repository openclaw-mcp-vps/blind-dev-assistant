import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const ACCESS_COOKIE_NAME = "bda_access";

function base64url(input: string): string {
  return Buffer.from(input).toString("base64url");
}

function unbase64url(input: string): string {
  return Buffer.from(input, "base64url").toString("utf8");
}

function getSecret() {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("LEMON_SQUEEZY_WEBHOOK_SECRET is not configured");
  }
  return secret;
}

export function createAccessToken(email: string): string {
  const payload = {
    email,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 31
  };
  const encodedPayload = base64url(JSON.stringify(payload));
  const signature = createHmac("sha256", getSecret()).update(encodedPayload).digest("base64url");
  return `${encodedPayload}.${signature}`;
}

export function verifyAccessToken(token: string): { email: string; exp: number } | null {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expected = createHmac("sha256", getSecret()).update(encodedPayload).digest("base64url");
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (providedBuffer.length !== expectedBuffer.length) return null;
  if (!timingSafeEqual(providedBuffer, expectedBuffer)) return null;

  try {
    const parsed = JSON.parse(unbase64url(encodedPayload)) as { email: string; exp: number };
    if (Date.now() > parsed.exp) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function hasPaidAccess(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAccessToken(token) !== null;
}

export async function setPaidAccessCookie(email: string): Promise<void> {
  const cookieStore = await cookies();
  const token = createAccessToken(email);
  cookieStore.set(ACCESS_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: 60 * 60 * 24 * 31,
    path: "/"
  });
}
