import { NextResponse } from "next/server";
import { getMyBookings } from "@/lib/actions/my";

export async function GET(req: Request) {
  try {
    const data = await getMyBookings();
    return NextResponse.json(data);
  } catch (err: Error | any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
