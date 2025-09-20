import { db } from "@/lib/prisma";
import { EditRoomForm } from "@/components/admin/edit-room-form";
import { AddRoomForm } from "@/components/admin/add-room-form";

export type RoomsParams = {
  q?: string;
  page: number;
  limit: number;
  sort: "newest" | "oldest";
  id?: string;
};

export async function getRoomTypes() {
  const result = await db.roomType.findMany({
    orderBy: { name: "asc" },
  });

  const roomTypes = result.map((type: { id: string; name: string }) => ({
    value: type.id,
    label: type.name,
  }));
  return roomTypes;
}

export async function getRooms(params: RoomsParams) {
  const { q, page, limit, sort, id } = params;
  const skip = (page - 1) * limit;

  // build where clause
  const where = {
    ...(id && { id }),
    ...(q && {
      OR: [
        { name: { contains: q } },
        { description: { contains: q } },
        { facilities: { hasSome: [q] } },
      ],
    }),
  };

  // implement where clauase as query params
  const rooms = await db.room.findMany({
    where,
    orderBy: { createdAt: sort === "oldest" ? "asc" : "desc" },
    skip,
    take: limit,
    include: { images: true, hotel: true },
  });

  // count the total from query result
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
        id: id,
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

export async function createRoom(data: AddRoomForm) {
  const newRoom = await db.room.create({
    data: {
      hotelId: data.hotelId,
      typeId: data.typeId,
      name: data.name,
      description: data.description,
      facilities: data.facilities,
      price: data.price,
      capacity: data.capacity,
      totalUnits: data.totalUnits,
      images: {
        create: data.images?.map((img) => ({ url: img.url })) || [],
      },
    },
    include: { images: true },
  });

  if (!newRoom) {
    return { success: false, message: "Failed to create room" };
  }

  return { success: true, room: newRoom, message: "Room created successfully" };
}

export async function updateRoom(id: string, data: EditRoomForm) {
  // 1. Update basic room fields
  const updatedRoom = await db.room.update({
    where: { id },
    data: {
      hotelId: data.hotelId,
      typeId: data.typeId,
      name: data.name,
      description: data.description,
      facilities: data.facilities,
      price: data.price,
      capacity: data.capacity,
      totalUnits: data.totalUnits,
    },
  });

  //  get old images from db
  const existingImages = await db.roomImage.findMany({
    where: { roomId: id },
  });

  const incomingImages = data.images || [];
  const incomingIds = incomingImages.map((img) => img.id).filter(Boolean);

  // delete images that are removed in the edit form
  const removed = existingImages.filter((img) => !incomingIds.includes(img.id));
  for (const img of removed) {
    await db.roomImage.delete({ where: { id: img.id } });
  }

  console.log("Removed images:", incomingImages);

  // Update existing & Insert new
  for (const img of incomingImages) {
    if (img.id) {
      // update existing (misal replace URL)
      await db.roomImage.update({
        where: { id: img.id },
        data: { url: img.url },
      });
    } else {
      // insert new image
      await db.roomImage.create({
        data: {
          roomId: id,
          url: img.url,
        },
      });
    }
  }

  // 5. Return updated room dengan images terupdate
  return {
    success: true,
    room: updatedRoom,
    message: "Room updated successfully",
  };
}

// -------------------- DELETE ROOM --------------------
export async function deleteRoom(id: string) {
  await db.room.delete({ where: { id } });
  return { success: true, message: "Room deleted successfully" };
}
