import { NextRequest } from "next/server";
import { db } from "@/lib/prisma";
import { validateCronRequest, createCronResponse } from "@/lib/actions/auth";

export async function GET(request: NextRequest) {
  // Validate cron request
  const authError = validateCronRequest(request);
  if (authError) return authError;

  try {
    // Calculate timeout threshold (24 hours ago by default, configurable)
    const timeoutHours = parseInt(process.env.PAYMENT_TIMEOUT_HOURS || "24");
    const timeoutDate = new Date();
    timeoutDate.setHours(timeoutDate.getHours() - timeoutHours);

    // Find pending payments that are older than timeout period
    const expiredPayments = await db.payment.findMany({
      where: {
        status: "PENDING",
        createdAt: {
          lt: timeoutDate,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Log payments to be updated for audit purposes
    const paymentsToUpdate = expiredPayments.map(
      (payment: {
        id: any;
        invoiceNo: any;
        amount: any;
        userId: any;
        user: { email: any };
        createdAt: any;
        paymentMethod: any;
      }) => ({
        id: payment.id,
        invoiceNo: payment.invoiceNo,
        amount: payment.amount,
        userId: payment.userId,
        userEmail: payment.user.email,
        createdAt: payment.createdAt,
        paymentMethod: payment.paymentMethod,
      })
    );

    console.log("Expired payments to be marked as FAILED:", {
      count: paymentsToUpdate.length,
      timeoutHours,
      cutoffDate: timeoutDate.toISOString(),
      payments: paymentsToUpdate,
    });

    // Update expired payments to FAILED status
    const updateResult = await db.payment.updateMany({
      where: {
        status: "PENDING",
        createdAt: {
          lt: timeoutDate,
        },
      },
      data: {
        status: "FAILED",
        updatedAt: new Date(),
      },
    });

    // Optional: Create audit log or notification
    // You could also send emails to users about failed payments here

    // Get summary statistics
    const paymentStats = await db.payment.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    const totalFailedAmount = expiredPayments.reduce(
      (sum: any, payment: { amount: any }) => sum + payment.amount,
      0
    );

    return createCronResponse({
      success: true,
      message: "Payment status update completed successfully",
      results: {
        updatedPayments: updateResult.count,
        totalFailedAmount: totalFailedAmount,
        timeoutHours: timeoutHours,
        cutoffDate: timeoutDate.toISOString(),
        updatedPaymentsList: paymentsToUpdate,
        currentPaymentStats: paymentStats.reduce(
          (
            acc: { [x: string]: any },
            stat: { status: string | number; _count: { status: any } }
          ) => {
            acc[stat.status] = stat._count.status;
            return acc;
          },
          {} as Record<string, number>
        ),
      },
    });
  } catch (error) {
    console.error("Update payment status error:", error);

    return createCronResponse(
      {
        success: false,
        message: "Payment status update failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
}

// Optional: Add method to manually trigger specific payment updates
export async function POST(request: NextRequest) {
  const authError = validateCronRequest(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { paymentIds, newStatus } = body;

    if (!paymentIds || !Array.isArray(paymentIds)) {
      return createCronResponse(
        {
          success: false,
          message: "paymentIds array is required",
        },
        400
      );
    }

    if (!["PENDING", "FAILED", "PAID"].includes(newStatus)) {
      return createCronResponse(
        {
          success: false,
          message: "Invalid status. Must be PENDING, FAILED, or PAID",
        },
        400
      );
    }

    const updateResult = await db.payment.updateMany({
      where: {
        id: {
          in: paymentIds,
        },
      },
      data: {
        status: newStatus,
        updatedAt: new Date(),
      },
    });

    return createCronResponse({
      success: true,
      message: "Manual payment status update completed",
      results: {
        updatedPayments: updateResult.count,
        requestedPaymentIds: paymentIds,
        newStatus: newStatus,
      },
    });
  } catch (error) {
    console.error("Manual payment update error:", error);

    return createCronResponse(
      {
        success: false,
        message: "Manual payment update failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
}
