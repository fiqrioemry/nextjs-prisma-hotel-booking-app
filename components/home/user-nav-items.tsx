"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export function UserNavItems() {
  const pathname = usePathname();

  const navItems = [
    { title: "Home", url: "/", isActive: pathname === "/" },
    { title: "About", url: "/about", isActive: pathname === "/about" },
    { title: "Contact", url: "/contact", isActive: pathname === "/contact" },
  ];

  return (
    <div className="hidden md:flex md:gap-6 flex items-center">
      {navItems.map((item) => (
        <Link
          key={item.url}
          className={item.isActive ? "text-blue-500" : ""}
          href={item.url}
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
}
