import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { useEdgeStoreUpload } from "@/hooks/use-uploader";

export interface HotelsParams {
  q?: string;
  location?: string;
  endDate?: string;
  startDate?: string;
  sort?: "newest" | "oldest" | "available_rooms";
  page: number;
  limit: number;
}

export type MetaPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
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
  roomId: string;
  roomName: string;
  description: string;
  price: number;
  images: string[];
  capacity: number;
  totalUnits: number;
  facilities: string[];
  availableUnits: number;
};

export interface Hotels {
  hotelId: string;
  hotelName: string;
  address: string;
  thumbnail: string;
  description?: string;
  availableRooms: number;
  createdAt: Date;
  rooms: Room[];
}

export interface HotelDetails {
  hotelId: string;
  hotelName: string;
  address: string;
  thumbnail: string;
  description?: string;
  createdAt: Date;
  rooms: Room[];
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
              roomId: room.id,
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

        return {
          roomId: room.id,
          roomName: room.name,
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
      hotelId: hotel.id,
      hotelName: hotel.name,
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

export interface AdminHotelData {
  hotelId: string;
  hotelName: string;
  address: string;
  thumbnail: string;
  description: string;
  total_rooms: number;
  total_units: number;
  total_bookings: number;
  confirmed_bookings: number;
  pending_bookings: number;
  completed_bookings: number;
  cancelled_bookings: number;
  total_revenue: number;
  createdAt: Date;
}

// -------------------- ADMIN GET HOTELS  --------------------
export async function adminGetHotels(params: HotelsParams) {
  const { q = "", page = 1, limit = 10, sort = "newest" } = params;

  // Ensure page and limit are integers
  const currentPage = parseInt(page.toString());
  const limitInt = parseInt(limit.toString());
  const skip = (currentPage - 1) * limitInt;

  // Build search conditions and parameters
  let searchConditions = "WHERE 1=1";
  const queryParams: any[] = [];
  let paramIndex = 1;

  // Add search filter if query exists
  if (q && q.trim()) {
    searchConditions += ` AND (
      h.name ILIKE $${paramIndex} OR 
      h.address ILIKE $${paramIndex} OR 
      h.description ILIKE $${paramIndex}
    )`;
    queryParams.push(`%${q.trim()}%`);
    paramIndex++;
  }

  // Build ORDER BY clause
  const orderByClause =
    sort === "oldest"
      ? 'ORDER BY h."createdAt" ASC'
      : 'ORDER BY h."createdAt" DESC';

  // Main query to get hotels with comprehensive statistics
  const hotelsQuery = `
    SELECT 
      h.id AS hotel_id,
      h.name AS hotel_name,
      h.address,
      h.thumbnail,
      h.description,
      h."createdAt" AS created_at,
      COUNT(DISTINCT r.id)::integer AS total_rooms,
      COALESCE(SUM(r."totalUnits"), 0)::integer AS total_units,
      COUNT(DISTINCT b.id)::integer AS total_bookings,
      COUNT(DISTINCT CASE WHEN b.status = 'CONFIRMED' THEN b.id END)::integer AS confirmed_bookings,
      COUNT(DISTINCT CASE WHEN b.status = 'PENDING' THEN b.id END)::integer AS pending_bookings,
      COUNT(DISTINCT CASE WHEN b.status = 'COMPLETED' THEN b.id END)::integer AS completed_bookings,
      COUNT(DISTINCT CASE WHEN b.status = 'CANCELLED' THEN b.id END)::integer AS cancelled_bookings,
      COALESCE(SUM(CASE WHEN p.status = 'PAID' THEN p.amount ELSE 0 END), 0)::numeric AS total_revenue
    FROM "Hotel" h
    LEFT JOIN "Room" r ON r."hotelId" = h.id
    LEFT JOIN "Booking" b ON b."roomId" = r.id
    LEFT JOIN "Payment" p ON p."bookingId" = b.id
    ${searchConditions}
    GROUP BY h.id, h.name, h.address, h.thumbnail, h.description, h."createdAt"
    ${orderByClause}
    LIMIT $${paramIndex}::integer OFFSET $${paramIndex + 1}::integer
  `;

  // Count query for pagination
  const countQuery = `
    SELECT COUNT(DISTINCT h.id)::bigint AS total
    FROM "Hotel" h
    LEFT JOIN "Room" r ON r."hotelId" = h.id
    LEFT JOIN "Booking" b ON b."roomId" = r.id
    LEFT JOIN "Payment" p ON p."bookingId" = b.id
    ${searchConditions}
  `;

  try {
    // Add pagination parameters as integers
    queryParams.push(limitInt, skip);

    // Execute both queries in parallel
    const [hotelsResult, countResult] = await Promise.all([
      db.$queryRawUnsafe<AdminHotelData[]>(hotelsQuery, ...queryParams),
      db.$queryRawUnsafe<[{ total: bigint }]>(
        countQuery,
        ...queryParams.slice(0, -2) // Remove limit and offset for count query
      ),
    ]);

    const total = Number(countResult[0]?.total || 0);

    // Transform the results to ensure correct data types
    const transformedHotels = hotelsResult.map((hotel) => ({
      ...hotel,
      total_rooms: Number(hotel.total_rooms),
      total_units: Number(hotel.total_units),
      total_bookings: Number(hotel.total_bookings),
      confirmed_bookings: Number(hotel.confirmed_bookings),
      pending_bookings: Number(hotel.pending_bookings),
      completed_bookings: Number(hotel.completed_bookings),
      cancelled_bookings: Number(hotel.cancelled_bookings),
      total_revenue: Number(hotel.total_revenue),
    }));

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
    console.error("Database query error in adminGetHotels:", error);
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

export async function getHotels(params: HotelsParams) {
  const {
    q,
    location,
    startDate,
    endDate,
    page = 1,
    limit = 10,
    sort = "newest",
  } = params;

  // Ensure page and limit are integers
  const currentPage = parseInt(page.toString());
  const limitInt = parseInt(limit.toString());
  const skip = (currentPage - 1) * limitInt;

  // Build WHERE conditions for search
  let searchConditions = "WHERE 1=1";
  const queryParams: any[] = [];
  let paramIndex = 1;

  // Search by general query (name, address, description)
  if (q && q.trim()) {
    searchConditions += ` AND (
      h.name ILIKE $${paramIndex} OR 
      h.address ILIKE $${paramIndex} OR 
      h.description ILIKE $${paramIndex}
    )`;
    queryParams.push(`%${q.trim()}%`);
    paramIndex++;
  }

  // Search by location (name or address)
  if (location && location.trim()) {
    searchConditions += ` AND (
      h.name ILIKE $${paramIndex} OR 
      h.address ILIKE $${paramIndex}
    )`;
    queryParams.push(`%${location.trim()}%`);
    paramIndex++;
  }

  // Date range filter (for availability calculation)
  let dateRangeCondition = "";
  if (startDate && endDate) {
    dateRangeCondition = `AND NOT (b."checkOut" <= $${paramIndex}::date OR b."checkIn" >= $${
      paramIndex + 1
    }::date)`;
    queryParams.push(startDate, endDate);
    paramIndex += 2;
  }

  // Build ORDER BY clause
  let orderByClause = "";
  switch (sort) {
    case "oldest":
      orderByClause = 'ORDER BY h."createdAt" ASC';
      break;
    case "available_rooms":
      orderByClause = 'ORDER BY available_rooms DESC, h."createdAt" DESC';
      break;
    case "newest":
    default:
      orderByClause = 'ORDER BY h."createdAt" DESC';
      break;
  }

  // Main query to get hotels with available rooms
  const hotelsQuery = `
    SELECT 
      h.id AS hotel_id,
      h.name AS hotel_name,
      h.address,
      h.thumbnail,
      h.description,
      h."createdAt" AS created_at,
      COALESCE(SUM(
        r."totalUnits" - (
          SELECT COUNT(*)
          FROM "Booking" b
          WHERE b."roomId" = r.id
            AND b.status IN ('CONFIRMED','PENDING')
            ${dateRangeCondition}
        )
      ), 0) AS available_rooms
    FROM "Hotel" h
    LEFT JOIN "Room" r ON r."hotelId" = h.id
    ${searchConditions}
    GROUP BY h.id, h.name, h.address, h.thumbnail, h.description, h."createdAt"
    ${orderByClause}
    LIMIT $${paramIndex}::integer OFFSET $${paramIndex + 1}::integer
  `;

  // Count query for pagination
  const countQuery = `
    SELECT COUNT(DISTINCT h.id) as total
    FROM "Hotel" h
    LEFT JOIN "Room" r ON r."hotelId" = h.id
    ${searchConditions}
  `;

  try {
    // Add pagination parameters as integers
    queryParams.push(limitInt, skip);

    // Execute both queries
    const [hotelsResult, countResult] = await Promise.all([
      db.$queryRawUnsafe<Hotels[]>(hotelsQuery, ...queryParams),
      db.$queryRawUnsafe<[{ total: bigint }]>(
        countQuery,
        ...queryParams.slice(0, -2)
      ),
    ]);

    const total = Number(countResult[0]?.total || 0);

    return {
      data: hotelsResult.map((hotel: any) => ({
        hotelId: hotel.hotel_id,
        hotelName: hotel.hotel_name,
        address: hotel.address,
        thumbnail: hotel.thumbnail,
        description: hotel.description,
        createdAt: hotel.created_at,
        availableRooms: Number(hotel.available_rooms ?? 0),
      })),
      meta: {
        page: currentPage,
        limit: limitInt,
        total,
        totalPages: Math.ceil(total / limitInt),
      },
    };
  } catch (error) {
    console.error("Database query error:", error);
    throw new Error("Failed to fetch hotels from database");
  }
}
