"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const GRADIENT_PAGES = [
  "/upload-results",
  "/universities",
  "/courses",
  "/careers",
];

const NO_BG_PAGES = ["/", "/auth/signin", "/auth/register"];

export default function PageBackground({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (NO_BG_PAGES.includes(pathname)) {
    return <>{children}</>;
  }

  if (GRADIENT_PAGES.some((p) => pathname.startsWith(p))) {
    return (
      <>
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50" />
        {children}
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/image1.png"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/80" />
      </div>
      {children}
    </>
  );
}
