import { NextResponse } from "next/server";
import { getRoomTypes } from "@/lib/actions/rooms";

export async function GET(req: Request) {
  try {
    const room = await getRoomTypes();

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json(room);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
