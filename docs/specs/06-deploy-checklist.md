# 06 Deploy checklist (human tasks, not for Cursor)

Order matters: each step needs a URL or key from the previous one.

1. Push `main` to a GitHub repo.
2. Cloudflare dashboard -> Workers & Pages -> create Pages project -> Connect
   to Git. Astro preset (build `npm run build`, output `dist`), production
   branch `main`. If the build fails only on Cloudflare, add env var
   NODE_VERSION = output of `node -v`.
3. Deploy the `sveltia-cms-auth` Worker. Note its workers.dev URL.
4. GitHub -> Settings -> Developer settings -> OAuth Apps -> New.
   Homepage: the pages.dev URL. Callback: Worker URL + `/callback`.
5. Worker settings: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET (encrypted),
   ALLOWED_DOMAINS = pages.dev domain. Verify names against the Worker README.
   Never put the secret in the repo or in a Cursor chat.
6. Replace `base_url` in `public/admin/config.yml` with the Worker URL, push.
7. Repo -> Settings -> Collaborators -> invite Hazel (write access).
8. Test from HER account: edit text, upload an image, change accent color,
   hide a section, toggle the cat. Confirm each appears live after rebuild.

Day to day: work on branches, check the preview URL, merge to publish.
`git pull` before starting, so you have her latest CMS edits.
