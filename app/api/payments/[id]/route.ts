import { NextResponse } from "next/server";
import {
  getPaymentById,
  updatePaymentStatus,
  deletePayment,
} from "@/lib/actions/payments";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const payment = await getPaymentById(params.id);
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }
    return NextResponse.json(payment);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await req.json();
    const result = await updatePaymentStatus(params.id, status);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await deletePayment(params.id);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
