import { NextResponse } from "next/server";
import {
  getPayments,
  createPayment,
  type PaymentQuery,
} from "@/lib/actions/payments";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const query: PaymentQuery = {
    sort: (searchParams.get("sort") as "newest" | "oldest") || "newest",
    paymentStatus:
      (searchParams.get("paymentStatus") as PaymentQuery["paymentStatus"]) ||
      "ALL",
    page: parseInt(searchParams.get("page") || "1", 10),
    limit: parseInt(searchParams.get("limit") || "10", 10),
    userId: searchParams.get("userId") || undefined,
  };

  try {
    const data = await getPayments(query);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await createPayment(body);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
