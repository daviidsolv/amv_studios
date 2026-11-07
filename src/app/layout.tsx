import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { getSiteContent } from "@/lib/content-store";
import { SiteContentProvider } from "@/components/site-content";
import { PublicShell } from "@/components/public-shell";
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

export async function generateMetadata(): Promise<Metadata> {
  const { brand } = await getSiteContent();
  const title = `${brand.name} — Fotografía en ${brand.location.replace(/,.*$/, "")}`;
  return {
    title: { default: title, template: `%s — ${brand.name}` },
    description: brand.description,
    applicationName: brand.name,
    openGraph: { title, description: brand.description, locale: "es_ES", type: "website" },
  };
}

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#000000", viewportFit: "cover" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await getSiteContent();
  return <html lang="es" className={dmSans.variable}><body><SiteContentProvider content={content}><PublicShell>{children}</PublicShell></SiteContentProvider></body></html>;
}
