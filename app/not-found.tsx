"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-background">
      <div className="relative flex flex-col items-center w-full px-6 max-w-3xl mx-auto">
        {/* Simple background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-secondary/5 rounded-3xl -z-10"></div>

        <div className="relative z-10 flex flex-col gap-10 items-center justify-center text-center">
          {/* Error badge */}
          <span className="inline-flex h-12 w-fit items-center justify-center gap-2 rounded-full bg-card px-4">
            <span className="text-lg font-medium text-muted-foreground">
              404 Error
            </span>
          </span>

          {/* Main content */}
          <div className="flex flex-col items-center justify-center gap-5">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tighter text-balance text-primary">
              Page not found
            </h1>
            <p className="text-base md:text-lg text-muted-foreground font-medium text-balance leading-relaxed tracking-tight max-w-xl">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Call to action */}
          <div className="flex items-center justify-center">
            <Button asChild className="h-12 rounded-full w-40">
              <Link href="/">
                <ArrowLeft className="size-4 md:size-5" />
                <span className="font-medium">Return Home  s</span>
              </Link>
            </Button>
          </div>

          {/* Simple decorative element */}
          <div className="absolute -bottom-8 inset-x-0 h-4 bg-secondary/10 blur-lg rounded-full -z-10 opacity-50"></div>
        </div>
      </div>
    </section>
  );
}
