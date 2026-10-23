import { NextResponse } from "next/server";
import { getLiveMusicTrack } from "@/lib/music";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getLiveMusicTrack();
  return NextResponse.json(data);
}
