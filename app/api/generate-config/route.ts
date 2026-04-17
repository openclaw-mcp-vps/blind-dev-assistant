import archiver from "archiver";
import { PassThrough } from "node:stream";
import { z } from "zod";
import { hasPaidAccess } from "@/lib/auth";
import { createConfigBundle } from "@/lib/config-templates";

const assessmentSchema = z.object({
  fullName: z.string().min(2),
  workEmail: z.string().email(),
  screenReader: z.enum(["nvda", "jaws", "voiceover", "orca", "other"]),
  operatingSystem: z.enum(["windows", "macos", "linux"]),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
  codingFocus: z.string().min(3),
  audioCues: z.boolean(),
  highVerbosity: z.boolean(),
  customNeeds: z.string().optional().default("")
});

async function zipFiles(files: Array<{ name: string; content: string }>): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const archive = archiver("zip", { zlib: { level: 9 } });
    const stream = new PassThrough();
    const chunks: Buffer[] = [];

    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", (error) => reject(error));

    archive.on("error", (error) => reject(error));
    archive.pipe(stream);

    for (const file of files) {
      archive.append(file.content, { name: file.name });
    }

    archive.finalize().catch(reject);
  });
}

export async function POST(request: Request) {
  const paid = await hasPaidAccess();
  if (!paid) {
    return Response.json({ error: "Paid access required" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = assessmentSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      {
        error: "Invalid assessment payload",
        issues: parsed.error.flatten()
      },
      { status: 400 }
    );
  }

  const generated = createConfigBundle(parsed.data);
  const zipBuffer = await zipFiles([
    {
      name: "settings.json",
      content: JSON.stringify(generated.vscodeSettings, null, 2)
    },
    {
      name: "keybindings.json",
      content: JSON.stringify(generated.keybindings, null, 2)
    },
    {
      name: "terminal-profile.txt",
      content: generated.terminalProfile
    },
    {
      name: "install.sh",
      content: generated.installScript
    },
    {
      name: "README.md",
      content: generated.readme
    }
  ]);

  const binary = new Uint8Array(zipBuffer);

  return new Response(binary, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="blind-dev-assistant-config.zip"'
    }
  });
}
