# 01 Audit and migration

We already have a working template. Adapt it to the architecture rules; do not
rebuild it, do not delete components, keep the current visual design unless told.

## PROCESS
1. AUDIT ONLY, no file changes. Report:
   1. Framework and version, styling approach, dependencies.
   2. Folder structure (top 2 levels).
   3. Every hardcoded piece of content (text, images, links, lists) with file and line.
   4. Every hardcoded design value (colors, fonts, radii, shadows).
   5. Existing sections vs. required: hero, projects/case studies,
      about + experience, skills, contact.
   6. Where images currently live.
   7. Every conflict with the architecture rules (e.g. not Astro). For each,
      recommend adapting the template or editing the rules, and why.
2. Propose a migration plan in small phases with the files each touches. STOP.
3. Content extraction: move all hardcoded content into `src/content/`
   (projects as Markdown, profile.json for the rest). Page must render the
   same as before. Add every field to the content schema. List fields created.
4. Tokens: after the design system (spec 02) is approved, move every design
   value into `src/styles/tokens.css`. Create token sets for theme.json options
   (accent: pink | yellow | periwinkle; fontPair: editorial | playful) and wire
   the switching. Default options must look the same as the approved design.
5. CMS: add Sveltia CMS at /admin. Generate `public/admin/config.yml` from all
   schema fields plus theme.json knobs (select/list widgets). Leave base_url as
   a placeholder. List any field missing from either side.
