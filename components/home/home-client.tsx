"use client";

import { z } from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormProvider } from "react-hook-form";
import { locationOptions } from "@/lib/constant";
import { useFormSchema } from "@/hooks/use-form-schema";
import { Card, CardContent } from "@/components/ui/card";
import { DateField } from "@/components/form-fields/date-field";
import { SelectField } from "@/components/form-fields/select-field";
import { SubmitButton } from "@/components/form-control/submit-button";

const today = new Date();

const SearchSchema = z
  .object({
    location: z.string().min(1, "Location is required"),
    startDate: z.string().min(1, "Start date required"),
    endDate: z.string().min(1, "End date required"),
  })
  .refine((data) => new Date(data.startDate) >= today, {
    path: ["startDate"],
    message: "Check-in cannot be before today",
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    path: ["endDate"],
    message: "Check-out must be after check-in",
  });

type SearchForm = z.infer<typeof SearchSchema>;

export function HomeClient() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const defaultState = {
    location: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
  };

  const form = useFormSchema({
    schema: SearchSchema,
    action: handleSearch,
    state: defaultState,
    mode: "onChange",
  });

  // Page load animation
  useEffect(() => setIsLoaded(true), []);

  // Mouse movement effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) =>
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  async function handleSearch(data: SearchForm) {
    const params = new URLSearchParams({
      location: data.location,
      startDate: data.startDate,
      endDate: data.endDate,
    });
    router.push(`/hotels?${params.toString()}`);
  }

  return (
    <main className="relative min-h-screen flex flex-col bg-background overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center overflow-hidden min-h-screen">
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-[3000ms] ease-out
          ${isLoaded ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2340&q=80')`,
            transform: `translate(${mousePosition.x * 0.01}px, ${
              mousePosition.y * 0.01
            }px)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-blue-900/60 to-emerald-900/70"></div>
        </div>

        <div
          className={`relative z-10 text-center px-4 md:px-8 max-w-7xl py-16 mx-auto transform transition-all duration-1000 ease-out ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
          }`}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6">
            Temukan{" "}
            <span className="block bg-gradient-to-r from-emerald-300 via-cyan-300 to-teal-300 bg-clip-text text-transparent animate-gradient-x">
              Destinasi Impian
            </span>
          </h1>

          <Card
            className={`max-w-6xl mx-auto shadow-2xl border-0 rounded-3xl bg-white/95 dark:bg-slate-900/95 transform transition-all duration-1000 delay-1000 ${
              isLoaded ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            <CardContent className="p-8 md:p-12">
              <FormProvider {...form.methods}>
                <form
                  onSubmit={form.handleSubmit}
                  className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end"
                >
                  <SelectField
                    name="location"
                    label="🌏 Destinasi"
                    placeholder="Pilih tujuan wisata Anda"
                    options={locationOptions}
                  />
                  <DateField name="startDate" label="📅 Check-in" />
                  <DateField
                    name="endDate"
                    label="📅 Check-out"
                    minDateFrom={form.methods.watch("startDate")}
                  />
                  <SubmitButton
                    text="🔍 Cari Hotel"
                    isLoading={form.isSubmitting}
                    disabled={!form.isValid || form.isSubmitting}
                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl"
                  />
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
