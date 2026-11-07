"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { CustomCursor, ProgressiveBlur } from "./visual-effects";

export function PublicShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return children;
  return <><a href="#contenido" className="skip-link">Saltar al contenido</a><SiteHeader />{children}<SiteFooter /><ProgressiveBlur /><CustomCursor /></>;
}
