import { NextResponse } from "next/server";
import { getPayments, type PaymentParams } from "@/lib/actions/payments";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const query: PaymentParams = {
    sort: (searchParams.get("sort") as "newest" | "oldest") || "newest",
    status: (searchParams.get("status") as PaymentParams["status"]) || "ALL",
    page: parseInt(searchParams.get("page") || "1", 10),
    limit: parseInt(searchParams.get("limit") || "10", 10),
    q: searchParams.get("q") || "",
  };

  try {
    const data = await getPayments(query);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
