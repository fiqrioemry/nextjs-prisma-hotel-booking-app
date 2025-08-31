import React from "react";

export default function Footer() {
  return (
    <footer className="py-6 bg-muted">
      <div className="container mx-auto">
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Finance Management. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
