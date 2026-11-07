import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content-store";
import { Portfolio } from "@/components/portfolio";
import { PageHeading } from "@/components/ui";
import { Reveal } from "@/components/visual-effects";

export async function generateMetadata(): Promise<Metadata> {
  const { gallery } = await getSiteContent();
  return { title: "Portfolio", description: gallery.description };
}

export default async function GalleryPage() {
  const { gallery } = await getSiteContent();
  return <main id="contenido" className="inner-page gallery-page section-wrap"><Reveal lift><PageHeading label="Portfolio" title={gallery.title} /></Reveal><div className="gallery-intro"><p>Retrato / Boudoir / Parejas</p><p className="content-lines">{gallery.description}</p></div><Portfolio /></main>;
}
