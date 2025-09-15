// app/about/page.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section - Tropical Paradise */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Bali Rice Terraces Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 transition-transform duration-[20s] ease-linear"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-teal-900/70 to-blue-900/80"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50"></div>
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-400/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-teal-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="mb-6">
            <span className="inline-block px-6 py-3 bg-white/15 backdrop-blur-md rounded-full text-white/95 text-sm font-medium border border-white/30 shadow-lg">
              Jelajahi Dunia Bersama Kami
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
            Eksplorasi
            <span className="block bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
              Destinasi Impian
            </span>
            Anda
          </h1>

          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
            Mitra terpercaya dalam menemukan akomodasi terbaik dan menciptakan
            pengalaman wisata tak terlupakan di destinasi eksotis dunia
          </p>
        </div>
      </section>

      {/* Story Section dengan Santorini */}
      <section className="py-20 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Perjalanan Kami
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Dimulai dari kecintaan kami pada keindahan alam Indonesia dan
                  destinasi eksotis dunia, kami berdedikasi untuk menghadirkan
                  pengalaman wisata yang autentik dan tak terlupakan sejak 2020.
                </p>
                <p>
                  Dari pantai pristine Bali hingga pegunungan Alps yang megah,
                  dari keajaiban Santorini hingga kemewahan Maldives - kami
                  telah membantu ribuan wisatawan menemukan destinasi impian
                  mereka.
                </p>
                <p>
                  Komitmen kami sederhana: menghubungkan Anda dengan keindahan
                  dunia melalui akomodasi berkualitas, pengalaman lokal yang
                  autentik, dan layanan yang melampaui ekspektasi.
                </p>
              </div>
            </div>

            <Card className="rounded-3xl overflow-hidden shadow-2xl border-0 group hover:shadow-3xl transition-all duration-700">
              <div
                className="aspect-[4/3] bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`,
                }}
              ></div>
            </Card>
          </div>
        </div>
      </section>

      {/* Destinations Showcase Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950/50 dark:to-blue-950/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Destinasi Favorit Kami
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Jelajahi keindahan alam dan budaya dari destinasi paling menawan
              di dunia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Maldives */}
            <Card className="group hover:shadow-2xl transition-all duration-700 border-0 rounded-3xl overflow-hidden hover:scale-105">
              <div
                className="aspect-[4/3] bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`,
                }}
              >
                <div className="w-full h-full bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2"> Maldives</h3>
                    <p className="text-sm text-white/90">
                      Paradise on Earth - Overwater Villas
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Swiss Alps */}
            <Card className="group hover:shadow-2xl transition-all duration-700 border-0 rounded-3xl overflow-hidden hover:scale-105">
              <div
                className="aspect-[4/3] bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1531366936337-7c912a4589a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`,
                }}
              >
                <div className="w-full h-full bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2"> Swiss Alps</h3>
                    <p className="text-sm text-white/90">
                      Majestic Mountains & Alpine Luxury
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Bali */}
            <Card className="group hover:shadow-2xl transition-all duration-700 border-0 rounded-3xl overflow-hidden hover:scale-105">
              <div
                className="aspect-[4/3] bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`,
                }}
              >
                <div className="w-full h-full bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2"> Bali</h3>
                    <p className="text-sm text-white/90">
                      Tropical Paradise & Cultural Heritage
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Japanese Gardens */}
            <Card className="group hover:shadow-2xl transition-all duration-700 border-0 rounded-3xl overflow-hidden hover:scale-105">
              <div
                className="aspect-[4/3] bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`,
                }}
              >
                <div className="w-full h-full bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2"> Jepang</h3>
                    <p className="text-sm text-white/90">
                      Cherry Blossoms & Zen Gardens
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tuscany */}
            <Card className="group hover:shadow-2xl transition-all duration-700 border-0 rounded-3xl overflow-hidden hover:scale-105">
              <div
                className="aspect-[4/3] bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`,
                }}
              >
                <div className="w-full h-full bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2"> Tuscany</h3>
                    <p className="text-sm text-white/90">
                      Rolling Hills & Renaissance Beauty
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Northern Lights */}
            <Card className="group hover:shadow-2xl transition-all duration-700 border-0 rounded-3xl overflow-hidden hover:scale-105">
              <div
                className="aspect-[4/3] bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1531366936337-7c912a4589a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`,
                }}
              >
                <div className="w-full h-full bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2"> Iceland</h3>
                    <p className="text-sm text-white/90">
                      Northern Lights & Natural Wonders
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section dengan tema Travel */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Filosofi Perjalanan Kami
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Prinsip-prinsip yang memandu setiap langkah dalam menciptakan
              pengalaman wisata terbaik
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Adventure */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 rounded-3xl bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-950/20 dark:to-red-950/20 hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                  <span className="text-2xl">🏔️</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Petualangan
                </h3>
                <p className="text-muted-foreground">
                  Setiap perjalanan adalah petualangan baru yang membuka mata
                  terhadap keajaiban dunia.
                </p>
              </CardContent>
            </Card>

            {/* Authenticity */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/20 dark:to-emerald-950/20 hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                  <span className="text-2xl">🏛️</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Autentisitas
                </h3>
                <p className="text-muted-foreground">
                  Menghadirkan pengalaman budaya lokal yang murni dan tak
                  terlupakan.
                </p>
              </CardContent>
            </Card>

            {/* Sustainability */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-950/20 dark:to-cyan-950/20 hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                  <span className="text-2xl">🌱</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Berkelanjutan
                </h3>
                <p className="text-muted-foreground">
                  Wisata bertanggung jawab yang melestarikan keindahan alam
                  untuk generasi mendatang.
                </p>
              </CardContent>
            </Card>

            {/* Wonder */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950/20 dark:to-pink-950/20 hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Keajaiban
                </h3>
                <p className="text-muted-foreground">
                  Percaya bahwa setiap destinasi memiliki keajaiban unik yang
                  menanti untuk ditemukan.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Experience Highlights */}
      <section className="py-20 bg-gradient-to-br from-muted/30 via-background to-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Pengalaman Istimewa
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Koleksi momen tak terlupakan dari para pelanggan yang telah
              menjelajahi dunia bersama kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sunrise Experience */}
            <Card className="group hover:shadow-2xl transition-all duration-700 border-0 rounded-3xl overflow-hidden hover:scale-105">
              <div
                className="aspect-[3/4] bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`,
                }}
              >
                <div className="w-full h-full bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-xl font-bold mb-2">
                      Sunrise di Himalaya
                    </h3>
                    <p className="text-sm text-white/80">
                      Menyaksikan matahari terbit dari puncak dunia
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Beach Paradise */}
            <Card className="group hover:shadow-2xl transition-all duration-700 border-0 rounded-3xl overflow-hidden hover:scale-105">
              <div
                className="aspect-[3/4] bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`,
                }}
              >
                <div className="w-full h-full bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-xl font-bold mb-2">
                      Pantai Tersembunyi
                    </h3>
                    <p className="text-sm text-white/80">
                      Ketenangan di surga tersembunyi Karibia
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Cultural Experience */}
            <Card className="group hover:shadow-2xl transition-all duration-700 border-0 rounded-3xl overflow-hidden hover:scale-105">
              <div
                className="aspect-[3/4] bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`,
                }}
              >
                <div className="w-full h-full bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-xl font-bold mb-2">Kemegahan Angkor</h3>
                    <p className="text-sm text-white/80">
                      Menjelajahi keajaiban arsitektur kuno
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="text-center p-8 rounded-3xl border-0 bg-gradient-to-br from-emerald-500 to-teal-600 text-white hover:scale-105 transition-transform duration-500 shadow-2xl">
              <div className="text-4xl md:text-5xl font-bold mb-2">75K+</div>
              <p className="text-lg text-white/90">Traveler Bahagia</p>
            </Card>

            <Card className="text-center p-8 rounded-3xl border-0 bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:scale-105 transition-transform duration-500 shadow-2xl">
              <div className="text-4xl md:text-5xl font-bold mb-2">200+</div>
              <p className="text-lg text-white/90">Destinasi Premium</p>
            </Card>

            <Card className="text-center p-8 rounded-3xl border-0 bg-gradient-to-br from-purple-500 to-pink-600 text-white hover:scale-105 transition-transform duration-500 shadow-2xl">
              <div className="text-4xl md:text-5xl font-bold mb-2">150+</div>
              <p className="text-lg text-white/90">Negara Terjangkau</p>
            </Card>

            <Card className="text-center p-8 rounded-3xl border-0 bg-gradient-to-br from-orange-500 to-red-500 text-white hover:scale-105 transition-transform duration-500 shadow-2xl">
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <p className="text-lg text-white/90">Travel Support</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section dengan Mountain Background */}
      <section className="relative py-20 overflow-hidden">
        {/* Machu Picchu Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/85 via-teal-900/80 to-blue-900/85"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Waktunya Petualangan Dimulai!
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
            Bergabunglah dengan ribuan traveler yang telah menemukan destinasi
            impian mereka. Mulai petualangan tak terlupakan Anda hari ini.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/">
              <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                Jelajahi Destinasi
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
