import crypto from "crypto";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY as string;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      order_id,
      transaction_status,
      payment_type,
      gross_amount,
      status_code,
      signature_key,
    } = body;

    // -------------------- 1. Validasi signature --------------------
    const raw = order_id + status_code + gross_amount + MIDTRANS_SERVER_KEY;
    const expectedSig = crypto.createHash("sha512").update(raw).digest("hex");
    if (expectedSig !== signature_key) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    // -------------------- 2. Update Payment & Booking --------------------
    if (
      transaction_status === "settlement" ||
      transaction_status === "capture"
    ) {
      // Payment sukses
      await db.$transaction(async (tx) => {
        const payment = await tx.payment.update({
          where: { id: order_id },
          data: {
            status: "PAID",
            metadata: body,
            paymentMethod: payment_type?.toUpperCase() || "BANK_TRANSFER",
          },
          include: { booking: true },
        });

        if (payment.bookingId) {
          await tx.booking.update({
            where: { id: payment.bookingId },
            data: { status: "CONFIRMED" },
          });
        }
      });
    } else if (
      transaction_status === "expire" ||
      transaction_status === "cancel"
    ) {
      // Payment gagal
      await db.payment.update({
        where: { id: order_id },
        data: {
          status: "FAILED",
          paymentMethod: payment_type?.toUpperCase() || "BANK_TRANSFER",
        },
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("Midtrans Webhook error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
