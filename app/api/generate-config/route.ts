import archiver from "archiver";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { PassThrough } from "node:stream";

import { generateConfigBundle } from "@/lib/config-templates";
import { hasPaidCookie, paywallCookieName } from "@/lib/lemonsqueezy";
import { accessibilityAssessmentSchema, type GeneratedConfigFile } from "@/types/accessibility";

export const runtime = "nodejs";

async function zipFiles(files: GeneratedConfigFile[]): Promise<Buffer> {
  const archive = archiver("zip", { zlib: { level: 9 } });
  const output = new PassThrough();
  const chunks: Buffer[] = [];

  const bufferPromise = new Promise<Buffer>((resolve, reject) => {
    output.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    output.on("end", () => resolve(Buffer.concat(chunks)));
    output.on("error", reject);
    archive.on("error", reject);
  });

  archive.pipe(output);

  files.forEach((file) => {
    archive.append(file.content, { name: file.path });
  });

  await archive.finalize();
  return bufferPromise;
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const accessCookie = cookieStore.get(paywallCookieName)?.value;

  if (!hasPaidCookie(accessCookie)) {
    return new NextResponse("Purchase required.", { status: 402 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return new NextResponse("Invalid JSON payload.", { status: 400 });
  }

  const parsed = accessibilityAssessmentSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid assessment payload.",
        issues: parsed.error.issues
      },
      { status: 400 }
    );
  }

  const bundle = generateConfigBundle(parsed.data);
  const zipBuffer = await zipFiles(bundle.files);
  const zipBytes = new Uint8Array(zipBuffer);

  return new NextResponse(zipBytes, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${bundle.filename}"`,
      "X-Setup-Checklist": Buffer.from(JSON.stringify(bundle.setupChecklist), "utf8").toString("base64")
    }
  });
}
