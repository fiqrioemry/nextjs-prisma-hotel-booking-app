// app/contact/page.tsx
"use client";

import z from "zod";
import { FormProvider } from "react-hook-form";
import { useFormSchema } from "@/hooks/use-form-schema";
import { Card, CardContent } from "@/components/ui/card";
import { SubmitButton } from "@/components/form-control/submit-button";
import { useState, useEffect } from "react";

const ContactSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().min(10, "Nomor telepon minimal 10 digit"),
  subject: z.string().min(5, "Subjek minimal 5 karakter"),
  message: z.string().min(20, "Pesan minimal 20 karakter"),
});

type ContactForm = z.infer<typeof ContactSchema>;

export default function ContactPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const defaultState = {
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  };

  const form = useFormSchema({
    schema: ContactSchema,
    action: handleSubmit,
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

  async function handleSubmit(data: ContactForm) {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Contact form submitted:", data);
    setIsSubmitted(true);
    form.methods.reset();

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  }

  return (
    <main className="relative min-h-screen flex flex-col bg-background overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center overflow-hidden min-h-screen">
        {/* Animated Background */}
        <div
          className={`
              absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-[3000ms] ease-out
              ${isLoaded ? "scale-100 opacity-100" : "scale-110 opacity-0"}
            `}
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80')`,
            transform: `translate(${mousePosition.x * 0.01}px, ${
              mousePosition.y * 0.01
            }px)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/70 via-purple-900/60 to-pink-900/70 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-bounce-slow"></div>
          <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-indigo-400/15 rounded-full blur-3xl animate-pulse delay-500"></div>
          <div className="absolute top-10 right-1/3 w-56 h-56 bg-violet-400/18 rounded-full blur-3xl animate-float"></div>

          {/* Animated particles */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white/30 rounded-full animate-float-slow"></div>
          <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-300/40 rounded-full animate-float delay-1000"></div>
          <div className="absolute top-1/2 right-1/2 w-2 h-2 bg-pink-300/50 rounded-full animate-bounce-slow delay-500"></div>
        </div>

        <div
          className={`
            relative z-10 text-center px-4 md:px-8 max-w-7xl py-16 mx-auto
            transform transition-all duration-1000 ease-out
            ${
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-20 opacity-0"
            }
          `}
        >
          {/* Badge */}
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
              Hubungi Kami Sekarang
            </span>
          </div>

          {/* Main title */}
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
            Mari
            <span className="block bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent animate-gradient-x">
              Berkontak
            </span>
          </h1>

          {/* Subtitle */}
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
            Kami siap membantu mewujudkan pengalaman perjalanan impian Anda.
            Hubungi tim ahli kami untuk konsultasi personal
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-ken-burns"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-purple-50/90 to-pink-50/95 dark:from-slate-900/95 dark:via-slate-800/90 dark:to-slate-900/95"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden backdrop-blur-md bg-white/95 dark:bg-slate-900/95 animate-fade-in-up">
              <CardContent className="p-8 md:p-12">
                <div className="mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 flex items-center gap-3">
                    📝 Kirim Pesan
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Ceritakan kebutuhan perjalanan Anda dan kami akan memberikan
                    solusi terbaik
                  </p>
                </div>

                {isSubmitted && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl animate-fade-in">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">✅</span>
                      <div>
                        <h3 className="text-green-800 dark:text-green-300 font-semibold">
                          Pesan Terkirim!
                        </h3>
                        <p className="text-green-600 dark:text-green-400 text-sm">
                          Tim kami akan menghubungi Anda dalam 24 jam
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <FormProvider {...form.methods}>
                  <form onSubmit={form.handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Nama Lengkap
                        </label>
                        <input
                          {...form.methods.register("name")}
                          className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:shadow-md"
                          placeholder="Masukkan nama lengkap Anda"
                        />
                        {form.methods.formState.errors.name && (
                          <p className="text-red-500 text-sm">
                            {String(form.methods.formState.errors.name.message)}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Email
                        </label>
                        <input
                          {...form.methods.register("email")}
                          type="email"
                          className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:shadow-md"
                          placeholder="nama@email.com"
                        />
                        {form.methods.formState.errors.email && (
                          <p className="text-red-500 text-sm">
                            {String(
                              form.methods.formState.errors.email.message
                            )}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          No. Telepon
                        </label>
                        <input
                          {...form.methods.register("phone")}
                          type="tel"
                          className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:shadow-md"
                          placeholder="08xxxxxxxxxx"
                        />
                        {form.methods.formState.errors.phone && (
                          <p className="text-red-500 text-sm">
                            {String(
                              form.methods.formState.errors.phone.message
                            )}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Subjek
                        </label>
                        <select
                          {...form.methods.register("subject")}
                          className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:shadow-md"
                        >
                          <option value="">Pilih subjek</option>
                          <option value="Booking Hotel">Booking Hotel</option>
                          <option value="Paket Tour"> Paket Tour</option>
                          <option value="Keluhan"> Keluhan</option>
                          <option value="Pertanyaan Umum">
                            Pertanyaan Umum
                          </option>
                          <option value="Partnership"> Partnership</option>
                        </select>
                        {form.methods.formState.errors.subject && (
                          <p className="text-red-500 text-sm">
                            {String(
                              form.methods.formState.errors.subject.message
                            )}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Pesan
                      </label>
                      <textarea
                        {...form.methods.register("message")}
                        rows={6}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:shadow-md resize-none"
                        placeholder="Ceritakan kebutuhan perjalanan Anda atau pertanyaan yang ingin disampaikan..."
                      />
                      {form.methods.formState.errors.message?.message && (
                        <p className="text-red-500 text-sm">
                          {String(
                            form.methods.formState.errors.message.message
                          )}
                        </p>
                      )}
                    </div>

                    <SubmitButton
                      text={
                        form.isSubmitting ? "Mengirim Pesan..." : "Kirim Pesan"
                      }
                      isLoading={form.isSubmitting}
                      disabled={!form.isValid || form.isSubmitting}
                      className="w-full h-14 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 active:scale-95"
                    />
                  </form>
                </FormProvider>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              {/* Contact Cards */}
              <div className="space-y-6">
                {/* Office Address */}
                <Card className="group hover:shadow-2xl transition-all duration-700 border-0 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950/20 dark:to-pink-950/20 hover:scale-105 hover:-translate-y-2 backdrop-blur-sm animate-fade-in-up delay-300 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                        🏢
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-purple-600 transition-colors duration-300">
                          Kantor Pusat
                        </h3>
                        <p className="text-muted-foreground leading-relaxed group-hover:text-purple-700 transition-colors duration-300">
                          Jl. Sudirman No. 123, Jakarta Pusat
                          <br />
                          DKI Jakarta 10220, Indonesia
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Phone */}
                <Card className="group hover:shadow-2xl transition-all duration-700 border-0 rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-950/20 dark:to-cyan-950/20 hover:scale-105 hover:-translate-y-2 backdrop-blur-sm animate-fade-in-up delay-500 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                        📞
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-blue-600 transition-colors duration-300">
                          Telepon & WhatsApp
                        </h3>
                        <p className="text-muted-foreground leading-relaxed group-hover:text-blue-700 transition-colors duration-300">
                          <a
                            href="tel:+62211234567"
                            className="block hover:underline"
                          >
                            📱 +62 21 1234 5678
                          </a>
                          <a
                            href="https://wa.me/6281234567890"
                            className="block hover:underline"
                          >
                            💬 +62 812 3456 7890
                          </a>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Email */}
                <Card className="group hover:shadow-2xl transition-all duration-700 border-0 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/20 dark:to-emerald-950/20 hover:scale-105 hover:-translate-y-2 backdrop-blur-sm animate-fade-in-up delay-700 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                        ✉️
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-green-600 transition-colors duration-300">
                          Email
                        </h3>
                        <p className="text-muted-foreground leading-relaxed group-hover:text-green-700 transition-colors duration-300">
                          <a
                            href="mailto:info@pesanhotel.com"
                            className="block hover:underline"
                          >
                            📧 info@pesanhotel.com
                          </a>
                          <a
                            href="mailto:support@pesanhotel.com"
                            className="block hover:underline"
                          >
                            🛟 support@pesanhotel.com
                          </a>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Operating Hours */}
                <Card className="group hover:shadow-2xl transition-all duration-700 border-0 rounded-3xl bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-950/20 dark:to-amber-950/20 hover:scale-105 hover:-translate-y-2 backdrop-blur-sm animate-fade-in-up delay-900 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                        🕒
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-orange-600 transition-colors duration-300">
                          Jam Operasional
                        </h3>
                        <p className="text-muted-foreground leading-relaxed group-hover:text-orange-700 transition-colors duration-300">
                          Senin - Jumat: 08:00 - 22:00
                          <br />
                          Sabtu - Minggu: 09:00 - 21:00
                          <br />
                          <span className="text-sm text-green-600 font-medium">
                            📞 Emergency 24/7 Available
                          </span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-ken-burns-reverse"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1521017432531-fbd92d768814?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-indigo-900/80 to-purple-900/85"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Temukan jawaban untuk pertanyaan umum seputar layanan kami
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Bagaimana cara melakukan booking hotel?",
                a: "Anda dapat melakukan booking melalui website kami dengan mengisi form pencarian, memilih hotel yang diinginkan, dan mengikuti proses pembayaran yang mudah dan aman.",
              },
              {
                q: " Metode pembayaran apa saja yang diterima?",
                a: "Kami menerima berbagai metode pembayaran seperti transfer bank, kartu kredit/debit, e-wallet (OVO, GoPay, Dana), dan virtual account dari bank terpercaya.",
              },
              {
                q: "Bagaimana kebijakan pembatalan booking?",
                a: "Kebijakan pembatalan bervariasi tergantung hotel dan jenis kamar. Umumnya, pembatalan gratis dapat dilakukan hingga 24-48 jam sebelum check-in.",
              },
              {
                q: "Apakah ada program loyalitas untuk pelanggan?",
                a: "Ya! Kami memiliki program HotelKu Rewards yang memberikan poin setiap booking dan berbagai benefit eksklusif untuk member setia.",
              },
            ].map((faq, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-700 border-0 rounded-3xl bg-white/10 backdrop-blur-md hover:bg-white/20 animate-fade-in-up cursor-pointer"
                style={{ animationDelay: `${(index + 1) * 200}ms` }}
              >
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">
                    {faq.q}
                  </h3>
                  <p className="text-white/80 leading-relaxed group-hover:text-white transition-colors duration-300">
                    {faq.a}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Custom CSS for animations - same as home page */}
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
        .animate-fade-in {
          animation: fadeIn 1s ease-in-out;
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out;
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
        .delay-900 {
          animation-delay: 900ms;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </main>
  );
}
