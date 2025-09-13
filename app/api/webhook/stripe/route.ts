import { db } from "@/lib/prisma";
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature") as string;
  const rawBody = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error("Stripe webhook signature error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const paymentId = session.metadata?.paymentId;
    const bookingId = session.metadata?.bookingId;

    if (paymentId) {
      await db.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: paymentId },
          data: {
            status: "PAID",
            metadata: JSON.parse(JSON.stringify(session)),
            paymentMethod: "BANK_TRANSFER",
          },
        });

        if (bookingId) {
          await tx.booking.update({
            where: { id: bookingId },
            data: { status: "CONFIRMED" },
          });
        }
      });
    }
  }

  return NextResponse.json({ received: true });
}
