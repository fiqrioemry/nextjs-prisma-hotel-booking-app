import { NextResponse } from "next/server";
import {
  getBookings,
  type BookingQuery,
  createBookingWithPayment,
} from "@/lib/actions/bookings";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const query: BookingQuery = {
    sort: (searchParams.get("sort") as "newest" | "oldest") || "newest",
    status: searchParams.get("status") as BookingQuery["status"],
    page: parseInt(searchParams.get("page") || "1", 10),
    limit: parseInt(searchParams.get("limit") || "10", 10),
    userId: searchParams.get("userId") || undefined,
  };

  try {
    const data = await getBookings(query);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await createBookingWithPayment({
      roomId: body.roomId,
      startDate: body.startDate,
      endDate: body.endDate,
      quantity: body.quantity,
    });
    return NextResponse.json(result);
  } catch (err: any) {
    console.log(err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
