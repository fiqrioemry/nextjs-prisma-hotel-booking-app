// app/page.tsx
"use client";

import z from "zod";
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

export default function HomePage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const location = "";
  const startDate = new Date().toUTCString().split(" ")[0];
  const endDate = new Date(Date.now() + 86400000).toUTCString().split(" ")[0];

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

  // Page load animation
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Mouse movement effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

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
      {/* Hero Section with Enhanced Animations */}
      <section className="relative flex-1 flex items-center justify-center overflow-hidden min-h-screen">
        {/* Animated Background with Parallax Effect */}
        <div
          className={`
            absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-[3000ms] ease-out
            ${isLoaded ? "scale-100 opacity-100" : "scale-110 opacity-0"}
          `}
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80')`,
            transform: `translate(${mousePosition.x * 0.01}px, ${
              mousePosition.y * 0.01
            }px)`,
          }}
        >
          {/* Enhanced gradient overlays with animation */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-blue-900/60 to-emerald-900/70 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
        </div>

        {/* Enhanced floating elements with travel theme */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating orbs with different animations */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-bounce-slow"></div>
          <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-blue-400/15 rounded-full blur-3xl animate-pulse delay-500"></div>
          <div className="absolute top-10 right-1/3 w-56 h-56 bg-teal-400/18 rounded-full blur-3xl animate-float"></div>

          {/* Animated particles */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white/30 rounded-full animate-float-slow"></div>
          <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-cyan-300/40 rounded-full animate-float delay-1000"></div>
          <div className="absolute top-1/2 right-1/2 w-2 h-2 bg-emerald-300/50 rounded-full animate-bounce-slow delay-500"></div>
        </div>

        <div
          className={`
          relative z-10 text-center px-4 md:px-8 max-w-7xl py-16 mx-auto
          transform transition-all duration-1000 ease-out
          ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}
        `}
        >
          {/* Badge with slide-in animation */}
          <div
            className={`
            mb-8 transform transition-all duration-1000 ease-out delay-300
            ${
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }
          `}
          >
            <span className="inline-block px-6 py-3 bg-white/20 backdrop-blur-md rounded-full text-white/95 text-sm font-medium border border-white/30 shadow-lg hover:bg-white/25 hover:scale-105 transition-all duration-300 cursor-pointer">
              Jelajahi Keajaiban Dunia
            </span>
          </div>

          {/* Main title with typewriter effect */}
          <h1
            className={`
            text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 leading-tight
            transform transition-all duration-1000 ease-out delay-500
            ${
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-20 opacity-0"
            }
          `}
          >
            Temukan
            <span className="block bg-gradient-to-r from-emerald-300 via-cyan-300 to-teal-300 bg-clip-text text-transparent animate-gradient-x">
              Destinasi Impian
            </span>
          </h1>

          {/* Subtitle with fade-in */}
          <p
            className={`
            text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed
            transform transition-all duration-1000 ease-out delay-700
            ${
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-20 opacity-0"
            }
          `}
          >
            Rasakan petualangan tak terlupakan dengan akomodasi terbaik di
            destinasi paling menawan di seluruh dunia
          </p>

          {/* Enhanced Search Card with scale-in animation */}
          <Card
            className={`
            max-w-6xl mx-auto shadow-2xl border-0 rounded-3xl  overflow-hidden backdrop-blur-md  bg-white/95 dark:bg-slate-900/95
            transform transition-all duration-1000 ease-out delay-1000
            hover:shadow-3xl hover:scale-105
            ${isLoaded ? "scale-100 opacity-100" : "scale-95 opacity-0"}
          `}
          >
            <CardContent className="p-8 md:p-12">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-3 animate-fade-in">
                  Mulai Petualangan Anda
                </h2>
                <p className="text-muted-foreground text-lg animate-fade-in-up">
                  Booking akomodasi impian hanya dalam hitungan detik
                </p>
              </div>

              <FormProvider {...form.methods}>
                <form
                  onSubmit={form.handleSubmit}
                  className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end"
                >
                  {/* Animated form fields */}
                  <div className="space-y-2 transform transition-all duration-500 ease-out delay-1200 hover:scale-105">
                    <SelectField
                      name="location"
                      label="🌏 Destinasi"
                      placeholder="Pilih tujuan wisata Anda"
                      options={locationOptions}
                    />
                  </div>

                  <div className="space-y-2 transform transition-all duration-500 ease-out delay-1300 hover:scale-105">
                    <DateField name="startDate" label="📅 Check-in" />
                  </div>

                  <div className="space-y-2 transform transition-all duration-500 ease-out delay-1400 hover:scale-105">
                    <DateField
                      name="endDate"
                      label="📅 Check-out"
                      minDateFrom={form.methods.watch("startDate")}
                    />
                  </div>

                  <SubmitButton
                    text="🔍 Cari Hotel"
                    isLoading={form.isSubmitting}
                    disabled={!form.isValid || form.isSubmitting}
                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 active:scale-95"
                  />
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Enhanced Feature Section with Stagger Animation */}
      <section className="relative py-20 overflow-hidden">
        {/* Animated background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] ease-linear animate-ken-burns"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-blue-50/90 to-cyan-50/95 dark:from-slate-900/95 dark:via-slate-800/90 dark:to-slate-900/95"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Section title with slide-up animation */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-slide-in-left">
              Mengapa Memilih Kami?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-slide-in-right">
              Rasakan perbedaan dengan layanan premium dan kepuasan pelanggan
              yang tak tertandingi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 - Enhanced with hover animations */}
            <Card className="group hover:shadow-2xl transition-all duration-700 border-0 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950/20 dark:to-teal-950/20 hover:scale-110 hover:-translate-y-2 backdrop-blur-sm animate-fade-in-up delay-300 cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="relative w-20 h-20 mx-auto mb-6 overflow-hidden rounded-2xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1464822759844-d150baec0200?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80')`,
                    }}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-emerald-500/80 to-teal-600/80 flex items-center justify-center group-hover:from-emerald-400/90 group-hover:to-teal-500/90 transition-all duration-300">
                      <span className="text-3xl animate-bounce-slow">💰</span>
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-emerald-600 transition-colors duration-300">
                  Harga Terbaik Terjamin
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed group-hover:text-emerald-700 transition-colors duration-300">
                  Dapatkan harga terendah untuk destinasi favorit Anda dengan
                  penawaran tak tertandingi dan promo eksklusif
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 - Enhanced with hover animations */}
            <Card className="group hover:shadow-2xl transition-all duration-700 border-0 rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-950/20 dark:to-cyan-950/20 hover:scale-110 hover:-translate-y-2 backdrop-blur-sm animate-fade-in-up delay-500 cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="relative w-20 h-20 mx-auto mb-6 overflow-hidden rounded-2xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80')`,
                    }}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-blue-500/80 to-cyan-600/80 flex items-center justify-center group-hover:from-blue-400/90 group-hover:to-cyan-500/90 transition-all duration-300">
                      <span className="text-3xl animate-spin-slow">🛟</span>
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  Support 24/7
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed group-hover:text-blue-700 transition-colors duration-300">
                  Kami siap membantu Anda kapan saja, di mana saja dengan tim
                  customer support terdedikasi
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 - Enhanced with hover animations */}
            <Card className="group hover:shadow-2xl transition-all duration-700 border-0 rounded-3xl bg-gradient-to-br from-orange-50 to-pink-100 dark:from-orange-950/20 dark:to-pink-950/20 hover:scale-110 hover:-translate-y-2 backdrop-blur-sm animate-fade-in-up delay-700 cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="relative w-20 h-20 mx-auto mb-6 overflow-hidden rounded-2xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80')`,
                    }}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-orange-500/80 to-pink-600/80 flex items-center justify-center group-hover:from-orange-400/90 group-hover:to-pink-500/90 transition-all duration-300">
                      <span className="text-3xl animate-pulse">⚡</span>
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-orange-600 transition-colors duration-300">
                  Booking Mudah
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed group-hover:text-orange-700 transition-colors duration-300">
                  Pesan hotel impian Anda hanya dengan beberapa klik melalui
                  proses booking yang intuitif dan mudah
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Destinations with Enhanced Animations */}
      <section className="relative py-20 overflow-hidden">
        {/* Animated Mountain Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-ken-burns-reverse"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1464822759844-d150baec0200?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-blue-900/80 to-emerald-900/85"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Destinasi Populer
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Jelajahi koleksi destinasi paling diminati traveler di seluruh
              dunia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Bali - Enhanced animations */}
            <Card className="group hover:shadow-2xl transition-all duration-700 border-0 rounded-3xl overflow-hidden hover:scale-110 hover:-translate-y-4 bg-white/10 backdrop-blur-md animate-fade-in-up delay-300 cursor-pointer">
              <div
                className="aspect-[4/3] bg-cover bg-center group-hover:scale-125 transition-transform duration-1000"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`,
                }}
              >
                <div className="w-full h-full bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6 group-hover:from-black/90 transition-all duration-300">
                  <div className="text-white transform transition-all duration-500 group-hover:translate-y-0 translate-y-2">
                    <h3 className="text-2xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                      Bali, Indonesia
                    </h3>
                    <p className="text-sm text-white/90 group-hover:text-white transition-colors duration-300">
                      Pulau Dewata yang Memukau
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Santorini - Enhanced animations */}
            <Card className="group hover:shadow-2xl transition-all duration-700 border-0 rounded-3xl overflow-hidden hover:scale-110 hover:-translate-y-4 bg-white/10 backdrop-blur-md animate-fade-in-up delay-500 cursor-pointer">
              <div
                className="aspect-[4/3] bg-cover bg-center group-hover:scale-125 transition-transform duration-1000"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`,
                }}
              >
                <div className="w-full h-full bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6 group-hover:from-black/90 transition-all duration-300">
                  <div className="text-white transform transition-all duration-500 group-hover:translate-y-0 translate-y-2">
                    <h3 className="text-2xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                      Santorini, Greece
                    </h3>
                    <p className="text-sm text-white/90 group-hover:text-white transition-colors duration-300">
                      Sunset Paradise
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Swiss Alps - Enhanced animations */}
            <Card className="group hover:shadow-2xl transition-all duration-700 border-0 rounded-3xl overflow-hidden hover:scale-110 hover:-translate-y-4 bg-white/10 backdrop-blur-md animate-fade-in-up delay-700 cursor-pointer">
              <div
                className="aspect-[4/3] bg-cover bg-center group-hover:scale-125 transition-transform duration-1000"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1531366936337-7c912a4589a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`,
                }}
              >
                <div className="w-full h-full bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6 group-hover:from-black/90 transition-all duration-300">
                  <div className="text-white transform transition-all duration-500 group-hover:translate-y-0 translate-y-2">
                    <h3 className="text-2xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                      Swiss Alps
                    </h3>
                    <p className="text-sm text-white/90 group-hover:text-white transition-colors duration-300">
                      Alpine Luxury & Adventure
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Custom CSS for additional animations */}
      <style jsx>{`
        @keyframes gradient-x {
          0%,
          100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        @keyframes ken-burns {
          0% {
            transform: scale(1) rotate(0deg);
          }
          100% {
            transform: scale(1.1) rotate(1deg);
          }
        }

        @keyframes ken-burns-reverse {
          0% {
            transform: scale(1.1) rotate(1deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }

        .animate-ken-burns {
          animation: ken-burns 20s ease-in-out infinite alternate;
        }

        .animate-ken-burns-reverse {
          animation: ken-burns-reverse 25s ease-in-out infinite alternate;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-in-out;
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out;
        }

        .animate-slide-in-left {
          animation: slideInLeft 1s ease-out;
        }

        .animate-slide-in-right {
          animation: slideInRight 1s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .delay-300 {
          animation-delay: 300ms;
        }

        .delay-500 {
          animation-delay: 500ms;
        }

        .delay-700 {
          animation-delay: 700ms;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }

        .delay-1200 {
          animation-delay: 1200ms;
        }

        .delay-1300 {
          animation-delay: 1300ms;
        }

        .delay-1400 {
          animation-delay: 1400ms;
        }
      `}</style>
    </main>
  );
}
