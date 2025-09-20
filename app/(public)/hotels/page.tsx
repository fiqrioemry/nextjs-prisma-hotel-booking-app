import React from "react";
import { Metadata } from "next";
import { getHotels } from "@/lib/actions/hotels";
import { HotelsParams } from "@/lib/types/hotels";
import { HotelsListPreview } from "@/components/hotels/hotels-lists-preview";

export const metadata: Metadata = {
  title: "Hotels - Pesan Hotel",
  description: "Explore our range of hotels and find the perfect stay.",
};

export default async function Page(props: {
  searchParams: Promise<HotelsParams>;
}) {
  const params = await props.searchParams;

  const hotels = await getHotels({
    q: params?.q || "",
    location: params?.location || "",
    startDate: params?.startDate || "",
    endDate: params?.endDate || "",
    page: Number(params?.page) || 1,
    limit: Number(params?.limit) || 8,
    sort: params?.sort || "newest",
  });

  return (
    <section className="px-4 mt-14 py-12 max-w-7xl mx-auto w-full min-h-screen">
      <HotelsListPreview
        hotels={hotels.data}
        meta={hotels.meta}
        params={params}
      />
    </section>
  );
}
