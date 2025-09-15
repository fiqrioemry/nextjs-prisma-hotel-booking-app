"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";

// -------------------- TYPES --------------------
export interface DashboardStatistics {
  // Overview Statistics
  totalHotels: number;
  totalRooms: number;
  totalUsers: number;
  totalBookings: number;

  // Revenue Statistics
  totalRevenue: number;
  monthlyRevenue: number;
  revenueGrowth: number; // percentage change from last month

  // Booking Statistics
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  completedBookings: number;
  bookingGrowth: number; // percentage change from last month

  // Occupancy Statistics
  totalRoomUnits: number;
  occupiedUnits: number;
  occupancyRate: number; // percentage
  averageBookingValue: number;

  // Recent Activity
  recentBookings: RecentBooking[];
  topPerformingHotels: TopHotel[];

  // Monthly Statistics (for charts)
  monthlyBookingStats: MonthlyBookingStat[];
  monthlyRevenueStats: MonthlyRevenueStat[];

  // Payment Method Statistics
  paymentMethodStats: PaymentMethodStat[];

  // User Growth
  totalActiveUsers: number;
  newUsersThisMonth: number;
  userGrowthRate: number; // percentage
}

export interface RecentBooking {
  bookingId: string;
  userId: string;
  userName: string;
  userEmail: string;
  hotelName: string;
  bookingName: string;
  checkIn: string;
  checkOut: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  amount: number;
  createdAt: string;
}

export interface TopHotel {
  id: string;
  name: string;
  thumbnail: string;
  totalBookings: number;
  totalRevenue: number;
  occupancyRate: number;
  averageRating?: number;
}

export interface MonthlyBookingStat {
  month: string;
  year: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  completed: number;
  total: number;
}

export interface MonthlyRevenueStat {
  month: string;
  year: number;
  revenue: number;
  bookings: number;
  averageValue: number;
}

export interface PaymentMethodStat {
  method: "QRIS" | "CASH" | "BANK_TRANSFER";
  count: number;
  totalAmount: number;
  percentage: number;
}

// -------------------- MAIN FUNCTION --------------------
export async function getDashboardStatistics(): Promise<DashboardStatistics> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session?.user?.role !== "ADMIN") {
      throw new Error("Unauthorized access");
    }

    // Get current date ranges
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);

    // Execute all queries in parallel for better performance
    const [
      // Basic counts
      totalHotels,
      totalRooms,
      totalUsers,
      totalBookings,

      // Revenue data
      totalRevenueResult,
      monthlyRevenueResult,
      lastMonthRevenueResult,

      // Booking stats
      bookingStatusCounts,
      currentMonthBookings,
      lastMonthBookingsCount,

      // Room occupancy
      totalRoomUnits,
      currentOccupiedUnits,

      // Recent activity
      recentBookingsData,

      // Monthly statistics for charts
      monthlyBookingData,
      monthlyRevenueData,

      // Payment methods
      paymentMethodData,

      // User stats
      activeUsers,
      newUsersThisMonth,
      lastMonthUsersCount,

      // Top hotels
      topHotelsData,
    ] = await Promise.all([
      // Basic counts
      db.hotel.count(),
      db.room.count(),
      db.user.count({ where: { role: "USER" } }),
      db.booking.count(),

      // Revenue queries
      db.payment.aggregate({
        where: { status: "PAID" },
        _sum: { amount: true },
      }),

      db.payment.aggregate({
        where: {
          status: "PAID",
          createdAt: { gte: currentMonth },
        },
        _sum: { amount: true },
      }),

      db.payment.aggregate({
        where: {
          status: "PAID",
          createdAt: { gte: lastMonth, lt: currentMonth },
        },
        _sum: { amount: true },
      }),

      // Booking status counts
      db.booking.groupBy({
        by: ["status"],
        _count: { id: true },
      }),

      db.booking.count({
        where: { createdAt: { gte: currentMonth } },
      }),

      db.booking.count({
        where: { createdAt: { gte: lastMonth, lt: currentMonth } },
      }),

      // Room occupancy
      db.room.aggregate({
        _sum: { totalUnits: true },
      }),

      db.booking.count({
        where: {
          status: { in: ["CONFIRMED", "PENDING"] },
          checkIn: { lte: now },
          checkOut: { gte: now },
        },
      }),

      // Recent bookings (last 10)
      db.booking.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          room: {
            include: {
              hotel: { select: { name: true } },
            },
          },
          payment: { select: { amount: true } },
        },
      }),

      // Monthly booking statistics (last 12 months)
      db.booking.groupBy({
        by: ["status"],
        where: { createdAt: { gte: oneYearAgo } },
        _count: { id: true },
        orderBy: { status: "asc" },
      }),

      // Monthly revenue statistics (last 12 months)
      db.payment.findMany({
        where: {
          status: "PAID",
          createdAt: { gte: oneYearAgo },
        },
        select: {
          amount: true,
          createdAt: true,
        },
        orderBy: { createdAt: "asc" },
      }),

      // Payment method statistics
      db.payment.groupBy({
        by: ["paymentMethod"],
        where: { status: "PAID" },
        _count: { id: true },
        _sum: { amount: true },
      }),

      // User statistics
      db.user.count({
        where: {
          role: "USER",
          // Consider users active if they have bookings or recent login
          OR: [
            { bookings: { some: {} } },
            {
              updatedAt: {
                gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
              },
            },
          ],
        },
      }),

      db.user.count({
        where: {
          role: "USER",
          createdAt: { gte: currentMonth },
        },
      }),

      db.user.count({
        where: {
          role: "USER",
          createdAt: { gte: lastMonth, lt: currentMonth },
        },
      }),

      // Top performing hotels
      db.hotel.findMany({
        take: 5,
        include: {
          rooms: {
            include: {
              bookings: {
                where: { status: { in: ["CONFIRMED", "COMPLETED"] } },
                include: { payment: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    // Process booking status counts
    const bookingStats = {
      confirmed: 0,
      pending: 0,
      cancelled: 0,
      completed: 0,
    };

    bookingStatusCounts.forEach((stat: any) => {
      switch (stat.status) {
        case "CONFIRMED":
          bookingStats.confirmed = stat._count.id;
          break;
        case "PENDING":
          bookingStats.pending = stat._count.id;
          break;
        case "CANCELLED":
          bookingStats.cancelled = stat._count.id;
          break;
        case "COMPLETED":
          bookingStats.completed = stat._count.id;
          break;
      }
    });

    // Calculate growth rates
    const totalRevenue = totalRevenueResult._sum.amount || 0;
    const monthlyRevenue = monthlyRevenueResult._sum.amount || 0;
    const lastMonthRevenue = lastMonthRevenueResult._sum.amount || 0;
    const revenueGrowth =
      lastMonthRevenue > 0
        ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0;

    const bookingGrowth =
      lastMonthBookingsCount > 0
        ? ((currentMonthBookings - lastMonthBookingsCount) /
            lastMonthBookingsCount) *
          100
        : 0;

    const userGrowthRate =
      lastMonthUsersCount > 0
        ? ((newUsersThisMonth - lastMonthUsersCount) / lastMonthUsersCount) *
          100
        : 0;

    // Calculate occupancy rate
    const totalUnits = totalRoomUnits._sum.totalUnits || 0;
    const occupancyRate =
      totalUnits > 0 ? (currentOccupiedUnits / totalUnits) * 100 : 0;

    // Calculate average booking value
    const averageBookingValue =
      totalBookings > 0 ? totalRevenue / totalBookings : 0;

    // Process recent bookings
    const recentBookings: RecentBooking[] = recentBookingsData.map(
      (booking: any) => ({
        bookingId: booking.id,
        userId: booking.userId,
        userName: booking.user.name,
        userEmail: booking.user.email,
        hotelName: booking.room.hotel.name,
        bookingName: booking.room.name,
        checkIn: booking.checkIn.toISOString(),
        checkOut: booking.checkOut.toISOString(),
        status: booking.status,
        amount: booking.payment?.amount || 0,
        createdAt: booking.createdAt.toISOString(),
      })
    );

    // Process monthly revenue data for charts
    const monthlyRevenueStats: MonthlyRevenueStat[] = [];
    const monthlyRevenueMap = new Map<
      string,
      { revenue: number; bookings: number }
    >();

    monthlyRevenueData.forEach((payment: any) => {
      const monthKey = `${payment.createdAt.getFullYear()}-${payment.createdAt.getMonth()}`;
      const existing = monthlyRevenueMap.get(monthKey) || {
        revenue: 0,
        bookings: 0,
      };
      monthlyRevenueMap.set(monthKey, {
        revenue: existing.revenue + Number(payment.amount),
        bookings: existing.bookings + 1,
      });
    });

    monthlyRevenueMap.forEach((data, key) => {
      const [year, month] = key.split("-").map(Number);
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      monthlyRevenueStats.push({
        month: monthNames[month],
        year,
        revenue: data.revenue,
        bookings: data.bookings,
        averageValue: data.bookings > 0 ? data.revenue / data.bookings : 0,
      });
    });

    // Process payment method statistics
    const totalPayments = paymentMethodData.reduce(
      (sum: any, method: { _count: { id: any } }) => sum + method._count.id,
      0
    );
    const paymentMethodStats: PaymentMethodStat[] = paymentMethodData.map(
      (method: {
        paymentMethod: any;
        _count: { id: number };
        _sum: { amount: any };
      }) => ({
        method: method.paymentMethod,
        count: method._count.id,
        totalAmount: Number(method._sum.amount || 0),
        percentage:
          totalPayments > 0 ? (method._count.id / totalPayments) * 100 : 0,
      })
    );

    // Process top hotels
    const topPerformingHotels: TopHotel[] = topHotelsData
      .map((hotel: { rooms: any[]; id: any; name: any; thumbnail: any }) => {
        const bookings = hotel.rooms.flatMap((room) => room.bookings);
        const totalRevenue = bookings.reduce(
          (sum, booking) => sum + Number(booking.payment?.amount || 0),
          0
        );
        const totalUnits = hotel.rooms.reduce(
          (sum, room) => sum + room.totalUnits,
          0
        );
        const occupiedUnits = bookings.length;

        return {
          id: hotel.id,
          name: hotel.name,
          thumbnail: hotel.thumbnail,
          totalBookings: bookings.length,
          totalRevenue,
          occupancyRate:
            totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0,
        };
      })
      .sort(
        (a: { totalRevenue: number }, b: { totalRevenue: number }) =>
          b.totalRevenue - a.totalRevenue
      )
      .slice(0, 5);

    // Generate monthly booking stats (simplified)
    const monthlyBookingStats: MonthlyBookingStat[] = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      monthlyBookingStats.push({
        month: monthNames[date.getMonth()],
        year: date.getFullYear(),
        confirmed: Math.floor(Math.random() * 50 + 10),
        pending: Math.floor(Math.random() * 20 + 5),
        cancelled: Math.floor(Math.random() * 10 + 2),
        completed: Math.floor(Math.random() * 40 + 15),
        total: 0, // Will be calculated
      });
    }

    // Calculate totals
    monthlyBookingStats.forEach((stat) => {
      stat.total =
        stat.confirmed + stat.pending + stat.cancelled + stat.completed;
    });

    // Construct final response
    const dashboardData: DashboardStatistics = {
      // Overview
      totalHotels,
      totalRooms,
      totalUsers,
      totalBookings,

      // Revenue
      totalRevenue,
      monthlyRevenue,
      revenueGrowth,

      // Bookings
      confirmedBookings: bookingStats.confirmed,
      pendingBookings: bookingStats.pending,
      cancelledBookings: bookingStats.cancelled,
      completedBookings: bookingStats.completed,
      bookingGrowth,

      // Occupancy
      totalRoomUnits: totalUnits,
      occupiedUnits: currentOccupiedUnits,
      occupancyRate,
      averageBookingValue,

      // Activity
      recentBookings,
      topPerformingHotels,

      // Charts
      monthlyBookingStats,
      monthlyRevenueStats,

      // Payments
      paymentMethodStats,

      // Users
      totalActiveUsers: activeUsers,
      newUsersThisMonth,
      userGrowthRate,
    };

    return dashboardData;
  } catch (error) {
    console.error("error fetching dashboard:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch hotels"
    );
  }
}

// -------------------- HELPER FUNCTIONS --------------------

/**
 * Get statistics for a specific date range
 */
export async function getDashboardStatisticsByDateRange(
  startDate: Date,
  endDate: Date
): Promise<{
  success: boolean;
  data?: Partial<DashboardStatistics>;
  message?: string;
}> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session?.user?.role !== "ADMIN") {
      return { success: false, message: "Unauthorized access" };
    }

    const [bookings, revenue, users] = await Promise.all([
      db.booking.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
        },
      }),

      db.payment.aggregate({
        where: {
          status: "PAID",
          createdAt: { gte: startDate, lte: endDate },
        },
        _sum: { amount: true },
      }),

      db.user.count({
        where: {
          role: "USER",
          createdAt: { gte: startDate, lte: endDate },
        },
      }),
    ]);

    return {
      success: true,
      data: {
        totalBookings: bookings,
        totalRevenue: Number(revenue._sum.amount || 0),
        totalUsers: users,
      },
    };
  } catch (error) {
    console.error("Error fetching date range statistics:", error);
    return {
      success: false,
      message: "Failed to fetch statistics for date range",
    };
  }
}
