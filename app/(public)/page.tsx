// app/page.tsx
"use client";

import z from "zod";
import { useRouter } from "next/navigation";
import { FormProvider } from "react-hook-form";
import { locationOptions } from "@/lib/constant";
import { useFormSchema } from "@/hooks/use-form-schema";
import { Card, CardContent } from "@/components/ui/card";
import { DateField } from "@/components/form-fields/date-field";
import { SelectField } from "@/components/form-fields/select-field";
import { SubmitButton } from "@/components/form-control/submit-button";

const SearchSchema = z.object({
  location: z.string().min(1, "Location is required"),
  startDate: z.string().min(1, "Start date required"),
  endDate: z.string().min(1, "End date required"),
});

type SearchForm = z.infer<typeof SearchSchema>;

export default function HomePage() {
  const router = useRouter();
  const location = "";
  const startDate = new Date().toISOString().split("T")[0];
  const endDate = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const defaultState = {
    location: location || "",
    startDate: startDate || "",
    endDate: endDate || "",
  };

  const form = useFormSchema({
    schema: SearchSchema,
    action: handleSearch,
    state: defaultState,
    mode: "onChange",
  });

  async function handleSearch(data: SearchForm) {
    const params = new URLSearchParams({
      location: data.location,
      startDate: data.startDate,
      endDate: data.endDate,
    });
    router.push(`/hotels?${params.toString()}`);
  }

  return (
    <main className="relative min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-500 to-cyan-400 text-white">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">
            Find Your Perfect Stay
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90">
            Book hotels easily with the best deals and availability.
          </p>

          {/* Search Card */}
          <Card className="max-w-4xl mx-auto mt-10 shadow-2xl border-0 rounded-2xl overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <FormProvider {...form.methods}>
                <form
                  onSubmit={form.handleSubmit}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
                >
                  <SelectField
                    name="location"
                    label="Location"
                    placeholder="Select a city"
                    options={locationOptions}
                  />

                  <DateField name="startDate" label="Check-in" />
                  <DateField name="endDate" label="Check-out" />

                  <SubmitButton
                    text="Search Hotels"
                    isLoading={form.isSubmitting}
                    disabled={!form.isValid || form.isSubmitting}
                    className="w-full h-12 text-lg font-semibold"
                  />
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-xl font-bold">Best Price Guarantee</h3>
            <p className="mt-2 text-muted-foreground">
              Get the lowest prices on your favorite destinations.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold">24/7 Support</h3>
            <p className="mt-2 text-muted-foreground">
              We’re here to help you anytime, anywhere.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold">Easy Booking</h3>
            <p className="mt-2 text-muted-foreground">
              Book your hotel in just a few clicks.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
