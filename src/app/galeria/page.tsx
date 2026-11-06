import type { Metadata } from "next";
import { Portfolio } from "@/components/portfolio";
import { PageHeading } from "@/components/ui";
import { Reveal } from "@/components/visual-effects";

export const metadata: Metadata = { title: "Portfolio", description: "Retrato, boudoir y parejas. Explora el universo visual de AMV Studio, fotógrafo en Barcelona." };

export default function GalleryPage() {
  return <main id="contenido" className="inner-page gallery-page section-wrap"><Reveal lift><PageHeading label="Portfolio" title="Una mirada. Infinitas formas de ser." /></Reveal><div className="gallery-intro"><p>Retrato / Boudoir / Parejas</p><p>Selección de imágenes de referencia.<br />Cada serie, una forma de mirar.</p></div><Portfolio /></main>;
}
