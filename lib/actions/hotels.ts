import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { useEdgeStoreUpload } from "@/hooks/use-uploader";

export interface HotelsParams {
  q?: string;
  location?: string;
  endDate?: string;
  startDate?: string;
  sort: "newest" | "oldest" | "available_rooms";
  page: number;
  limit: number;
}

export type MyBooking = {
  id: string;
  name: string;
  hotelThumbnail: string;
  checkIn: string;
  checkOut: string;
  quantity: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  createdAt: string;
  room: Room;
};

export type MetaPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export interface HotelDetailParams {
  hotelId: string;
  startDate?: string;
  endDate?: string;
  location?: string;
}

export type CreateHotelData = {
  name: string;
  address: string;
  description: string;
  thumbnail: File;
  location: string;
};

export type Room = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  capacity: number;
  totalUnits: number;
  facilities: string[];
  availableUnits: number;
};

export interface Hotels {
  id: string;
  name: string;
  address: string;
  thumbnail: string;
  description?: string;
  availableRooms: number;
  createdAt: Date;
  rooms: Room[];
}

export interface HotelDetails {
  id: string;
  name: string;
  address: string;
  thumbnail: string;
  description?: string;
  createdAt: Date;
  rooms: Room[];
}

type UpdateHotelData = {
  name: string;
  address: string;
  description: string;
  thumbnail: File | string;
};

export interface AdminHotelData {
  id: string;
  name: string;
  address: string;
  thumbnail: string;
  description: string;
  totalRooms: number;
  totalUnits: number;
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  createdAt: Date;
}

export async function getHotels(params: HotelsParams) {
  try {
    const {
      q,
      location,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sort = "newest",
    } = params;

    const skip = (page - 1) * limit;

    // WHERE filters
    const where: any = { AND: [] };

    if (q && q.trim()) {
      where.AND.push({
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { address: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      });
    }

    if (location && location.trim()) {
      where.AND.push({
        OR: [
          { name: { contains: location, mode: "insensitive" } },
          { address: { contains: location, mode: "insensitive" } },
        ],
      });
    }

    // Sorting
    let orderBy: any = {};
    switch (sort) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "available_rooms":
        orderBy = { createdAt: "desc" }; // fallback, available dihitung manual
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    // Query hotels + total
    const [result, total] = await Promise.all([
      db.hotel.findMany({
        where,
        orderBy,
        include: {
          rooms: {
            include: {
              images: true,
              bookings: {
                where: {
                  status: { in: ["CONFIRMED", "PENDING"] },
                },
              },
            },
          },
        },
        skip,
        take: limit,
      }),
      db.hotel.count({ where }),
    ]);

    //map to hotekls interface
    const hotels: Hotels[] = result.map((h) => {
      const availableRooms = h.rooms.reduce((acc, r) => {
        let available = r.totalUnits;
        if (startDate && endDate) {
          // count the bookings that overlap with the requested date range
          available -= r.bookings.length;
        }
        return acc + available;
      }, 0);

      return {
        id: h.id,
        name: h.name,
        address: h.address,
        thumbnail: h.thumbnail,
        description: h.description ?? "",
        createdAt: h.createdAt,
        availableRooms,
        rooms: h.rooms.map((r) => ({
          id: r.id,
          name: r.name,
          description: r.description,
          price: r.price,
          images: r.images.map((img) => img.url),
          capacity: r.capacity,
          totalUnits: r.totalUnits,
          facilities: r.facilities,
          availableUnits: r.totalUnits - r.bookings.length,
        })),
      };
    });

    return {
      data: hotels,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: skip + limit < total,
        hasPrevPage: page > 1,
      } as MetaPagination,
    };
  } catch (error) {
    console.error("error fetching hotels:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch hotels"
    );
  }
}

export async function getHotelById(params: HotelDetailParams) {
  const { hotelId, startDate, endDate } = params;

  try {
    //  get hotel and rooms data
    const hotel = await db.hotel.findUnique({
      where: {
        id: hotelId,
      },
      include: {
        rooms: {
          include: {
            images: {
              select: {
                id: true,
                url: true,
                createdAt: true,
              },
              orderBy: { createdAt: "asc" },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!hotel) return null;

    // Calculate available units for each room
    const roomsWithAvailability = await Promise.all(
      hotel.rooms.map(async (room) => {
        let bookedUnits = 0;

        if (startDate && endDate) {
          bookedUnits = await db.booking.count({
            where: {
              id: room.id,
              status: { in: ["CONFIRMED", "PENDING"] },
              NOT: {
                OR: [
                  { checkOut: { lte: new Date(startDate) } },
                  { checkIn: { gte: new Date(endDate) } },
                ],
              },
            },
          });
        }

        // return room with available units
        return {
          id: room.id,
          hotelId: room.hotelId,
          name: room.name,
          price: room.price,
          capacity: room.capacity,
          totalUnits: room.totalUnits,
          facilities: room.facilities,
          description: room.description,
          images: room.images.map((img) => img.url),
          availableUnits: Math.max(0, room.totalUnits - bookedUnits),
        };
      })
    );

    return {
      id: hotel.id,
      name: hotel.name,
      address: hotel.address,
      thumbnail: hotel.thumbnail,
      description: hotel.description,
      createdAt: hotel.createdAt,
      rooms: roomsWithAvailability,
    };
  } catch (error) {
    console.error("error fetching hotel details:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch hotel"
    );
  }
}

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
      location: data.location,
    },
  });

  return {
    success: true,
    hotel: newHotel,
    message: "Hotel created successfully",
  };
}

export async function adminUpdateHotel(id: string, data: UpdateHotelData) {
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

export async function adminDeleteHotel(id: string) {
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

export async function adminGetHotels(params: HotelsParams) {
  const { q = "", page = 1, limit = 10, sort = "newest" } = params;

  const currentPage = parseInt(page.toString());
  const limitInt = parseInt(limit.toString());
  const skip = (currentPage - 1) * limitInt;

  try {
    // Build where clause for search
    const whereClause: any = {};

    if (q && q.trim()) {
      whereClause.OR = [
        { name: { contains: q.trim(), mode: "insensitive" } },
        { address: { contains: q.trim(), mode: "insensitive" } },
        { description: { contains: q.trim(), mode: "insensitive" } },
      ];
    }

    // Build orderBy clause
    const orderBy =
      sort === "oldest"
        ? { createdAt: "asc" as const }
        : { createdAt: "desc" as const };

    // Get basic hotel data first
    const [hotels, total] = await Promise.all([
      db.hotel.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          address: true,
          thumbnail: true,
          description: true,
          createdAt: true,
        },
        orderBy,
        skip,
        take: limitInt,
      }),
      db.hotel.count({
        where: whereClause,
      }),
    ]);

    // Get hotel IDs for subsequent queries
    const ids = hotels.map((h) => h.id);

    if (ids.length === 0) {
      return {
        success: true,
        data: [],
        meta: {
          page: currentPage,
          limit: limitInt,
          total,
          totalPages: Math.ceil(total / limitInt),
        },
      };
    }

    // Get aggregated data for all hotels in parallel
    const [roomStats, bookingStats, revenueStats] = await Promise.all([
      // Room statistics
      db.room.groupBy({
        by: ["id"],
        where: {
          id: { in: ids },
        },
        _count: {
          id: true,
        },
        _sum: {
          totalUnits: true,
        },
      }),

      // Booking statistics
      db.booking.groupBy({
        by: ["status"],
        where: {
          room: {
            id: { in: ids },
          },
        },
        _count: {
          id: true,
        },
      }),

      // Revenue statistics
      db.payment.aggregate({
        where: {
          status: "PAID",
          booking: {
            room: {
              id: { in: ids },
            },
          },
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    // Get detailed booking data for each hotel
    const hotelBookings = await db.booking.findMany({
      where: {
        room: {
          id: { in: ids },
        },
      },
      select: {
        id: true,
        status: true,
        room: {
          select: {
            id: true,
          },
        },
        payment: {
          select: {
            amount: true,
            status: true,
          },
        },
      },
    });

    // Create maps for quick lookup
    const roomStatsMap = new Map(
      roomStats.map((stat) => [
        stat.id,
        {
          totalRooms: stat._count.id,
          totalUnits: stat._sum.totalUnits || 0,
        },
      ])
    );

    // Group bookings by hotel
    const hotelBookingsMap = new Map<string, typeof hotelBookings>();
    hotelBookings.forEach((booking) => {
      const id = booking.room.id;
      if (!hotelBookingsMap.has(id)) {
        hotelBookingsMap.set(id, []);
      }
      hotelBookingsMap.get(id)!.push(booking);
    });

    // Transform data
    const transformedHotels: AdminHotelData[] = hotels.map((hotel) => {
      const roomData = roomStatsMap.get(hotel.id) || {
        totalRooms: 0,
        totalUnits: 0,
      };
      const bookings = hotelBookingsMap.get(hotel.id) || [];

      // Calculate booking statistics
      const totalBookings = bookings.length;
      const confirmedBookings = bookings.filter(
        (b) => b.status === "CONFIRMED"
      ).length;
      const pendingBookings = bookings.filter(
        (b) => b.status === "PENDING"
      ).length;
      const completedBookings = bookings.filter(
        (b) => b.status === "COMPLETED"
      ).length;
      const cancelledBookings = bookings.filter(
        (b) => b.status === "CANCELLED"
      ).length;

      // Calculate revenue for this hotel
      const totalRevenue = bookings.reduce((sum, booking) => {
        if (booking.payment && booking.payment.status === "PAID") {
          return sum + Number(booking.payment.amount);
        }
        return sum;
      }, 0);

      return {
        id: hotel.id,
        name: hotel.name,
        address: hotel.address,
        thumbnail: hotel.thumbnail,
        description: hotel.description || "",
        totalRooms: roomData.totalRooms,
        totalUnits: roomData.totalUnits,
        totalBookings: totalBookings,
        confirmedBookings: confirmedBookings,
        pendingBookings: pendingBookings,
        completedBookings: completedBookings,
        cancelledBookings: cancelledBookings,
        totalRevenue: totalRevenue,
        createdAt: hotel.createdAt,
      };
    });

    return {
      success: true,
      data: transformedHotels,
      meta: {
        page: currentPage,
        limit: limitInt,
        total,
        totalPages: Math.ceil(total / limitInt),
      },
    };
  } catch (error) {
    console.error("Error fetching admin hotels:", error);
    return {
      success: false,
      data: [],
      meta: {
        page: currentPage,
        limit: limitInt,
        total: 0,
        totalPages: 0,
      },
      error: "Failed to fetch hotels data",
    };
  }
}

export async function adminGetHotelById(id: string) {
  try {
    const result = await db.hotel.findUnique({
      where: { id: id },
      include: { rooms: { include: { images: true, type: true } } },
    });

    if (!result) {
      return {
        success: false,
        data: null,
        message: "Hotel not found",
      };
    }
    const hotel = {
      id: result.id,
      name: result.name,
      address: result.address,
      thumbnail: result.thumbnail,
      description: result.description || "",
      rooms: result.rooms.map((r) => ({
        id: r.id,
        typeId: r.type.id,
        hotelId: r.hotelId,
        name: r.name,
        description: r.description,
        facilities: r.facilities,
        capacity: r.capacity,
        totalUnits: r.totalUnits,
        price: r.price,
        images: r.images,
      })),
    };

    return {
      success: true,
      data: hotel,
      message: "Hotel fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching hotel by ID:", error);
    return {
      success: false,
      data: null,
      message: "Failed to fetch hotel",
    };
  }
}
