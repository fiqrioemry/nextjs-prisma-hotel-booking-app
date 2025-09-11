import { NextResponse } from "next/server";
import { getHotelById, updateHotel, deleteHotel } from "@/lib/actions/hotels";

// -------------------- GET (hotel detail) --------------------
export async function GET(
  req: Request,
  { params }: { params: { hotelId: string } }
) {
  try {
    const data = await getHotelById(params.hotelId);
    if (!data) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

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
