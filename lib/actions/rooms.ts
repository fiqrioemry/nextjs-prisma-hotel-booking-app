import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { useEdgeStoreUpload } from "@/hooks/use-uploader";

// -------------------- TYPES --------------------
export type RoomsParams = {
  q?: string;
  page: number;
  limit: number;
  sort: "newest" | "oldest";
  hotelId?: string;
};

type CreateRoomData = {
  hotelId: string;
  name: string;
  description: string;
  facilities: string[];
  price: number;
  capacity: number;
  totalUnits: number;
  images?: File[];
};

type UpdateRoomData = Partial<CreateRoomData> & {
  images?: (File | string)[];
};

// -------------------- GET ROOMS --------------------
export async function getRooms(params: RoomsParams) {
  const { q, page, limit, sort, hotelId } = params;
  const skip = (page - 1) * limit;

  const where: any = {
    ...(hotelId && { hotelId }),
    ...(q && {
      OR: [
        { name: { contains: q } },
        { description: { contains: q } },
        { facilities: { hasSome: [q] } },
      ],
    }),
  };

  const rooms = await db.room.findMany({
    where,
    orderBy: { createdAt: sort === "oldest" ? "asc" : "desc" },
    skip,
    take: limit,
    include: { images: true, hotel: true },
  });

  const total = await db.room.count({ where });
  return {
    data: rooms,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// -------------------- GET ROOM BY ID --------------------
export async function getRoomById(id: string, checkIn?: Date, checkOut?: Date) {
  const room = await db.room.findUnique({
    where: { id },
    include: { images: true, hotel: true },
  });
  if (!room) return null;

  let availableUnits = room.totalUnits;

  if (checkIn && checkOut) {
    const overlappingBookings = await db.booking.count({
      where: {
        roomId: id,
        status: { in: ["PENDING", "CONFIRMED"] },
        NOT: {
          OR: [{ checkOut: { lte: checkIn } }, { checkIn: { gte: checkOut } }],
        },
      },
    });

    availableUnits = room.totalUnits - overlappingBookings;
  }

  return {
    ...room,
    availability: {
      checkIn,
      checkOut,
      availableUnits,
      isAvailable: availableUnits > 0,
    },
  };
}

// -------------------- CREATE ROOM --------------------
export async function createRoom(data: CreateRoomData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session?.user?.role !== "ADMIN") {
    return { success: false, message: "Unauthorized" };
  }

  let uploadedImages: {
    url: string;
    name: string;
    size: number;
    type: string;
  }[] = [];

  if (data.images && data.images.length > 0) {
    const { uploadMultiple } = useEdgeStoreUpload();
    const result = await uploadMultiple(data.images);
    uploadedImages = result.files;
  }

  const newRoom = await db.room.create({
    data: {
      hotelId: data.hotelId,
      name: data.name,
      description: data.description,
      facilities: data.facilities,
      price: data.price,
      capacity: data.capacity,
      totalUnits: data.totalUnits,
      images: {
        create: uploadedImages.map((img) => ({ url: img.url })),
      },
    },
    include: { images: true, hotel: true },
  });

  return { success: true, room: newRoom, message: "Room created successfully" };
}

// -------------------- UPDATE ROOM --------------------
export async function updateRoom(id: string, data: UpdateRoomData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session?.user?.role !== "ADMIN") {
    return { success: false, message: "Unauthorized" };
  }

  let uploadedImages: {
    url: string;
    name: string;
    size: number;
    type: string;
  }[] = [];

  if (data.images && data.images.length > 0) {
    const files = data.images.filter((i): i is File => i instanceof File);
    if (files.length > 0) {
      const { uploadMultiple } = useEdgeStoreUpload();
      const result = await uploadMultiple(files);
      uploadedImages = result.files;
    }
  }

  const updatedRoom = await db.room.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.description && { description: data.description }),
      ...(data.facilities && { facilities: data.facilities }),
      ...(data.price && { price: data.price }),
      ...(data.capacity && { capacity: data.capacity }),
      ...(data.totalUnits && { totalUnits: data.totalUnits }),
      ...(uploadedImages.length > 0 && {
        images: { create: uploadedImages.map((img) => ({ url: img.url })) },
      }),
    },
    include: { images: true, hotel: true },
  });

  return {
    success: true,
    room: updatedRoom,
    message: "Room updated successfully",
  };
}

// -------------------- DELETE ROOM --------------------
export async function deleteRoom(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session?.user?.role !== "ADMIN") {
    return { success: false, message: "Unauthorized" };
  }

  await db.room.delete({ where: { id } });
  return { success: true, message: "Room deleted successfully" };
}
