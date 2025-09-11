import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { createPayment } from "./payments";

export type BookingQuery = {
  page: number;
  limit: number;
  sort: "newest" | "oldest";
  status?: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  userId?: string; // admin bisa filter by user
};

// -------------------- CHECK AVAILABILITY --------------------
async function checkAvailability(
  roomId: string,
  checkIn: Date,
  checkOut: Date
) {
  const room = await db.room.findUnique({ where: { id: roomId } });
  if (!room) throw new Error("Room not found");

  const overlapping = await db.booking.count({
    where: {
      roomId,
      status: { in: ["PENDING", "CONFIRMED"] },
      NOT: {
        OR: [{ checkOut: { lte: checkIn } }, { checkIn: { gte: checkOut } }],
      },
    },
  });

  const availableUnits = room.totalUnits - overlapping;
  return { availableUnits, isAvailable: availableUnits > 0 };
}

// -------------------- GET BOOKINGS --------------------
export async function getBookings(query: BookingQuery) {
  const { page, limit, sort, status, userId } = query;
  const skip = (page - 1) * limit;

  const where: any = {
    ...(status && { status }),
    ...(userId && { userId }),
  };

  const bookings = await db.booking.findMany({
    where,
    orderBy: { createdAt: sort === "oldest" ? "asc" : "desc" },
    skip,
    take: limit,
    include: {
      user: true,
      room: { include: { hotel: true } },
      payment: true,
    },
  });

  const total = await db.booking.count({ where });

  return {
    data: bookings,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// -------------------- GET BOOKING BY ID --------------------
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

// -------------------- CREATE BOOKING --------------------
type CreateBookingData = {
  roomId: string;
  checkIn: Date;
  checkOut: Date;
};

export async function createBooking(data: CreateBookingData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  // 1. cek ketersediaan
  const { isAvailable, availableUnits } = await checkAvailability(
    data.roomId,
    data.checkIn,
    data.checkOut
  );

  if (!isAvailable) {
    return {
      success: false,
      message: `Room not available for the selected dates. Available units: ${availableUnits}`,
    };
  }

  // 2. buat booking
  const booking = await db.booking.create({
    data: {
      userId: session.user.id,
      roomId: data.roomId,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      status: "PENDING",
    },
    include: {
      room: { include: { hotel: true } },
    },
  });

  return { success: true, booking, message: "Booking created successfully" };
}

// -------------------- UPDATE BOOKING STATUS --------------------
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

// -------------------- DELETE BOOKING (admin only) --------------------
export async function deleteBooking(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "ADMIN") {
    return { success: false, message: "Unauthorized" };
  }

  await db.booking.delete({ where: { id } });
  return { success: true, message: "Booking deleted successfully" };
}

export async function createBookingWithPayment(data: CreateBookingData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false, message: "Unauthorized" };

  // 1. cek room availability
  const { isAvailable, availableUnits } = await checkAvailability(
    data.roomId,
    data.checkIn,
    data.checkOut
  );

  if (!isAvailable) {
    return {
      success: false,
      message: `Room not available. Available units: ${availableUnits}`,
    };
  }

  // 2. create booking
  const booking = await db.booking.create({
    data: {
      userId: session.user.id,
      roomId: data.roomId,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      status: "PENDING",
    },
    include: { room: { include: { hotel: true } } },
  });

  // 3. generate payment directly
  const paymentResult = await createPayment({
    bookingId: booking.id,
    paymentMethod: "BANK_TRANSFER",
  });

  if (!paymentResult.success) {
    return { success: false, message: "Failed to create payment" };
  }

  return {
    success: true,
    booking,
    payment: {
      id: paymentResult.paymentId,
      invoiceNo: paymentResult.invoiceNo,
      redirectUrl: paymentResult.redirectUrl,
      token: paymentResult.token,
    },
    message: "Booking created. Proceed to payment.",
  };
}
