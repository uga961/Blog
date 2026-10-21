import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  let dbStatus = "connected";

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    dbStatus = "disconnected";
  }

  return NextResponse.json(
    {
      status: dbStatus === "connected" ? "healthy" : "degraded",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: dbStatus,
    },
    { status: dbStatus === "connected" ? 200 : 503 }
  );
}
