# sidharthsingh.dev

Personal portfolio for Sidharth Singh (backend engineer: Rust, TypeScript, Python, Kafka, PostgreSQL, MongoDB). Built 27 Oct 2026 as a pilot; being refined.

## Stack and conventions
- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, pnpm. Cache Components is off (`next.config.ts`); every page is prerendered from files.
- shadcn/ui **v4, Base UI variant** (`components.json` style `base-nova`): no `asChild`. For link-styled buttons use `<Link className={buttonVariants({...})}>`, never `Button render={<Link/>}`.
- lucide-react 1.x has **no brand icons** (no GithubIcon/LinkedinIcon); use ArrowUpRightIcon / ExternalLinkIcon.
- Theme: next-themes, class strategy, tokens in `src/app/globals.css`. Use semantic colours only (`bg-background`, `text-muted-foreground`, `text-brand`, `bg-brand-soft`, `text-success`...), never raw `gray-500`.
- One page column: `Container` in `src/components/container.tsx` (max-w-5xl). Header, footer and all pages share it. Long-form text limits itself with `max-w-3xl` inside the column.
- Motion is CSS only: `FadeIn` / `FadeInStagger` / `FadeInItem` (`src/components/fade-in.tsx`) use scroll-driven animations; content is visible without JS. Hero uses `mode="load"`.
- `src/lib/content.ts` is `server-only`. Client components import status constants from `src/lib/status.ts` and post types from `src/lib/writing.ts`.
- **System sketches** (`src/lib/diagram.ts`, `src/components/sketch/system-sketch.tsx`): a declarative `nodes`/`edges` spec laid out left to right and rendered as inline SVG with SMIL packets. Node kinds: client, service, worker, queue, db, cache, external, model, file. Edges with `dashed: true` never affect layering and loop underneath when they point backwards. Sizes: `card` (thumbnail, no notes), `full` (article/project page, min 78% / max 110% of natural size, scrolls sideways when narrow), `hero` (home band). Packets hide under reduced motion.
- **Spotlight cards**: wrap a grid in `<SpotlightGroup>` and give each card `data-spotlight` + `spotlight-card relative`. Pointer-only, CSS-driven; siblings dim while one card is hovered.
- **Theme toggle** uses the View Transitions API via `useThemeTransition()` (circular reveal from the button); the command palette shares it. **Route transitions** come from React 19.3 `<ViewTransition>` in `src/app/template.tsx` (classes `page-enter`/`page-exit` in globals.css). The header carries `view-transition-name: site-header` so it never animates.
- **Keyboard shortcuts** (`src/lib/shortcuts.ts`, `src/components/keyboard-shortcuts.tsx`): `g` + letter to navigate, `t` theme, `/` search, `?` opens the list. The palette shows the hints. Never fire while typing.
- Footer shows Delhi local time (client) and a Source link to the public repo. No commit hash on the site, by the owner's choice.
- `site.principles` (home "Working principles") are lines quoted from the project write-ups; edit them in `src/data/site.ts`.

## Content model (file-based, no database)
- `content/projects|writing|roadmap|progress/*.mdx` + `content/now.mdx`, validated by Zod in `src/lib/content.ts`. A bad field fails the build with the file name.
- `src/data/site.ts` (name, links, nav, hero copy, stats), `src/data/resume.ts`, `src/data/skills.ts`, `src/data/links.ts` (external documents on Google Drive: fill `url`, the path redirects via `next.config.ts`).
- Drafts (`draft: true`) show in dev, hidden in production. Four sample posts (Kafka rebalance + delivery semantics as a two-part series, a TOAST note, an essay) are drafts that exist only to exercise the article template: delete or rewrite them before publishing.
- Posts: `type: article | note | essay` (notes get no table of contents), optional `updated`, optional `series: { name, part }` (parts link to each other). Tag badges link to `/writing?tag=…`.
- Projects: optional `diagram:` frontmatter (see System sketches) draws the card thumbnail and the sketch at the top of the page.
- MDX building blocks (`src/components/mdx-components.tsx`): `<Callout type="note|tip|warning">`, `<Figure src alt caption width height size="wide"?>`, `<Diagram title nodes={[…]} edges={[…]} caption>`. Code fences are highlighted at build time by shiki (light: github-light, dark: vesper) with a copy button; use ```lang title="file.rs" {3-5} for a title and highlighted lines. GFM footnotes (`[^1]`) are styled. JSX expression props are allowed in MDX (`blockJS: false`) because all content is authored in this repo.
- Article template (`src/app/writing/[slug]/page.tsx`): reading-progress hairline (CSS scroll timeline), sticky "On this page" rail at lg when a post has 3+ headings (inline `<details>` below lg), series navigation, related posts by shared tags, "Edit this page on GitHub", prev/next.
- Keep every number on the site verifiable. Phone number never goes on the site.

## Verify before claiming done
```bash
pnpm build && pnpm lint && pnpm exec tsc --noEmit
pnpm start -p 3111 &  # then:
pnpm check:visual      # overflow + reveal + console per route, screenshots in .checks/
pnpm check:interact    # theme, palette, filters, print, crawl, shortcuts, sketches, copy button, 404, footer, mobile menu
```
Both suites only see production content (drafts are hidden), so preview draft posts with `pnpm dev` and check them by eye. Full-page screenshots must scroll first: reveals are scroll-driven and a non-scrolled capture shows blank sections.
Both scripts use the installed Google Chrome via playwright-core (`channel: "chrome"`).

## Deployment
Vercel Hobby. Domain sidharthsingh.dev on Cloudflare Registrar (DNS records for Vercel must be DNS-only). Env: `NEXT_PUBLIC_SITE_URL=https://sidharthsingh.dev`.
Live at https://sidharthsingh.dev since 27 Oct 2026. Vercel project `sidharthsingh-dev` (GitHub sid563/sidharthsingh.dev (public), auto-deploys main). www 308s to the apex; Cloudflare holds a DNS-only A record on `@` and a DNS-only CNAME on `www`. Full suite (`BASE=https://sidharthsingh.dev pnpm check:visual && pnpm check:interact`) passed on launch day.

## Pending
- Drive links for resume, certificates and degree in `src/data/links.ts`.
- Chatbot behind the floating button (`src/components/chat-widget.tsx`), planned for Nov 2026.
- Real stats for RapidShyp and the Tokio scheduler, once provided.
- Per-page OG images, GitHub activity on /progress, resume PDF export.
- Commit and push the `scripts/interact.mjs` change (project filter counts now derived from `content/projects`).
- Canonical URL: set `alternates.canonical` in the root metadata so `sidharthsingh-dev.vercel.app` doesn't compete with the domain.
- Google Search Console: add sidharthsingh.dev as a Domain property (TXT record at Cloudflare), submit `/sitemap.xml`.
- GitHub repo Website field: https://sidharthsingh.dev.
