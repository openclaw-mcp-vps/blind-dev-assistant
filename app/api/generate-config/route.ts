import archiver from "archiver";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { PassThrough } from "node:stream";

import { PAID_ACCESS_COOKIE, verifyPaidAccessToken } from "@/lib/auth";
import { assessmentSchema } from "@/lib/assessment-schema";
import { buildConfigArtifacts } from "@/lib/config-templates";

export const runtime = "nodejs";

async function zipArtifacts(
  files: Array<{ path: string; content: string }>
): Promise<Buffer> {
  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = new PassThrough();
  const chunks: Buffer[] = [];

  const finalized = new Promise<Buffer>((resolve, reject) => {
    stream.on("data", (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });

    stream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    stream.on("error", reject);
    archive.on("error", reject);
  });

  archive.pipe(stream);

  for (const file of files) {
    archive.append(file.content, { name: file.path });
  }

  await archive.finalize();
  return finalized;
}

export async function POST(request: Request): Promise<Response> {
  const cookieStore = await cookies();
  const paidCookie = cookieStore.get(PAID_ACCESS_COOKIE)?.value;
  const session = verifyPaidAccessToken(paidCookie);

  if (!session.isValid) {
    return NextResponse.json(
      { error: "Paid access is required before generating configuration packages." },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = assessmentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Assessment payload is invalid.",
        details: parsed.error.flatten()
      },
      { status: 400 }
    );
  }

  const files = buildConfigArtifacts(parsed.data);
  const zipBuffer = await zipArtifacts(files);

  return new Response(new Uint8Array(zipBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": "attachment; filename=blind-dev-assistant-config.zip",
      "Cache-Control": "no-store"
    }
  });
}
