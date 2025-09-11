import { NextResponse } from "next/server";
import { getRooms, createRoom, type RoomsParams } from "@/lib/actions/rooms";

// -------------------- GET ROOMS --------------------
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const query: RoomsParams = {
    q: searchParams.get("q") || "",
    sort: (searchParams.get("sort") as "newest" | "oldest") || "newest",
    page: parseInt(searchParams.get("page") || "1", 10),
    limit: parseInt(searchParams.get("limit") || "10", 10),
    hotelId: searchParams.get("hotelId") || undefined,
  };

  try {
    const data = await getRooms(query);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// -------------------- CREATE ROOM --------------------
export async function POST(req: Request) {
  try {
    const body = await req.formData();
    const data = {
      hotelId: body.get("hotelId") as string,
      name: body.get("name") as string,
      description: body.get("description") as string,
      facilities: JSON.parse(body.get("facilities") as string),
      price: Number(body.get("price")),
      capacity: Number(body.get("capacity")),
      totalUnits: Number(body.get("totalUnits")),
      images: body.getAll("images") as File[],
    };
    const result = await createRoom(data);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
