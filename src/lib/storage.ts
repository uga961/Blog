import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const ALLOWED_MIME_TYPES = new Map<string, string>([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
  ["image/svg+xml", ".svg"],
]);

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export interface UploadResult {
  url: string;
  filename: string;
  mimeType: string;
  size: number;
}

/**
 * Validates uploaded image file buffer, MIME type, and size.
 */
export function validateImageUpload(
  buffer: Buffer,
  mimeType: string,
  originalFilename: string
): { valid: boolean; error?: string; extension: string } {
  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the 5MB limit (${(buffer.length / 1024 / 1024).toFixed(2)}MB)`,
      extension: "",
    };
  }

  const expectedExt = ALLOWED_MIME_TYPES.get(mimeType.toLowerCase());
  if (!expectedExt) {
    return {
      valid: false,
      error: `Unsupported image format (${mimeType}). Allowed formats: JPEG, PNG, WebP, GIF, SVG.`,
      extension: "",
    };
  }

  // Basic magic bytes check for extra security
  if (mimeType === "image/jpeg" && (buffer[0] !== 0xff || buffer[1] !== 0xd8)) {
    return { valid: false, error: "Invalid JPEG image data", extension: "" };
  }
  if (
    mimeType === "image/png" &&
    (buffer[0] !== 0x89 ||
      buffer[1] !== 0x50 ||
      buffer[2] !== 0x4e ||
      buffer[3] !== 0x47)
  ) {
    return { valid: false, error: "Invalid PNG image data", extension: "" };
  }

  return { valid: true, extension: expectedExt };
}

/**
 * Generates an unpredictable, sanitized unique filename based on a SHA-256 hash.
 */
export function generateSafeFilename(buffer: Buffer, extension: string): string {
  const hash = crypto.createHash("sha256").update(buffer).digest("hex").slice(0, 16);
  const timestamp = Date.now();
  return `${timestamp}-${hash}${extension}`;
}

/**
 * Saves file to either local storage (public/uploads) or S3-compatible bucket.
 */
export async function uploadFile(
  buffer: Buffer,
  mimeType: string,
  originalFilename: string
): Promise<UploadResult> {
  const validation = validateImageUpload(buffer, mimeType, originalFilename);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const filename = generateSafeFilename(buffer, validation.extension);
  const provider = (process.env.STORAGE_PROVIDER || "local").toLowerCase();

  if (provider === "s3" && process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID) {
    // S3 / Cloudflare R2 / MinIO storage
    const s3Client = new S3Client({
      region: process.env.S3_REGION || "auto",
      endpoint: process.env.S3_ENDPOINT || undefined,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
      },
    });

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: `uploads/${filename}`,
        Body: buffer,
        ContentType: mimeType,
      })
    );

    const baseUrl = process.env.S3_PUBLIC_URL?.replace(/\/+$/, "") || "";
    const publicUrl = baseUrl
      ? `${baseUrl}/uploads/${filename}`
      : `https://${process.env.S3_BUCKET}.s3.amazonaws.com/uploads/${filename}`;

    return {
      url: publicUrl,
      filename,
      mimeType,
      size: buffer.length,
    };
  }

  // Local filesystem storage
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  const destinationPath = path.join(uploadDir, filename);
  await fs.writeFile(destinationPath, buffer);

  return {
    url: `/uploads/${filename}`,
    filename,
    mimeType,
    size: buffer.length,
  };
}
