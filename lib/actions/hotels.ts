import { useEdgeStoreUpload } from "@/hooks/use-uploader";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";

export type hotelsParams = {
  q: string;
  page: number;
  limit: number;
  sort: "newest" | "oldest";
};

export async function getHotels(params: hotelsParams) {
  const { q, page, limit, sort } = params;

  const skip = (page - 1) * limit;

  const where = {
    ...(q && {
      OR: [
        { name: { contains: q } },
        { address: { contains: q } },
        { description: { contains: q } },
      ],
    }),
  };
  const hotels = await db.hotel.findMany({
    where,
    orderBy: { createdAt: sort === "oldest" ? "asc" : "desc" },
    skip,
    take: limit,
    include: { rooms: true },
  });

  const total = await db.hotel.count({ where });
  return {
    data: hotels,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getHotelById(id: string) {
  const hotel = await db.hotel.findUnique({
    where: { id },
    include: {
      rooms: {
        include: {
          images: true,
        },
      },
    },
  });

  return hotel;
}

type CreateHotelData = {
  name: string;
  address: string;
  description: string;
  thumbnail: File;
};

export async function createHotel(data: CreateHotelData) {
  const { uploadSingle } = useEdgeStoreUpload();

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session?.user?.role !== "ADMIN") {
    return { success: false, message: "Unauthorized" };
  }

  const file = await uploadSingle(data.thumbnail);

  const newHotel = await db.hotel.create({
    data: {
      name: data.name,
      address: data.address,
      description: data.description,
      thumbnail: file.url,
    },
  });

  return {
    success: true,
    hotel: newHotel,
    message: "Hotel created successfully",
  };
}
type UpdateHotelData = {
  name: string;
  address: string;
  description: string;
  thumbnail: File | string;
};

export async function updateHotel(id: string, data: UpdateHotelData) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session?.user?.role !== "ADMIN") {
    return { success: false, message: "Unauthorized" };
  }

  if (typeof data.thumbnail !== "string") {
    const { uploadSingle } = useEdgeStoreUpload();
    const file = await uploadSingle(data.thumbnail);
    data.thumbnail = file.url;
  }

  const updatedHotel = await db.hotel.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      address: data.address,
      thumbnail: data.thumbnail,
    },
  });

  return {
    success: true,
    hotel: updatedHotel,
    message: "Hotel updated successfully",
  };
}

// -------------------- DELETE HOTEL --------------------
export async function deleteHotel(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session?.user?.role !== "ADMIN") {
    return { success: false, message: "Unauthorized" };
  }

  try {
    await db.hotel.delete({ where: { id } });

    return {
      success: true,
      message: "Hotel deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete hotel",
      error,
    };
  }
}

// -------------------- ADMIN GET HOTELS --------------------
export async function adminGetHotels(params: hotelsParams) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session?.user?.role !== "ADMIN") {
    return { success: false, message: "Unauthorized" };
  }

  const { q, page, limit, sort } = params;
  const skip = (page - 1) * limit;

  const where = {
    ...(q && {
      OR: [
        { name: { contains: q } },
        { address: { contains: q } },
        { description: { contains: q } },
      ],
    }),
  };

  const hotels = await db.hotel.findMany({
    where,
    orderBy: { createdAt: sort === "oldest" ? "asc" : "desc" },
    skip,
    take: limit,
    include: {
      rooms: {
        include: {
          bookings: {
            include: {
              user: true,
              payment: true,
            },
          },
        },
      },
    },
  });

  const total = await db.hotel.count({ where });

  return {
    success: true,
    data: hotels,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
