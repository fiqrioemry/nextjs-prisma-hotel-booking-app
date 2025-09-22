import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { AppProvider } from "@/context/app-provider";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { EdgeStoreProvider } from "@/context/edge-store-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PesanHotel- Cara mudah pesan hotel impian Anda",
  description: "Pesan hotel impian Anda dengan mudah dan cepat.",
  icons: {
    icon: "/pesan.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Analytics />
        <SpeedInsights />
        <AppProvider>
          <EdgeStoreProvider>{children}</EdgeStoreProvider>
        </AppProvider>
      </body>
    </html>
  );
}
