import Stripe from "stripe";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";

import type { BookForm } from "@/components/hotel-detail/book-room-form";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-08-27.basil",
});

const MIDTRANS_URL = process.env.MIDTRANS_URL as string;
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY as string;

export type BookingParams = {
  q?: string;
  page: number;
  limit: number;
  sort: "newest" | "oldest";
  status?: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "ALL";
};

async function checkAvailability(bookForm: BookForm) {
  const room = await db.room.findUnique({ where: { id: bookForm.roomId } });

  if (!room) throw new Error("Room not found");

  // count the bookings that overlap with the requested date range
  const overlapping = await db.booking.count({
    where: {
      roomId: room.id,
      status: { in: ["PENDING", "CONFIRMED"] },
      NOT: {
        OR: [
          { checkOut: { lte: new Date(bookForm.startDate) } },
          { checkIn: { gte: new Date(bookForm.endDate) } },
        ],
      },
    },
  });

  // calculate available units
  const availableUnits = room.totalUnits - overlapping;
  return {
    availableUnits,
    isAvailable: availableUnits > 0 && availableUnits > bookForm.quantity,
  };
}

export async function getBookings(params: BookingParams) {
  const { page, limit, sort, status, q } = params;
  const skip = (page - 1) * limit;

  const currentPage = parseInt(page.toString());
  const limitInt = parseInt(limit.toString());

  // build where clause
  const whereClause: any = {};

  if (status && status !== "ALL") {
    whereClause.AND.push({ status });
  }

  if (q && q.trim()) {
    whereClause.OR = [
      { name: { contains: q.trim(), mode: "insensitive" } },
      { email: { contains: q.trim(), mode: "insensitive" } },
    ];
  }

  // sorting
  const orderBy =
    sort === "oldest"
      ? { createdAt: "asc" as const }
      : { createdAt: "desc" as const };

  // Query bookings + total
  const [result, total] = await Promise.all([
    db.booking.findMany({
      where: whereClause,
      orderBy,
      skip,
      take: limitInt,
      include: {
        user: true,
        room: { include: { hotel: true, images: true } },
      },
    }),
    db.booking.count({ where: whereClause }),
  ]);

  const bookings = result.map((booking) => ({
    id: booking.id,
    user: {
      id: booking.user.id,
      name: booking.user.name,
      email: booking.user.email,
    },
    room: {
      id: booking.room.id,
      hotelId: booking.room.hotelId,
      facilities: booking.room.facilities,
      name: booking.room.name,
      description: booking.room.description,
      price: booking.room.price,
      capacity: booking.room.capacity,
      totalUnits: booking.room.totalUnits,
      images: booking.room.images.map((img) => img.url)[0] || null,
      hotelName: booking.room.hotel.name,
    },
    quantity: booking.quantity,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
  }));

  return {
    data: bookings,
    meta: {
      page: currentPage,
      limit: limitInt,
      total,
      totalPages: Math.ceil(total / limitInt),
    },
  };
}

export async function getBookingById(id: string) {
  return db.booking.findUnique({
    where: { id },
    include: {
      user: true,
      room: { include: { hotel: true, images: true } },
      payment: true,
    },
  });
}

export async function updateBookingStatus(
  id: string,
  status: "CONFIRMED" | "CANCELLED" | "COMPLETED"
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "ADMIN") {
    return { success: false, message: "Unauthorized" };
  }

  const updated = await db.booking.update({
    where: { id },
    data: { status },
  });

  return { success: true, booking: updated };
}

export async function deleteBooking(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "ADMIN") {
    return { success: false, message: "Unauthorized" };
  }

  await db.booking.delete({ where: { id } });

  return { success: true, message: "Booking deleted successfully" };
}

export async function createBookingWithPayment(data: BookForm) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { success: false, redirectUrl: "/", message: "Unauthorized" };
  }

  // check room availability
  const { isAvailable, availableUnits } = await checkAvailability(data);
  if (!isAvailable) {
    return {
      success: false,
      message: `Room not available for the selected dates. Available units: ${availableUnits}`,
    };
  }

  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");

  try {
    // start transaction to handle rollback booking + payment
    const result = await db.$transaction(async (tx) => {
      // 1. Create booking
      const booking = await tx.booking.create({
        data: {
          roomId: data.roomId,
          userId: session.user.id,
          quantity: data.quantity,
          checkIn: new Date(data.startDate),
          checkOut: new Date(data.endDate),
          status: "PENDING",
        },
        include: { room: true },
      });

      // 2. Hitung invoice number
      const countToday = await tx.payment.count({
        where: {
          createdAt: {
            gte: new Date(today.setHours(0, 0, 0, 0)),
            lte: new Date(),
          },
        },
      });
      const runningNumber = String(countToday + 1).padStart(5, "0");
      const invoiceNo = `INV-${dateStr}-${runningNumber}`;
      const paymentId = crypto.randomUUID();

      // 3. Create payment (PENDING)
      await tx.payment.create({
        data: {
          id: paymentId,
          userId: session.user.id,
          bookingId: booking.id,
          invoiceNo,
          amount: booking.room.price * data.quantity,
          tax: 0,
          status: "PENDING",
          paymentMethod: "BANK_TRANSFER",
        },
      });

      return { booking, invoiceNo, paymentId };
    });

    // 4. Stripe checkout session (di luar transaction DB)
    const nights = Math.ceil(
      (result.booking.checkOut.getTime() - result.booking.checkIn.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "idr",
            product_data: {
              name: `${result.booking.room.name} (${nights} night${
                nights > 1 ? "s" : ""
              })`,
            },
            unit_amount: result.booking.room.price * 100, // in cents
          },
          quantity: nights,
        },
      ],
      mode: "payment",
      customer_email: session.user.email,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/user/payments`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/user/payments`,
      metadata: {
        bookingId: result.booking.id,
        paymentId: result.paymentId,
      },
    });

    return {
      success: true,
      data: {
        bookingId: result.booking.id,
        paymentId: result.paymentId,
        invoiceNo: result.invoiceNo,
        redirectUrl: checkoutSession.url,
        sessionId: checkoutSession.id,
      },
      message: "Booking created. Proceed to payment.",
    };
  } catch (error) {
    console.error("Booking+Payment failed:", error);
    return {
      success: false,
      message: "Failed to create booking with payment.",
    };
  }
}

export async function createBookingWithMidtrans(data: BookForm) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { success: false, redirectUrl: "/", message: "Unauthorized" };
  }

  // check room availability
  const { isAvailable, availableUnits } = await checkAvailability(data);
  if (!isAvailable) {
    return {
      success: false,
      message: `Room not available for the selected dates. Available units: ${availableUnits}`,
    };
  }

  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");

  try {
    // start transaction to handle rollback booking + payment
    const result = await db.$transaction(async (tx) => {
      // 1. Create booking
      const booking = await tx.booking.create({
        data: {
          userId: session.user.id,
          roomId: data.roomId,
          quantity: data.quantity,
          checkIn: new Date(data.startDate),
          checkOut: new Date(data.endDate),
          status: "PENDING",
        },
        include: { room: true },
      });

      // 2.  count invoice number
      const countToday = await tx.payment.count({
        where: {
          createdAt: {
            gte: new Date(today.setHours(0, 0, 0, 0)),
            lte: new Date(),
          },
        },
      });
      const runningNumber = String(countToday + 1).padStart(5, "0");
      const invoiceNo = `INV-${dateStr}-${runningNumber}`;
      const paymentId = crypto.randomUUID();

      // 3. Create payment record (pending)
      await tx.payment.create({
        data: {
          id: paymentId,
          userId: session.user.id,
          bookingId: booking.id,
          invoiceNo,
          amount: booking.room.price * data.quantity,
          tax: 0,
          status: "PENDING",
          paymentMethod: "BANK_TRANSFER",
        },
      });

      return { booking, invoiceNo, paymentId };
    });

    //  Midtrans call (outside DB transaction)
    const nights = Math.ceil(
      (result.booking.checkOut.getTime() - result.booking.checkIn.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const grossAmount = result.booking.room.price * nights;

    const payload = {
      transaction_details: {
        order_id: result.paymentId,
        gross_amount: grossAmount,
      },
      item_details: [
        {
          id: result.booking.room.id,
          price: result.booking.room.price,
          quantity: nights,
          name: `${result.booking.room.name} (${nights} night${
            nights > 1 ? "s" : ""
          })`,
        },
      ],
      customer_details: {
        first_name: session.user.name || "User",
        email: session.user.email,
      },
      credit_card: { secure: true },
    };

    const midtransRes = await fetch(MIDTRANS_URL, {
      method: "POST",
      headers: {
        Authorization:
          "Basic " + Buffer.from(MIDTRANS_SERVER_KEY + ":").toString("base64"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const midtransData = await midtransRes.json();
    if (!midtransRes.ok) {
      //  rollback booking + payment if error from midtrans
      await db.booking.update({
        where: { id: result.booking.id },
        data: { status: "CANCELLED" },
      });
      await db.payment.update({
        where: { id: result.paymentId },
        data: { status: "FAILED" },
      });
      throw new Error(
        midtransData.error_messages?.join(", ") || "Midtrans API failed"
      );
    }

    //
    await db.payment.update({
      where: { id: result.paymentId },
      data: {
        paymentUrl: midtransData.redirect_url,
        metadata: midtransData,
      },
    });

    return {
      success: true,
      data: {
        bookingId: result.booking.id,
        paymentId: result.paymentId,
        invoiceNo: result.invoiceNo,
        redirectUrl: midtransData.redirect_url,
        token: midtransData.token,
      },
      message: "Booking created. Proceed to payment.",
    };
  } catch (err) {
    console.error("Midtrans booking failed:", err);
    return { success: false, message: "Failed to create booking with payment" };
  }
}
