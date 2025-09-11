import { NextResponse } from "next/server";
import {
  getHotels,
  createHotel,
  type hotelsParams,
} from "@/lib/actions/hotels";

// -------------------- GET (list hotels) --------------------
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const query: hotelsParams = {
    q: searchParams.get("q") || "",
    sort: (searchParams.get("sort") as "newest" | "oldest") || "newest",
    page: parseInt(searchParams.get("page") || "1", 10),
    limit: parseInt(searchParams.get("limit") || "10", 10),
  };

  try {
    const data = await getHotels(query);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// -------------------- POST (create hotel) --------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await createHotel(body);
    if (!data.success) {
      return NextResponse.json(data, { status: 401 });
    }
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
