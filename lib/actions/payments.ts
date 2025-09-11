import crypto from "crypto";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";

const MIDTRANS_URL = process.env.MIDTRANS_URL as string;
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY as string;

// -------------------- TYPES --------------------
export type PaymentQuery = {
  sort: "newest" | "oldest";
  paymentStatus: "ALL" | "PENDING" | "PAID" | "FAILED";
  page: number;
  limit: number;
  userId?: string;
};

// -------------------- GET PAYMENTS --------------------
export async function getPayments(query: PaymentQuery) {
  const { sort, paymentStatus, page, limit, userId } = query;
  const skip = (page - 1) * limit;

  const where: any = {
    ...(paymentStatus !== "ALL" && { status: paymentStatus }),
    ...(userId && { userId }),
  };

  const payments = await db.payment.findMany({
    where,
    orderBy: { createdAt: sort === "oldest" ? "asc" : "desc" },
    skip,
    take: limit,
    include: {
      user: true,
      booking: true,
    },
  });

  const total = await db.payment.count({ where });

  return {
    data: payments,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// -------------------- GET PAYMENT BY ID --------------------
export async function getPaymentById(id: string) {
  return db.payment.findUnique({
    where: { id },
    include: {
      user: true,
      booking: true,
    },
  });
}

// -------------------- CREATE PAYMENT (User bayar booking) --------------------

type CreatePaymentData = {
  bookingId: string;
  amount?: number; // opsional, bisa dihitung otomatis dari booking
  tax?: number;
  paymentMethod: "QRIS" | "CASH" | "BANK_TRANSFER";
};

export async function createPayment(data: CreatePaymentData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return {
      success: false,
      error: "Session expired, please login again",
    };
  }

  const booking = await db.booking.findUnique({
    where: { id: data.bookingId },
    include: { room: true },
  });
  if (!booking) {
    return { success: false, error: "Booking not found" };
  }
  if (booking.status !== "PENDING") {
    return { success: false, error: "Booking is not in pending state" };
  }

  // Hitung amount: jika tidak dikirim, ambil dari room.price * nights
  const nights = Math.ceil(
    (booking.checkOut.getTime() - booking.checkIn.getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const baseAmount = data.amount || booking.room.price * nights;
  const tax = data.tax || 0;
  const grossAmount = baseAmount + tax;

  const paymentId = crypto.randomUUID();

  // Generate invoice number
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
  const countToday = await db.payment.count({
    where: {
      createdAt: {
        gte: new Date(today.setHours(0, 0, 0, 0)),
        lte: new Date(),
      },
    },
  });
  const runningNumber = String(countToday + 1).padStart(5, "0");
  const invoiceNo = `INV-${dateStr}-${runningNumber}`;

  // Insert payment PENDING
  const payment = await db.payment.create({
    data: {
      id: paymentId,
      userId: session.user.id,
      bookingId: data.bookingId,
      invoiceNo,
      amount: baseAmount,
      tax,
      status: "PENDING",
      paymentMethod: data.paymentMethod,
    },
  });

  // Prepare Midtrans payload
  const payload = {
    transaction_details: {
      order_id: paymentId,
      gross_amount: grossAmount,
    },
    item_details: [
      {
        id: booking.room.id,
        price: booking.room.price,
        quantity: nights,
        name: `${booking.room.name} (${nights} night${nights > 1 ? "s" : ""})`,
      },
    ],
    customer_details: {
      first_name: session.user.name || "User",
      email: session.user.email,
    },
    credit_card: { secure: true },
  };

  // Call Midtrans API
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
    throw new Error(
      midtransData.error_messages?.join(", ") || "Midtrans API failed"
    );
  }

  // Update paymentUrl in DB
  await db.payment.update({
    where: { id: paymentId },
    data: {
      paymentUrl: midtransData.redirect_url,
      metadata: midtransData,
    },
  });

  return {
    success: true,
    message: "Payment created successfully, complete the payment to proceed",
    paymentId,
    invoiceNo,
    redirectUrl: midtransData.redirect_url,
    token: midtransData.token,
  };
}

// -------------------- UPDATE PAYMENT STATUS (Admin / Webhook) --------------------
export async function updatePaymentStatus(
  id: string,
  status: "PENDING" | "PAID" | "FAILED"
) {
  const updated = await db.payment.update({
    where: { id },
    data: { status },
  });

  return { success: true, payment: updated };
}

// -------------------- DELETE PAYMENT (opsional admin) --------------------
export async function deletePayment(id: string) {
  await db.payment.delete({ where: { id } });
  return { success: true, message: "Payment deleted" };
}
