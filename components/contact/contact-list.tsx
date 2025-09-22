"use client";

import { z } from "zod";
import { useState, useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { useFormSchema } from "@/hooks/use-form-schema";
import { Card, CardContent } from "@/components/ui/card";
import { SubmitButton } from "@/components/form-control/submit-button";

const ContactSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().min(10, "Nomor telepon minimal 10 digit"),
  subject: z.string().min(5, "Subjek minimal 5 karakter"),
  message: z.string().min(20, "Pesan minimal 20 karakter"),
});

type ContactForm = z.infer<typeof ContactSchema>;

export function ContactClient() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const defaultState: ContactForm = {
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

  // 🔹 Animasi on-load
  useEffect(() => setIsLoaded(true), []);

  // 🔹 Gerakan mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) =>
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  async function handleSubmit(data: ContactForm) {
    // Simulate API
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Contact form submitted:", data);
    setIsSubmitted(true);
    form.methods.reset();
    setTimeout(() => setIsSubmitted(false), 5000);
  }

  return (
    <main className="relative min-h-screen flex flex-col bg-background overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center overflow-hidden min-h-screen">
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-[3000ms] ease-out
              ${isLoaded ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=2340&q=80')`,
            transform: `translate(${mousePosition.x * 0.01}px, ${
              mousePosition.y * 0.01
            }px)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/70 via-purple-900/60 to-pink-900/70"></div>
        </div>

        <div
          className={`relative z-10 text-center px-4 md:px-8 max-w-7xl py-16 mx-auto transform transition-all duration-1000 ease-out ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
          }`}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6">
            Mari{" "}
            <span className="block bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent animate-gradient-x">
              Berkontak
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
            Kami siap membantu mewujudkan pengalaman perjalanan impian Anda.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="relative py-20">
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="shadow-2xl border-0 rounded-3xl bg-white/95 dark:bg-slate-900/95">
              <CardContent className="p-8 md:p-12">
                <h2 className="text-3xl font-bold mb-6">📝 Kirim Pesan</h2>

                {isSubmitted && (
                  <div className="mb-6 p-4 bg-green-100 rounded-xl text-green-700">
                    Pesan berhasil dikirim ✅ Tim kami akan menghubungi Anda.
                  </div>
                )}

                <FormProvider {...form.methods}>
                  <form onSubmit={form.handleSubmit} className="space-y-6">
                    <input
                      {...form.methods.register("name")}
                      placeholder="Nama Lengkap"
                      className="w-full h-12 px-4 rounded-xl border"
                    />
                    <input
                      {...form.methods.register("email")}
                      placeholder="Email"
                      type="email"
                      className="w-full h-12 px-4 rounded-xl border"
                    />
                    <input
                      {...form.methods.register("phone")}
                      placeholder="No. Telepon"
                      type="tel"
                      className="w-full h-12 px-4 rounded-xl border"
                    />
                    <select
                      {...form.methods.register("subject")}
                      className="w-full h-12 px-4 rounded-xl border"
                    >
                      <option value="">Pilih Subjek</option>
                      <option value="Booking Hotel">Booking Hotel</option>
                      <option value="Paket Tour">Paket Tour</option>
                      <option value="Keluhan">Keluhan</option>
                    </select>
                    <textarea
                      {...form.methods.register("message")}
                      rows={6}
                      placeholder="Pesan..."
                      className="w-full px-4 py-3 rounded-xl border resize-none"
                    />
                    <SubmitButton
                      text={
                        form.isSubmitting ? "Mengirim Pesan..." : "Kirim Pesan"
                      }
                      isLoading={form.isSubmitting}
                      disabled={!form.isValid || form.isSubmitting}
                      className="w-full h-14 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl"
                    />
                  </form>
                </FormProvider>
              </CardContent>
            </Card>

            {/* Contact Info (static cards) */}
            <div className="space-y-6">
              <Card className="p-6">🏢 Kantor Pusat: Jl. Sudirman No. 123</Card>
              <Card className="p-6">📞 Telepon: +62 21 1234 5678</Card>
              <Card className="p-6">✉️ Email: info@pesanhotel.com</Card>
              <Card className="p-6">🕒 Jam Operasional: 08.00 - 22.00</Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
