export const dynamic = "force-dynamic";

import React from "react";
import { Metadata } from "next";
import { getMyBookings } from "@/lib/actions/my";
import { UserBookingsLists } from "@/components/user/user-bookings-lists";

export const metadata: Metadata = {
  title: "Pesananku - Pesan Hotel",
  description: "Lihat dan kelola Pesan Hotels Anda.",
};

export default async function Page(props: {
  searchParams: Promise<{ page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const { data: bookings, pagination } = await getMyBookings(page, 4);

  return (
    <div className="max-w-5xl mx-auto w-full space-y-8 h-full">
      <UserBookingsLists bookings={bookings} pagination={pagination} />
    </div>
  );
}
