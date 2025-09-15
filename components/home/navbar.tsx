"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { UserNavItems } from "./user-nav-items";
import { NavbarMenu } from "./navbar-menu";
import React, { useState, useEffect } from "react";
import { AppLogo } from "@/components/shared/app-logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function Navbar() {
  const { data } = authClient.useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 10);

      // Hide/show navbar based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & already scrolled enough
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50  py-4
        transition-all duration-300 ease-in-out
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
        ${
          isScrolled
            ? "backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 shadow-lg border-b border-gray-200/20 dark:border-slate-700/20"
            : "backdrop-blur-md bg-gradient-to-br from-white/95 via-blue-50/90 to-cyan-50/95 dark:from-slate-900/95 dark:via-slate-800/90 dark:to-slate-900/95 border-b"
        }
      `}
    >
      <div
        className={`
          flex items-center justify-between gap-4 mx-auto container max-w-7xl px-4
          transition-all duration-300 ease-in-out
        `}
      >
        {/* Logo with animation */}
        <div className="transform transition-transform duration-300 hover:scale-105">
          <AppLogo />
        </div>

        {/* Navigation items with stagger animation */}
        <div
          className={`
            transform transition-all duration-300 ease-in-out
            ${isScrolled ? "scale-90 opacity-90" : "scale-100 opacity-100"}
          `}
        >
          <UserNavItems />
        </div>

        {/* Action buttons with animation */}

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {data?.user ? (
            <div>
              <NavbarMenu user={data?.user} />
            </div>
          ) : (
            <Button variant="outline" asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Loading bar animation saat scroll */}
      <div
        className={`
          absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500
          transition-all duration-300 ease-out
          ${isScrolled ? "w-full opacity-100" : "w-0 opacity-0"}
        `}
      />
    </header>
  );
}
