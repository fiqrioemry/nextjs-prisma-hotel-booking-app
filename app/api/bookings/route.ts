import { NextResponse } from "next/server";
import { createBookingWithPayment } from "@/lib/actions/bookings";

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
