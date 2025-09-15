import { db } from "@/lib/prisma";
import { PaymentParams } from "@/lib/types/payments";

export async function getPayments(params: PaymentParams) {
  const { page, limit, sort, status, q } = params;

  const currentPage = parseInt(page.toString());
  const limitInt = parseInt(limit.toString());
  const skip = (currentPage - 1) * limitInt;

  // build where clause
  const whereClause: any = { AND: [] };

  if (status && status !== "ALL") {
    whereClause.AND.push({ status: status });
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

  // query payments + total
  const [result, total] = await Promise.all([
    db.payment.findMany({
      where: whereClause,
      orderBy,
      skip,
      take: limitInt,
      include: {
        user: true,
      },
    }),
    db.payment.count({ where: whereClause }),
  ]);

  //  mapping response
  const payments = result.map((p) => ({
    id: p.id,
    invoiceNo: p.invoiceNo,
    amount: p.amount,
    status: p.status,
    createdAt: p.createdAt,
    paymentMethod: p.paymentMethod,
    paymentUrl: p.paymentUrl,
    user: {
      id: p.user?.id,
      name: p.user?.name,
      email: p.user?.email,
    },
  }));

  return {
    data: payments,
    meta: {
      page: currentPage,
      limit: limitInt,
      total,
      totalPages: Math.ceil(total / limitInt),
    },
  };
}

export async function getPaymentById(id: string) {
  return db.payment.findUnique({
    where: { id },
    include: {
      user: true,
      booking: true,
    },
  });
}

export async function updatestatus(
  id: string,
  status: "PENDING" | "PAID" | "FAILED"
) {
  const updated = await db.payment.update({
    where: { id },
    data: { status },
  });

  return { success: true, payment: updated };
}

export async function deletePayment(id: string) {
  await db.payment.delete({ where: { id } });
  return { success: true, message: "Payment deleted" };
}
