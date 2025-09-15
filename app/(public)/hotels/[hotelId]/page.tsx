import { Metadata } from "next";
import { getHotelById } from "@/lib/actions/hotels";
import { HotelDetailParams } from "@/lib/types/hotels";
import { HotelNotFound } from "@/components/hotel-detail/hotel-not-found";
import { HotelDetailPreview } from "@/components/hotel-detail/hotel-detail-preview";

export const metadata: Metadata = {
  title: "Hotel Detail - Pesan Hotel",
  description: "Explore our range of hotels and find the perfect stay.",
};

export default async function Page({
  params,
  searchParams,
}: {
  params: { hotelId: string };
  searchParams: Omit<HotelDetailParams, "id">;
}) {
  const hotel = await getHotelById({
    hotelId: params.hotelId,
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
  });

  if (!hotel) {
    return <HotelNotFound />;
  }

  return (
    <section className="px-4 mt-14 py-12 max-w-7xl mx-auto w-full min-h-screen">
      <HotelDetailPreview hotel={hotel} />
    </section>
  );
}
