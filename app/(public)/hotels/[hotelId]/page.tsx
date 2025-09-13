import { Metadata } from "next";
import { getHotelById, HotelDetailParams } from "@/lib/actions/hotels";
import { HotelDetailPreview } from "@/components/hotel-detail/hotel-detail-preview";

export const metadata: Metadata = {
  title: "Hotel Detail - Hotel Booking",
  description: "Explore our range of hotels and find the perfect stay.",
};

export default async function Page({
  params,
  searchParams,
}: {
  params: { hotelId: string };
  searchParams: Omit<HotelDetailParams, "hotelId">;
}) {
  const hotel = await getHotelById({
    hotelId: params.hotelId,
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
    location: searchParams.location,
  });

  if (!hotel) {
    return (
      <section className="h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Hotel not found.</p>
      </section>
    );
  }

  return (
    <section className="py-12 flex items-center justify-center">
      <HotelDetailPreview hotel={hotel} />
    </section>
  );
}
