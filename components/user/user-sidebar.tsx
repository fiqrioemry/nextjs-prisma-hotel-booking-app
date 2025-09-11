import React from "react";
import { Card, CardContent } from "../ui/card";

export const UserSidebar = () => {
  const navItems = [
    { name: "Payments", href: "/payments" },
    { name: "Bookings", href: "/bookings" },
    { name: "Profile", href: "/profile" },
  ];
  return (
    <Card className="w-64 p-0">
      <CardContent className="p-4">
        <h1 className="text-2xl font-bold mb-4">User Menu</h1>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <a href={item.href} className="text-blue-600 hover:underline">
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
