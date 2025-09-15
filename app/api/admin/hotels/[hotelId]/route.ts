import {
  updateHotel,
  deleteHotel,
  adminGetHotelById,
} from "@/lib/actions/hotels";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET HOTEL BY ID
export async function GET(
  req: Request,
  context: { params: Promise<{ hotelId: string }> }
) {
  const { hotelId } = await context.params;

  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await adminGetHotelById(hotelId);
    if (!result) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

//  UPDATE HOTEL
export async function PUT(
  req: Request,
  context: { params: Promise<{ hotelId: string }> }
) {
  const { hotelId } = await context.params;

  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = await updateHotel(hotelId, body);
    if (!data.success) {
      return NextResponse.json(data, { status: 401 });
    }
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

//  DELETE HOTEL
export async function DELETE(
  req: Request,
  context: { params: Promise<{ hotelId: string }> }
) {
  const { hotelId } = await context.params;

  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await deleteHotel(hotelId);
    if (!data.success) {
      return NextResponse.json(data, { status: 401 });
    }
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
