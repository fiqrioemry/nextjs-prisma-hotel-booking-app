import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";

export async function getMyBookings() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false, message: "Unauthorized" };

  const bookings = await db.booking.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      room: { include: { hotel: true, images: true } },
      payment: true,
    },
  });

  return { success: true, data: bookings };
}

export async function getMyPayments() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false, message: "Unauthorized" };

  const payments = await db.payment.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      booking: { include: { room: { include: { hotel: true } } } },
    },
  });

  return { success: true, data: payments };
}
