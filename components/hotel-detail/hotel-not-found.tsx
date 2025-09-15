"use client";

import React from "react";

export const HotelNotFound = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with parallax effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/70 to-emerald-900/80"></div>
      </div>
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nemo veritatis
      earum magnam, optio delectus iusto dolorum qui, perspiciatis rem iure
      aperiam perferendis doloribus corporis dolore assumenda nesciunt aut, quos
      voluptatibus omnis ab deleniti magni consequuntur numquam! Reiciendis
      suscipit modi eos illum alias perspiciatis neque, ratione debitis
      laboriosam assumenda corrupti quam!
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Icon */}
        <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-xl">
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Hotel Tidak
          <span className="block bg-gradient-to-r from-blue-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
            Ditemukan
          </span>
        </h1>

        {/* Description */}
        <p className="text-xl md:text-2xl text-white/80 mb-8 leading-relaxed">
          Maaf, hotel yang Anda cari tidak dapat ditemukan atau mungkin sudah
          tidak tersedia
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => window.history.back()}
            className="group px-8 py-4 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-semibold rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
          >
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Kembali
            </span>
          </button>

          <button
            onClick={() => (window.location.href = "/hotels")}
            className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
          >
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Cari Hotel Lain
            </span>
          </button>
        </div>

        {/* Additional help text */}
        <div className="mt-12 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-3">
            Butuh Bantuan?
          </h3>
          <p className="text-white/70 text-sm leading-relaxed mb-4">
            Jika Anda yakin hotel ini seharusnya tersedia, silakan hubungi tim
            customer service kami
          </p>
          <button className="text-emerald-300 hover:text-emerald-200 font-medium text-sm transition-colors duration-300 underline underline-offset-2">
            Hubungi Customer Service
          </button>
        </div>
      </div>
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-emerald-300/40 rounded-full animate-ping delay-700"></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-blue-300/30 rounded-full animate-ping delay-1000"></div>
      </div>
    </section>
  );
};
