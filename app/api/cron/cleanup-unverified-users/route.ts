import { db } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { validateCronRequest, createCronResponse } from "@/lib/actions/auth";

export async function GET(request: NextRequest) {
  // Validate cron request
  const authError = validateCronRequest(request);
  if (authError) return authError;

  try {
    // Calculate cutoff date (2 days ago)
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    // Find unverified users older than 2 days
    const unverifiedUsers = await db.user.findMany({
      where: {
        emailVerified: false,
        createdAt: {
          lt: twoDaysAgo,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: {
          select: {
            payments: true,
            transactions: true,
            sessions: true,
            accounts: true,
          },
        },
      },
    });

    // Log users to be deleted for audit purposes
    const usersToDelete = unverifiedUsers.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      relatedRecords: user._count,
    }));

    console.log("Unverified users to be deleted:", {
      count: usersToDelete.length,
      users: usersToDelete,
    });

    // Delete unverified users (cascade will handle related records)
    const deleteResult = await db.user.deleteMany({
      where: {
        emailVerified: false,
        createdAt: {
          lt: twoDaysAgo,
        },
      },
    });

    // Also cleanup expired verification tokens
    const expiredVerifications = await db.verification.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    // Clean up expired sessions while we're at it
    const expiredSessions = await db.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return createCronResponse({
      success: true,
      message: "Cleanup completed successfully",
      results: {
        deletedUsers: deleteResult.count,
        deletedVerifications: expiredVerifications.count,
        deletedSessions: expiredSessions.count,
        cutoffDate: twoDaysAgo.toISOString(),
        deletedUsersList: usersToDelete,
      },
    });
  } catch (error) {
    console.error("Cleanup unverified users error:", error);

    return createCronResponse(
      {
        success: false,
        message: "Cleanup failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
}

// Optional: Add POST method for manual trigger with admin authentication
export async function POST(request: NextRequest) {
  // You can add admin authentication here if needed
  const authError = validateCronRequest(request);
  if (authError) return authError;

  // Same logic as GET but maybe with different parameters
  return GET(request);
}
