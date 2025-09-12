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
        balance: true,
        _count: {
          select: {
            payments: true,
            transactions: true,
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

    // 3. Backup Transactions
    const transactions = await db.transaction.findMany({
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

    const transactionsData = [
      [
        "ID",
        "User Name",
        "User Email",
        "Description",
        "Amount",
        "Transaction Type",
        "Created At",
        "Updated At",
      ],
      ...transactions.map((transaction: any) => [
        transaction.id,
        transaction.user.name,
        transaction.user.email,
        transaction.description,
        transaction.amount,
        transaction.transactionType,
        transaction.createdAt.toISOString(),
        transaction.updatedAt.toISOString(),
      ]),
    ];

    await googleSheets.createSheetIfNotExists("Transactions");
    await googleSheets.clearAndUpdateSheet("Transactions", transactionsData);

    // 4. Backup Balance Summary
    const balances = await db.balance.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { amount: "desc" },
    });

    const balancesData = [
      [
        "User ID",
        "User Name",
        "User Email",
        "Balance Amount",
        "Created At",
        "Updated At",
      ],
      ...balances.map((balance: any) => [
        balance.userId,
        balance.user.name,
        balance.user.email,
        balance.amount,
        balance.createdAt.toISOString(),
        balance.updatedAt.toISOString(),
      ]),
    ];

    await googleSheets.createSheetIfNotExists("Balances");
    await googleSheets.clearAndUpdateSheet("Balances", balancesData);

    return createCronResponse({
      success: true,
      message: "Database backup completed successfully",
      stats: {
        users: users.length,
        payments: payments.length,
        transactions: transactions.length,
        balances: balances.length,
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
