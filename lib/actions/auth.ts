"use server";

import { db } from "../prisma";
import { auth } from "../auth";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function verifyResetToken(token: string) {
  const fullIdentifier = `reset-password:${token}`;

  const verification = await db.verification.findFirst({
    where: {
      identifier: fullIdentifier,
    },
  });

  if (!verification) return false;

  if (verification.expiresAt < new Date()) return false;

  return true;
}

export async function validateCronRequest(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    throw new Error("CRON_SECRET not configured");
  }

  if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
    return new Response("Unauthorized", {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return null;
}

export async function createCronResponse(data: any, status: number = 200) {
  return Response.json(
    {
      timestamp: new Date().toISOString(),
      ...data,
    },
    { status }
  );
}
