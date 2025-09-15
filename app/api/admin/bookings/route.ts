import { NextResponse } from "next/server";
import { getBookings } from "@/lib/actions/bookings";
import { BookingParams } from "@/lib/types/bookings";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const params: BookingParams = {
    sort: (searchParams.get("sort") as "newest" | "oldest") || "newest",
    status: searchParams.get("status") as BookingParams["status"],
    page: parseInt(searchParams.get("page") || "1", 10),
    limit: parseInt(searchParams.get("limit") || "10", 10),
    q: searchParams.get("q") || "",
  };

  try {
    const data = await getBookings(params);
    return NextResponse.json(data);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
