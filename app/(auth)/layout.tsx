"use client";

import React from "react";
import { cn } from "@/lib/utils";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Stunning Travel Background */}
      <div className="absolute inset-0">
        {/* Main Background - Bali Rice Terraces */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 transition-transform duration-[20s] ease-linear animate-ken-burns"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80')`,
          }}
        />

        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-blue-900/60 to-emerald-900/70"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Ambient orbs */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Subtle floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-cyan-300/40 rounded-full animate-float delay-1000"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-emerald-300/50 rounded-full animate-bounce-slow delay-500"></div>
      </div>

      {/* Subtle grid pattern for auth context */}
      <div
        className={cn(
          "absolute inset-0 opacity-10",
          "[background-size:100px_100px]",
          "[background-image:linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]"
        )}
      />

      {/* Focus area for auth form */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 800px 600px at center, transparent 10%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.8) 100%)`,
          }}
        ></div>
      </div>

      {/* Auth form container */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        {children}
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes ken-burns {
          0% {
            transform: scale(1.1) rotate(0deg);
          }
          100% {
            transform: scale(1.2) rotate(1deg);
          }
        }

        @keyframes float {
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

        .animate-ken-burns {
          animation: ken-burns 25s ease-in-out infinite alternate;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }

        .delay-500 {
          animation-delay: 0.5s;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
