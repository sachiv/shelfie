import { mkdir, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file received" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = Date.now() + file.name.replaceAll(" ", "_");
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const filepath = path.join(uploadDir, filename);

  try {
    // Create uploads directory if it doesn't exist
    await mkdir(uploadDir, { recursive: true });
    await writeFile(filepath, buffer);
    return NextResponse.json({ success: true, filename });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save file" }, { status: 500 });
  }
}
