"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
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

  if (!mounted) return null;

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80')`,
          transform: `translate(${mousePosition.x * 0.02}px, ${
            mousePosition.y * 0.02
          }px)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-blue-900/75 to-emerald-900/85"></div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-purple-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Animated particles */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white/30 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-emerald-300/40 rounded-full animate-ping delay-700"></div>
        <div className="absolute top-1/2 right-1/2 w-2 h-2 bg-blue-300/50 rounded-full animate-ping delay-1000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center w-full px-6 max-w-5xl mx-auto">
        <div className="relative flex flex-col gap-12 items-center justify-center text-center">
          {/* Enhanced Error badge */}
          <div className="inline-flex h-16 w-fit items-center justify-center gap-3 rounded-full bg-white/20 backdrop-blur-md px-8 border border-white/30 shadow-xl">
            <span className="text-6xl">🏨</span>
            <span className="text-2xl font-bold text-white">404</span>
          </div>

          {/* Enhanced Main content */}
          <div className="flex flex-col items-center justify-center gap-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tighter text-white leading-tight">
              Halaman Tidak
              <span className="block bg-gradient-to-r from-emerald-300 via-cyan-300 to-teal-300 bg-clip-text text-transparent animate-pulse">
                Ditemukan
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-medium text-balance leading-relaxed tracking-tight max-w-3xl">
              Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
              Mari kembali mencari hotel impian Anda!
            </p>
          </div>

          {/* Enhanced Call to action with multiple options */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button
              asChild
              className="group h-14 rounded-2xl w-48 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <Link href="/">
                <Home className="w-5 h-5 mr-2" />
                <span className="font-bold">Beranda</span>
              </Link>
            </Button>

            <Button
              asChild
              className="group h-14 rounded-2xl w-48 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <Link href="/hotels">
                <Search className="w-5 h-5 mr-2" />
                <span className="font-bold">Cari Hotel</span>
              </Link>
            </Button>
          </div>

          {/* Enhanced Help section */}
          <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto">
                  <MapPin className="w-8 h-8 text-white" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Butuh Bantuan Menemukan Hotel?
                  </h3>
                  <p className="text-white/80 leading-relaxed mb-6">
                    Tim customer service kami siap membantu Anda menemukan
                    akomodasi terbaik sesuai kebutuhan dan budget Anda
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    className="bg-blue-500/80 hover:bg-blue-600/90 text-white border-0 rounded-xl py-3 backdrop-blur-sm transition-all duration-300"
                    asChild
                  >
                    <Link href="/contact">Hubungi Kami</Link>
                  </Button>

                  <Button
                    className="bg-emerald-500/80 hover:bg-emerald-600/90 text-white border-0 rounded-xl py-3 backdrop-blur-sm transition-all duration-300"
                    asChild
                  >
                    <a
                      href="https://wa.me/6281234567890"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Popular destinations suggestion */}
          <Card className="w-full max-w-4xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h4 className="text-xl font-bold text-white mb-2">
                  Atau Jelajahi Destinasi Populer
                </h4>
                <p className="text-white/70 text-sm">
                  Temukan hotel-hotel terbaik di destinasi favorit traveler
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: "Bali", emoji: "🌺", link: "/hotels?location=Bali" },
                  {
                    name: "Jakarta",
                    emoji: "🏙️",
                    link: "/hotels?location=Jakarta",
                  },
                  {
                    name: "Yogyakarta",
                    emoji: "🏛️",
                    link: "/hotels?location=Yogyakarta",
                  },
                ].map((destination) => (
                  <Button
                    key={destination.name}
                    asChild
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl py-4 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                  >
                    <Link href={destination.link}>
                      <span className="text-2xl mr-2">{destination.emoji}</span>
                      <span className="font-medium">{destination.name}</span>
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced decorative elements */}
      <div className="absolute -bottom-8 inset-x-0 h-8 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 blur-2xl rounded-full opacity-60"></div>
    </section>
  );
}
