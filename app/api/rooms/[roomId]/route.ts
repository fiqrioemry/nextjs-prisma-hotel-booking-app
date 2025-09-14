import { NextResponse } from "next/server";
import { getRoomById, updateRoom, deleteRoom } from "@/lib/actions/rooms";

// -------------------- GET ROOM BY ID --------------------
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const checkIn = searchParams.get("checkIn")
      ? new Date(searchParams.get("checkIn")!)
      : undefined;
    const checkOut = searchParams.get("checkOut")
      ? new Date(searchParams.get("checkOut")!)
      : undefined;

    const room = await getRoomById(params.id, checkIn, checkOut);

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json(room);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// -------------------- UPDATE ROOM --------------------
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.formData();
    const data: any = {
      name: body.get("name") || undefined,
      description: body.get("description") || undefined,
      facilities: body.get("facilities")
        ? JSON.parse(body.get("facilities") as string)
        : undefined,
      price: body.get("price") ? Number(body.get("price")) : undefined,
      capacity: body.get("capacity") ? Number(body.get("capacity")) : undefined,
      totalUnits: body.get("totalUnits")
        ? Number(body.get("totalUnits"))
        : undefined,
      images: body.getAll("images") as (File | string)[],
    };
    const result = await updateRoom(params.id, data);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// -------------------- DELETE ROOM --------------------
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await deleteRoom(params.id);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
