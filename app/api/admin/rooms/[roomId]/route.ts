import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { getRoomById, updateRoom, deleteRoom } from "@/lib/actions/rooms";

// -------------------- GET ROOM BY ID --------------------
export async function GET(
  req: Request,
  context: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await context.params;

  try {
    const { searchParams } = new URL(req.url);
    const checkIn = searchParams.get("checkIn")
      ? new Date(searchParams.get("checkIn")!)
      : undefined;
    const checkOut = searchParams.get("checkOut")
      ? new Date(searchParams.get("checkOut")!)
      : undefined;

    const room = await getRoomById(roomId, checkIn, checkOut);

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json(room);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await context.params;

  const session = await auth.api.getSession({ headers: req.headers });

  if (!session || session?.user?.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const body = await req.json();
    const result = await updateRoom(roomId, body);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await context.params;
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session || session?.user?.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const result = await deleteRoom(roomId);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
