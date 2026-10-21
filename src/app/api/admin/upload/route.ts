import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { uploadFile } from "@/lib/storage";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    await requireAuth();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided in form data" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadFile(buffer, file.type, file.name);

    // Save record to Media database table
    try {
      await prisma.media.create({
        data: {
          filename: result.filename,
          url: result.url,
          mimeType: result.mimeType,
          size: result.size,
        },
      });
    } catch {
      // Non-fatal if media table creation fails
    }

    return NextResponse.json(result, { status: 201 });
  } catch (err: unknown) {
    const isAuth = err instanceof Error && err.message === "Unauthorized";
    const message = err instanceof Error ? err.message : "Failed to upload image";
    return NextResponse.json(
      { error: message },
      { status: isAuth ? 401 : 400 }
    );
  }
}
