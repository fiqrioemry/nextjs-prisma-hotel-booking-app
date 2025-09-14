import { NextResponse } from "next/server";
import { getRooms, createRoom, type RoomsParams } from "@/lib/actions/rooms";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const query: RoomsParams = {
    q: searchParams.get("q") || "",
    sort: (searchParams.get("sort") as "newest" | "oldest") || "newest",
    page: parseInt(searchParams.get("page") || "1", 10),
    limit: parseInt(searchParams.get("limit") || "10", 10),
    id: searchParams.get("id") || undefined,
  };

  try {
    const data = await getRooms(query);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
