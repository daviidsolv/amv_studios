import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { brand } from "@/content/site";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CustomCursor, ProgressiveBlur } from "@/components/visual-effects";
import "./globals.css";

const dmSans = localFont({
  src: [
    { path: "./fonts/dm-sans-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/dm-sans-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/dm-sans-900.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "AMV Studio — Fotografía en Barcelona", template: "%s — AMV Studio" },
  description: brand.description,
  applicationName: "AMV Studio",
  openGraph: { title: "AMV Studio — Fotografía en Barcelona", description: brand.description, locale: "es_ES", type: "website" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#000000", viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es" className={dmSans.variable}><body><a href="#contenido" className="skip-link">Saltar al contenido</a><SiteHeader />{children}<SiteFooter /><ProgressiveBlur /><CustomCursor /></body></html>;
}
