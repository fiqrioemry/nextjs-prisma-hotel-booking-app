import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { createPaymentWithMidtrans, createPaymentWithStripe } from "./payments";
import type { BookForm } from "@/components/hotel-detail/book-room-form";

export type BookingQuery = {
  page: number;
  limit: number;
  sort: "newest" | "oldest";
  status?: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  userId?: string; // admin bisa filter by user
};

// -------------------- CHECK AVAILABILITY --------------------
async function checkAvailability(bookForm: BookForm) {
  const room = await db.room.findUnique({ where: { id: bookForm.roomId } });
  if (!room) throw new Error("Room not found");

  const overlapping = await db.booking.count({
    where: {
      roomId: bookForm.roomId,
      status: { in: ["PENDING", "CONFIRMED"] },
      NOT: {
        OR: [
          { checkOut: { lte: new Date(bookForm.startDate) } },
          { checkIn: { gte: new Date(bookForm.endDate) } },
        ],
      },
    },
  });

  const availableUnits = room.totalUnits - overlapping;
  return {
    availableUnits,
    isAvailable: availableUnits > 0 && availableUnits > bookForm.quantity,
  };
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

// export async function createBookingWithPayment(data: BookForm) {
//   const session = await auth.api.getSession({ headers: await headers() });

//   if (!session)
//     return { success: false, redirectUrl: "/", message: "Unauthorized" };

//   // 1. cek room availability
//   const { isAvailable, availableUnits } = await checkAvailability(data);

//   if (!isAvailable) {
//     return {
//       success: false,
//       message: `Room not available for the selected dates. Available units: ${availableUnits}`,
//     };
//   }

//   // 2. create booking
//   const booking = await db.booking.create({
//     data: {
//       userId: session.user.id,
//       roomId: data.roomId,
//       quantity: data.quantity,
//       checkIn: new Date(data.startDate),
//       checkOut: new Date(data.endDate),
//       status: "PENDING",
//     },
//     include: { room: { include: { hotel: true } } },
//   });

//   // 3. generate payment directly
//   const paymentResult = await createPayment({
//     bookingId: booking.id,
//     paymentMethod: "BANK_TRANSFER",
//   });

//   if (!paymentResult.success) {
//     return { success: false, message: "Failed to create payment" };
//   }

//   return {
//     success: true,
//     data: {
//       id: paymentResult.paymentId,
//       invoiceNo: paymentResult.invoiceNo,
//       redirectUrl: paymentResult.redirectUrl,
//       token: paymentResult.token,
//     },
//     message: "Booking created. Proceed to payment.",
//   };
// }

export async function createBookingWithPayment(data: BookForm) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session)
    return { success: false, redirectUrl: "/", message: "Unauthorized" };

  // 1. cek ketersediaan kamar
  const { isAvailable, availableUnits } = await checkAvailability(data);
  if (!isAvailable) {
    return {
      success: false,
      message: `Room not available for the selected dates. Available units: ${availableUnits}`,
    };
  }

  // 2. create booking
  const booking = await db.booking.create({
    data: {
      userId: session.user.id,
      roomId: data.roomId,
      quantity: data.quantity,
      checkIn: new Date(data.startDate),
      checkOut: new Date(data.endDate),
      status: "PENDING",
    },
    include: { room: { include: { hotel: true } } },
  });

  // 3. generate Midtrans payment
  const paymentResult = await createPaymentWithStripe({
    bookingId: booking.id,
    paymentMethod: "BANK_TRANSFER",
  });

  if (!paymentResult.success) {
    return { success: false, message: "Failed to create payment" };
  }

  console.log(paymentResult);
  return {
    success: true,
    data: {
      id: paymentResult.paymentId,
      invoiceNo: paymentResult.invoiceNo,
      redirectUrl: paymentResult.redirectUrl, // Stripe Checkout URL
      sessionId: paymentResult.sessionId,
    },
    message: "Booking created. Proceed to payment.",
  };
}
