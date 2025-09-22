import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { getDashboardStatistics } from "@/lib/actions/admin";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await getDashboardStatistics();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
