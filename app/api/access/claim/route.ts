import { NextResponse } from "next/server";
import { z } from "zod";

import {
  PAID_ACCESS_COOKIE,
  createPaidAccessToken,
  paidAccessCookieOptions
} from "@/lib/auth";
import { hasPaidAccess } from "@/lib/lemonsqueezy";

const payloadSchema = z.object({
  email: z.string().email()
});

export async function POST(request: Request): Promise<NextResponse> {
  const parsed = payloadSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Provide a valid checkout email." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();
  const paid = await hasPaidAccess(email);

  if (!paid) {
    return NextResponse.json(
      {
        error:
          "No paid subscription found for that email yet. Confirm the email and retry in 30 seconds."
      },
      { status: 403 }
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(PAID_ACCESS_COOKIE, createPaidAccessToken(email), paidAccessCookieOptions());
  return response;
}
