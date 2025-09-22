import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { createRoom } from "@/lib/actions/rooms";

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session || session?.user?.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const data = await createRoom(body);
    if (!data.success) {
      return NextResponse.json(data, { status: 400 });
    }
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
