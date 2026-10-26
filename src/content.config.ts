import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Keep every field here in sync with public/admin/config.yml.

export const ACCENTS = ["cinnamoroll", "pink", "yellow", "periwinkle"] as const;
export const DIAL_COLORS = ["rosa", "celeste"] as const;
export const SECTION_IDS = ["hero", "skills", "about", "work", "services", "contact"] as const;

const link = z.object({
  label: z.string(),
  url: z.string(),
});

const profile = defineCollection({
  loader: glob({ pattern: "profile.json", base: "./src/content/settings" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      language: z.string(),
      seo: z.object({
        title: z.string(),
        description: z.string(),
      }),
      nav: z.object({
        work: z.string(),
        about: z.string(),
        services: z.string(),
        contact: z.string(),
        cta: z.string(),
        menu: z.string(),
        skipLink: z.string(),
      }),
      hero: z.object({
        eyebrow: z.string(),
        tagline: z.string(),
        status: z.string(),
        intro: z.string(),
        statement: z.string(),
        scrollLabel: z.string(),
      }),
      skills: z.array(z.string()),
      about: z.object({
        heading: z.string(),
        lead: z.string(),
        paragraphs: z.array(z.string()),
        facts: z.array(z.object({ label: z.string(), value: z.string() })),
        portrait: image().optional(),
        portraitAlt: z.string().optional(),
      }),
      work: z.object({
        heading: z.string(),
        intro: z.string(),
      }),
      services: z.object({
        heading: z.string(),
        intro: z.string(),
        items: z.array(z.object({ title: z.string(), description: z.string() })),
        stats: z.array(z.object({ value: z.string(), label: z.string() })),
      }),
      contact: z.object({
        heading: z.string(),
        email: z.string(),
        socials: z.array(link),
        cv: z.string().optional(),
        cvLabel: z.string(),
        sealMessage: z.string(),
      }),
      footer: z.object({
        note: z.string(),
        backToTop: z.string(),
      }),
      skyDial: z.object({
        label: z.string(),
        night: z.string(),
        dawn: z.string(),
        day: z.string(),
        sunset: z.string(),
      }),
    }),
});

const theme = defineCollection({
  loader: glob({ pattern: "theme.json", base: "./src/content/settings" }),
  schema: z.object({
    accent: z.enum(ACCENTS),
    dialColor: z.enum(DIAL_COLORS),
    showSkyDial: z.boolean(),
    showCat: z.boolean(),
    catName: z.string().optional(),
    sections: z.array(
      z.object({
        id: z.enum(SECTION_IDS),
        visible: z.boolean(),
      })
    ),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      category: z.string(),
      year: z.number().int(),
      summary: z.string(),
      // The CMS may save numeric-looking text like 320 unquoted in YAML.
      resultValue: z.union([z.string(), z.number()]).transform(String).optional(),
      resultLabel: z.string().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      order: z.number().int().default(0),
      draft: z.boolean().default(false),
    }),
});

export const collections = { profile, theme, projects };
