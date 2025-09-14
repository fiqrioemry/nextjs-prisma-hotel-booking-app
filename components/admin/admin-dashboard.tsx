"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  Pie,
  Cell,
  Area,
  PieChart,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { DashboardStatistics } from "@/lib/actions/admin";
import {
  Hotel,
  Users,
  Bed,
  Clock,
  Calendar,
  Building,
  TrendingUp,
  DollarSign,
  CheckCircle,
  CreditCard,
  AlertCircle,
  TrendingDown,
} from "lucide-react";
import Link from "next/link";

// Color schemes for charts
const CHART_COLORS = {
  primary: "hsl(var(--chart-1))",
  secondary: "hsl(var(--chart-2))",
  accent: "hsl(var(--chart-3))",
  success: "hsl(var(--chart-4))",
  warning: "hsl(var(--chart-5))",
};

const STATUS_COLORS = {
  CONFIRMED: "#22c55e",
  PENDING: "#f59e0b",
  CANCELLED: "#ef4444",
  COMPLETED: "#3b82f6",
};

export const AdminDashboard = ({
  dashboardData,
}: {
  dashboardData: DashboardStatistics;
}) => {
  const data = dashboardData;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format growth percentage
  const formatGrowth = (growth: number) => {
    const isPositive = growth >= 0;
    return (
      <div
        className={`flex items-center space-x-1 ${
          isPositive ? "text-green-600" : "text-red-600"
        }`}
      >
        {isPositive ? (
          <TrendingUp className="h-4 w-4" />
        ) : (
          <TrendingDown className="h-4 w-4" />
        )}
        <span className="text-sm font-medium">
          {Math.abs(growth).toFixed(1)}%
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12 ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your hotel business.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </Badge>
        </div>
      </div>

      {/* Overview Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data.totalRevenue)}
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                This month: {formatCurrency(data.monthlyRevenue)}
              </p>
              {formatGrowth(data.revenueGrowth)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.totalBookings.toLocaleString()}
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                Active: {data.confirmedBookings + data.pendingBookings}
              </p>
              {formatGrowth(data.bookingGrowth)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Occupancy Rate
            </CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.occupancyRate.toFixed(1)}%
            </div>
            <div className="mt-2">
              <Progress value={data.occupancyRate} className="w-full h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {data.occupiedUnits} of {data.totalRoomUnits} units occupied
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.totalActiveUsers.toLocaleString()}
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                New: +{data.newUsersThisMonth}
              </p>
              {formatGrowth(data.userGrowthRate)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hotels</CardTitle>
            <Hotel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalHotels}</div>
            <p className="text-xs text-muted-foreground">
              {data.totalRooms} total rooms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Booking Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data.averageBookingValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per booking transaction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {data.confirmedBookings}
            </div>
            <p className="text-xs text-muted-foreground">Confirmed bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {data.pendingBookings}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="hotels">Hotels</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Trend</CardTitle>
                <CardDescription>
                  Revenue over the last 12 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.monthlyRevenueStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip
                      formatter={(value: number) => [
                        formatCurrency(value),
                        "Revenue",
                      ]}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Area type="monotone" dataKey="revenue" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Booking Value</CardTitle>
                <CardDescription>
                  Monthly average booking value trend
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.monthlyRevenueStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip
                      formatter={(value: number) => [
                        formatCurrency(value),
                        "Avg. Value",
                      ]}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="averageValue"
                      strokeWidth={3}
                      dot={{ fill: CHART_COLORS.secondary, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Booking Status Distribution</CardTitle>
                <CardDescription>
                  Current booking status breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: "Confirmed",
                          value: data.confirmedBookings,
                          color: STATUS_COLORS.CONFIRMED,
                        },
                        {
                          name: "Pending",
                          value: data.pendingBookings,
                          color: STATUS_COLORS.PENDING,
                        },
                        {
                          name: "Completed",
                          value: data.completedBookings,
                          color: STATUS_COLORS.COMPLETED,
                        },
                        {
                          name: "Cancelled",
                          value: data.cancelledBookings,
                          color: STATUS_COLORS.CANCELLED,
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value, percent }: any) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {[
                        {
                          name: "Confirmed",
                          value: data.confirmedBookings,
                          color: STATUS_COLORS.CONFIRMED,
                        },
                        {
                          name: "Pending",
                          value: data.pendingBookings,
                          color: STATUS_COLORS.PENDING,
                        },
                        {
                          name: "Completed",
                          value: data.completedBookings,
                          color: STATUS_COLORS.COMPLETED,
                        },
                        {
                          name: "Cancelled",
                          value: data.cancelledBookings,
                          color: STATUS_COLORS.CANCELLED,
                        },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Bookings</CardTitle>
                <CardDescription>Booking trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.monthlyBookingStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="confirmed"
                      stackId="a"
                      fill={STATUS_COLORS.CONFIRMED}
                    />
                    <Bar
                      dataKey="pending"
                      stackId="a"
                      fill={STATUS_COLORS.PENDING}
                    />
                    <Bar
                      dataKey="completed"
                      stackId="a"
                      fill={STATUS_COLORS.COMPLETED}
                    />
                    <Bar
                      dataKey="cancelled"
                      stackId="a"
                      fill={STATUS_COLORS.CANCELLED}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Distribution of payment methods used
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {data.paymentMethodStats.map((method, index) => (
                  <div key={method.method} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {method.method}
                        </span>
                      </div>
                      <Badge variant="secondary">{method.count}</Badge>
                    </div>
                    <Progress
                      value={method.percentage}
                      className="w-full h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{method.percentage.toFixed(1)}%</span>
                      <span>{formatCurrency(method.totalAmount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hotels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Hotels</CardTitle>
              <CardDescription>
                Hotels with highest revenue and occupancy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topPerformingHotels.map((hotel, index) => (
                  <div
                    key={hotel.hotelId}
                    className="flex items-center space-x-4 p-4 border rounded-lg"
                  >
                    <Badge
                      variant="outline"
                      className="w-8 h-8 flex items-center justify-center"
                    >
                      #{index + 1}
                    </Badge>

                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={hotel.thumbnail}
                        alt={hotel.hotelName}
                      />
                      <AvatarFallback>
                        <Building className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-1">
                      <h4 className="text-sm font-semibold">
                        {hotel.hotelName}
                      </h4>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>{hotel.totalBookings} bookings</span>
                        <span>•</span>
                        <span>{hotel.occupancyRate.toFixed(1)}% occupied</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-semibold">
                        {formatCurrency(hotel.totalRevenue)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Revenue
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>
              Latest booking activity from your customers
            </CardDescription>
          </div>

          <Button>
            <Link href="/admin/bookings">see all</Link>
          </Button>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {data.recentBookings.slice(0, 2).map((booking) => (
              <div
                key={booking.bookingId}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {booking.userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {booking.userName}
                      </span>
                      <Badge
                        variant={
                          booking.status === "CONFIRMED"
                            ? "default"
                            : booking.status === "PENDING"
                            ? "secondary"
                            : booking.status === "COMPLETED"
                            ? "outline"
                            : "destructive"
                        }
                        className="text-xs"
                      >
                        {booking.status.toLowerCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Hotel className="h-3 w-3" />
                      <span>{booking.hotelName}</span>
                      <span>•</span>
                      <span>{booking.roomName}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                        {new Date(booking.checkOut).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-semibold">
                    {formatCurrency(booking.amount)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
