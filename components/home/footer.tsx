import React from "react";

export default function Footer() {
  return (
    <footer className="py-6 border-t text-center text-sm text-muted-foreground backdrop-blur-md bg-gradient-to-br from-white/95 via-blue-50/90 to-cyan-50/95 dark:from-slate-900/95 dark:via-slate-800/90 dark:to-slate-900/95">
      <div className="mx-auto container">
        <p>© {new Date().getFullYear()} pesanhotel.com All rights reserved.</p>
      </div>
    </footer>
  );
}
