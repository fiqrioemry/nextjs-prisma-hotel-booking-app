import React from "react";

export default function Footer() {
  return (
    <footer className="py-6 border-t text-center text-sm text-muted-foreground bg-card">
      <div className="mx-auto container">
        <p>© {new Date().getFullYear()} EasyBook.com All rights reserved.</p>
      </div>
    </footer>
  );
}
