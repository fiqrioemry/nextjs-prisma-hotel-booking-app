"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { ProfileForm } from "@/components/user/user-profile-form";

export async function getMyBookings(page: number = 1, limit: number = 10) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) throw new Error("Unauthorized");

    const skip = (page - 1) * limit;

    const [result, total] = await Promise.all([
      db.booking.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        include: {
          room: {
            include: {
              hotel: true,
              images: true,
            },
          },
        },
        skip,
        take: limit,
      }),
      db.booking.count({
        where: { userId: session.user.id },
      }),
    ]);

    // Transform data to match the Booking type
    const bookings = result.map((b) => ({
      id: b.id,
      name: b.room?.hotel?.name,
      thumbnail: b.room?.hotel?.thumbnail,
      quantity: b.quantity,
      status: b.status,
      checkIn: b.checkIn,
      checkOut: b.checkOut,
      createdAt: b.createdAt,
      room: {
        id: b.room.id,
        hotelId: b.room.hotelId,
        typeId: b.room.typeId,
        name: b.room.name,
        price: b.room.price,
        capacity: b.room.capacity,
        description: b.room.description,
        images: b.room.images,
        totalUnits: b.room.totalUnits,
        facilities: b.room.facilities,
        availableUnits: 0,
      },
    }));

    return {
      data: bookings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: skip + limit < total,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    console.error("error fetching bookings:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch bookings"
    );
  }
}

export async function getMyPayments(page: number = 1, limit: number = 10) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Unauthorized");

    const skip = (page - 1) * limit;

    const [result, total] = await Promise.all([
      db.payment.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        include: {
          booking: {
            include: {
              room: { include: { hotel: true } },
            },
          },
        },
        skip,
        take: limit,
      }),
      db.payment.count({
        where: { userId: session.user.id },
      }),
    ]);

    const payments = result.map((p) => ({
      id: p.id,
      invoiceNo: p.invoiceNo,
      amount: p.amount,
      status: p.status,
      paymentUrl: p.paymentUrl || "",
      paymentMethod: p.paymentMethod,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return {
      data: payments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: skip + limit < total,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch payments"
    );
  }
}

export async function getMyProfile() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) throw new Error("Unauthorized");

    const rawProfile = await db.user.findUnique({
      where: { id: session.user.id },
      include: { profile: true },
    });

    if (!rawProfile) {
      throw new Error("Profile not found");
    }

    const profile = {
      name: rawProfile.name,
      email: rawProfile.email,
      image: rawProfile.image ?? "https://placehold.co/100x100", // add fallback image
      gender: rawProfile.profile?.gender,
      bio: rawProfile.profile?.bio ?? "",
      phone: rawProfile.profile?.phone ?? "",
      address: rawProfile.profile?.address ?? "",
      joinedAt: rawProfile.createdAt,
    };
    return profile;
  } catch (error) {
    console.error("error fetching profile:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch profile"
    );
  }
}

export async function updateMyAvatar(image: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) return { success: false, message: "Unauthorized" };

  // TODO : use edge store function to upload image and store image
  const updated = await db.user.update({
    where: { id: session.user.id },
    data: { image },
  });

  return { success: true, message: "Profile picture updated", data: updated };
}

export async function updateMyProfile(data: ProfileForm) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false, message: "Unauthorized" };

  // Update user table
  const updatedUser = await db.user.update({
    where: { id: session.user.id },
    data: {
      name: data.name,
      image: data.image,
    },
  });

  // Upsert profile table  (assures profile always exist)
  const updatedProfile = await db.profile.upsert({
    where: { userId: session.user.id },
    update: {
      bio: data.bio,
      gender: data.gender,
      phone: data.phone,
      address: data.address,
    },
    create: {
      userId: session.user.id,
      bio: data.bio,
      gender: data.gender,
      phone: data.phone,
      address: data.address,
    },
  });

  return {
    success: true,
    message: "Profile updated successfully",
    data: { ...updatedUser, ...updatedProfile },
  };
}
