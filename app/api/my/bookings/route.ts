import { NextResponse } from "next/server";
import { getMyBookings } from "@/lib/actions/my";

export async function GET() {
  try {
    const data = await getMyBookings();
    if (!data.success) {
      return NextResponse.json(data, { status: 401 });
    }
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
