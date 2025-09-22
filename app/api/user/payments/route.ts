import { NextResponse } from "next/server";
import { getMyPayments } from "@/lib/actions/my";

export async function GET(req: Request) {
  try {
    const data = await getMyPayments();
    return NextResponse.json(data);
  } catch (err: Error | any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
