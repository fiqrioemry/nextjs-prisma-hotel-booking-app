import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { getHotels, createHotel } from "@/lib/actions/hotels";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const query = {
    q: searchParams.get("q") || "",
    location: searchParams.get("location") || "",
    sort: (searchParams.get("sort") as "newest" | "oldest") || "newest",
    page: parseInt(searchParams.get("page") || "1", 10),
    limit: parseInt(searchParams.get("limit") || "10", 10),
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
  };

  try {
    const data = await getHotels(query);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
