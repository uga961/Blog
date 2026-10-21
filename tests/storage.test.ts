import { describe, it, expect } from "vitest";
import {
  validateImageUpload,
  generateSafeFilename,
} from "@/lib/storage";

describe("Storage & Image Validation", () => {
  it("accepts valid PNG image buffer and returns proper extension", () => {
    // PNG magic bytes header: 89 50 4E 47
    const buffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0x01]);
    const res = validateImageUpload(buffer, "image/png", "diagram.png");
    expect(res.valid).toBe(true);
    expect(res.extension).toBe(".png");
  });

  it("accepts valid JPEG image buffer and returns proper extension", () => {
    // JPEG magic bytes header: FF D8
    const buffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
    const res = validateImageUpload(buffer, "image/jpeg", "photo.jpg");
    expect(res.valid).toBe(true);
    expect(res.extension).toBe(".jpg");
  });

  it("rejects unsupported MIME types", () => {
    const buffer = Buffer.from("executable payload or script");
    const res = validateImageUpload(buffer, "application/x-sh", "script.sh");
    expect(res.valid).toBe(false);
    expect(res.error).toContain("Unsupported image format");
  });

  it("rejects files exceeding 5MB limit", () => {
    // 5.1 MB buffer
    const largeBuffer = Buffer.alloc(5.1 * 1024 * 1024);
    const res = validateImageUpload(largeBuffer, "image/png", "big.png");
    expect(res.valid).toBe(false);
    expect(res.error).toContain("exceeds the 5MB limit");
  });

  it("generates safe, hash-based unpredictable filenames", () => {
    const buffer = Buffer.from("sample image content");
    const filename1 = generateSafeFilename(buffer, ".webp");
    const filename2 = generateSafeFilename(buffer, ".webp");

    expect(filename1.endsWith(".webp")).toBe(true);
    expect(filename1).not.toContain("sample");
    expect(filename1).toMatch(/^\d+-[a-f0-9]{16}\.webp$/);
  });
});
