"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SiteContent } from "@/content/schema";

const SiteContentContext = createContext<SiteContent | null>(null);

export function SiteContentProvider({ content, children }: { content: SiteContent; children: ReactNode }) {
  return <SiteContentContext value={content}>{children}</SiteContentContext>;
}

export function useSiteContent(): SiteContent {
  const content = useContext(SiteContentContext);
  if (!content) throw new Error("SiteContentProvider is missing.");
  return content;
}
