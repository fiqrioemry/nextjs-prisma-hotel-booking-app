import { db } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { GoogleSheetsService } from "@/lib/google-sheets";
import { validateCronRequest, createCronResponse } from "@/lib/actions/auth";

export async function GET(request: NextRequest) {
  // Validate cron request
  const authError = validateCronRequest(request);
  if (authError) return authError;

  try {
    const googleSheets = new GoogleSheetsService();

    // 1. Backup Users
    const users = await db.user.findMany({
      include: {
        _count: {
          select: {
            payments: true,
            sessions: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const usersData = [
      [
        "ID",
        "Name",
        "Email",
        "Email Verified",
        "Role",
        "Balance",
        "Payments Count",
        "Transactions Count",
        "Created At",
        "Updated At",
      ],
      ...users.map((user: any) => [
        user.id,
        user.name,
        user.email,
        user.emailVerified ? "Yes" : "No",
        user.role,
        user.balance?.amount || 0,
        user._count.payments,
        user._count.transactions,
        user.createdAt.toISOString(),
        user.updatedAt.toISOString(),
      ]),
    ];

    await googleSheets.createSheetIfNotExists("Users");
    await googleSheets.clearAndUpdateSheet("Users", usersData);

    // 2. Backup Payments
    const payments = await db.payment.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const paymentsData = [
      [
        "ID",
        "User Name",
        "User Email",
        "Invoice No",
        "Amount",
        "Tax",
        "Status",
        "Payment Method",
        "Payment URL",
        "Created At",
        "Updated At",
      ],
      ...payments.map((payment: any) => [
        payment.id,
        payment.user.name,
        payment.user.email,
        payment.invoiceNo,
        payment.amount,
        payment.tax,
        payment.status,
        payment.paymentMethod,
        payment.paymentUrl || "",
        payment.createdAt.toISOString(),
        payment.updatedAt.toISOString(),
      ]),
    ];

    await googleSheets.createSheetIfNotExists("Payments");
    await googleSheets.clearAndUpdateSheet("Payments", paymentsData);

    return createCronResponse({
      success: true,
      message: "Database backup completed successfully",
      stats: {
        users: users.length,
        payments: payments.length,
      },
    });
  } catch (error) {
    console.error("Database backup error:", error);

    return createCronResponse(
      {
        success: false,
        message: "Database backup failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
}
