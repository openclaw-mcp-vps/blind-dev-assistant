import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { setPaidAccessCookie } from "@/lib/auth";

const payloadSchema = z.object({
  email: z.string().email()
});

type PurchaseRecord = { email: string };

function hasPurchase(email: string): boolean {
  const filePath = join(process.cwd(), "data", "purchases.json");
  if (!existsSync(filePath)) {
    return false;
  }

  try {
    const content = readFileSync(filePath, "utf8");
    const records = JSON.parse(content) as PurchaseRecord[];
    return records.some((record) => record.email === email.toLowerCase().trim());
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = payloadSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }

  if (!hasPurchase(parsed.data.email)) {
    return Response.json(
      {
        error:
          "No completed purchase found for this email yet. If checkout finished in the last minute, try again shortly."
      },
      { status: 404 }
    );
  }

  await setPaidAccessCookie(parsed.data.email);

  return Response.json({ status: "ok" });
}
