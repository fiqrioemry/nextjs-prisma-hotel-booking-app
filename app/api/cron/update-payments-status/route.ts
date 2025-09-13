import { db } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { validateCronRequest, createCronResponse } from "@/lib/actions/auth";

export async function GET(request: NextRequest) {
  const authError = validateCronRequest(request);
  if (authError) return authError;

  try {
    const timeoutHours = parseInt(process.env.PAYMENT_TIMEOUT_HOURS || "1");
    const timeoutDate = new Date();
    timeoutDate.setHours(timeoutDate.getHours() - timeoutHours);

    // Cari payment yang expired
    const expiredPayments = await db.payment.findMany({
      where: {
        status: "PENDING",
        createdAt: { lt: timeoutDate },
      },
      include: { booking: true, user: true },
    });

    if (expiredPayments.length === 0) {
      return createCronResponse({
        success: true,
        message: "No expired payments found",
        results: { updatedPayments: 0 },
      });
    }

    // Jalankan transaction
    const result = await db.$transaction(async (tx) => {
      // Update semua payment → FAILED
      const updatedPayments = await tx.payment.updateMany({
        where: {
          id: { in: expiredPayments.map((p) => p.id) },
        },
        data: {
          status: "FAILED",
          updatedAt: new Date(),
        },
      });

      // Update booking terkait → CANCELED
      const updatedBookings = await tx.booking.updateMany({
        where: {
          id: {
            in: expiredPayments
              .map((p) => p.bookingId)
              .filter((id): id is string => !!id),
          },
          status: "PENDING",
        },
        data: {
          status: "CANCELLED",
          updatedAt: new Date(),
        },
      });

      return { updatedPayments, updatedBookings };
    });

    return createCronResponse({
      success: true,
      message: "Expired payments & bookings updated",
      results: {
        updatedPayments: result.updatedPayments.count,
        updatedBookings: result.updatedBookings.count,
      },
    });
  } catch (error) {
    console.error("Cron GET error:", error);
    return createCronResponse(
      { success: false, message: "Cron GET failed", error: String(error) },
      500
    );
  }
}

export async function POST(request: NextRequest) {
  const authError = validateCronRequest(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { paymentIds, newStatus } = body;

    if (!paymentIds || !Array.isArray(paymentIds)) {
      return createCronResponse(
        { success: false, message: "paymentIds array is required" },
        400
      );
    }

    if (!["PENDING", "FAILED", "PAID"].includes(newStatus)) {
      return createCronResponse(
        { success: false, message: "Invalid status" },
        400
      );
    }

    const result = await db.$transaction(async (tx) => {
      // Update payment
      const updatedPayments = await tx.payment.updateMany({
        where: { id: { in: paymentIds } },
        data: { status: newStatus, updatedAt: new Date() },
      });

      let updatedBookings = { count: 0 };

      // Kalau newStatus = FAILED → cancel booking juga
      if (newStatus === "FAILED") {
        const relatedPayments = await tx.payment.findMany({
          where: { id: { in: paymentIds } },
          select: { bookingId: true },
        });

        updatedBookings = await tx.booking.updateMany({
          where: {
            id: {
              in: relatedPayments
                .map((p) => p.bookingId)
                .filter((id): id is string => !!id),
            },
            status: "PENDING",
          },
          data: { status: "CANCELLED", updatedAt: new Date() },
        });
      }

      return { updatedPayments, updatedBookings };
    });

    return createCronResponse({
      success: true,
      message: "Manual update completed",
      results: {
        updatedPayments: result.updatedPayments.count,
        updatedBookings: result.updatedBookings.count,
        newStatus,
      },
    });
  } catch (error) {
    console.error("Cron POST error:", error);
    return createCronResponse(
      { success: false, message: "Cron POST failed", error: String(error) },
      500
    );
  }
}
