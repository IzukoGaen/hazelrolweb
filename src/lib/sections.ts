import type { CollectionEntry } from "astro:content";

export type SectionId = CollectionEntry<"theme">["data"]["sections"][number]["id"];

export interface SectionProps {
  profile: CollectionEntry<"profile">["data"];
  projects: CollectionEntry<"projects">[];
  visible: Set<string>;
}

export function visibleSections(theme: CollectionEntry<"theme">["data"]): SectionId[] {
  const seen = new Set<SectionId>();
  return theme.sections
    .filter((section) => section.visible)
    .map((section) => section.id)
    .filter((id) => !seen.has(id) && Boolean(seen.add(id)));
}
