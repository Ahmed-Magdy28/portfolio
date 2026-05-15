import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadImage(file: File): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size exceeds 5MB limit.");
  }

  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new Error(`Unsupported file type: ${ext}. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`);
  }

  // Generate a safe unique filename
  const hash = crypto.randomBytes(16).toString("hex");
  const safeName = `${hash}${ext}`;
  
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  
  const filePath = path.join(uploadDir, safeName);
  const buffer = Buffer.from(await file.arrayBuffer());
  
  await writeFile(filePath, buffer);
  
  return `/uploads/${safeName}`;
}
