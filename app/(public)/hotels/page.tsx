// app/hotels/page.tsx
import { Metadata } from "next";
import { getHotels, HotelsParams } from "@/lib/actions/hotels";
import { HotelsListPreview } from "@/components/hotels/hotels-lists-preview";

export const metadata: Metadata = {
  title: "Hotels - Hotel Booking",
  description: "Explore our range of hotels and find the perfect stay.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: HotelsParams;
}) {
  const hotels = await getHotels({
    q: searchParams.q || "",
    location: searchParams.location || "",
    startDate: searchParams.startDate || "",
    endDate: searchParams.endDate || "",
    page: Number(searchParams.page) || 1,
    limit: Number(searchParams.limit) || 8,
    sort:
      (searchParams.sort as "newest" | "oldest" | "available_rooms") ||
      "newest",
  });

  return (
    <section className="py-12">
      <HotelsListPreview
        hotels={hotels.data}
        meta={hotels.meta}
        searchParams={searchParams!}
      />
    </section>
  );
}
