import { createHmac, timingSafeEqual } from "node:crypto";

export const PAID_ACCESS_COOKIE = "bda_paid_access";
const COOKIE_LIFETIME_SECONDS = 60 * 60 * 24 * 30;
const TOKEN_VERSION = "v1";

function getSigningSecret(): string {
  return process.env.STRIPE_WEBHOOK_SECRET ?? "local-dev-secret-change-me";
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function signPayload(payload: string): string {
  return createHmac("sha256", getSigningSecret()).update(payload).digest("hex");
}

export function createPaidAccessToken(email: string): string {
  const normalized = normalizeEmail(email);
  const expiresAt = Date.now() + COOKIE_LIFETIME_SECONDS * 1000;
  const payload = [TOKEN_VERSION, normalized, String(expiresAt)].join(":");
  const signature = signPayload(payload);
  return [payload, signature].join(":");
}

export function verifyPaidAccessToken(value: string | null | undefined): {
  isValid: boolean;
  email?: string;
} {
  if (!value) {
    return { isValid: false };
  }

  const parts = value.split(":");
  if (parts.length !== 4) {
    return { isValid: false };
  }

  const [version, email, expiresAtRaw, signature] = parts;
  if (version !== TOKEN_VERSION) {
    return { isValid: false };
  }

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
    return { isValid: false };
  }

  const payload = [version, email, expiresAtRaw].join(":");
  const expectedSignature = signPayload(payload);
  const expectedBuffer = Buffer.from(expectedSignature);
  const providedBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== providedBuffer.length) {
    return { isValid: false };
  }

  if (!timingSafeEqual(expectedBuffer, providedBuffer)) {
    return { isValid: false };
  }

  return { isValid: true, email };
}

export function paidAccessCookieOptions(): {
  httpOnly: boolean;
  sameSite: "lax";
  secure: boolean;
  path: string;
  maxAge: number;
} {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_LIFETIME_SECONDS
  };
}
