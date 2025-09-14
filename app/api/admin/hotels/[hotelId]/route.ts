import { NextResponse } from "next/server";
import { getHotelById, updateHotel, deleteHotel } from "@/lib/actions/hotels";

// -------------------- PUT (update hotel) --------------------
export async function PUT(
  req: Request,
  { params }: { params: { hotelId: string } }
) {
  try {
    const body = await req.json();
    const data = await updateHotel(params.hotelId, body);
    if (!data.success) {
      return NextResponse.json(data, { status: 401 });
    }
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// -------------------- DELETE (remove hotel) --------------------
export async function DELETE(
  req: Request,
  { params }: { params: { hotelId: string } }
) {
  try {
    const data = await deleteHotel(params.hotelId);
    if (!data.success) {
      return NextResponse.json(data, { status: 401 });
    }
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
