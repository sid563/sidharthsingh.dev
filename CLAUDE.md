# sidharthsingh.dev

Personal portfolio for Sidharth Singh (backend engineer: Rust, TypeScript, Python, Kafka, PostgreSQL, MongoDB). Built 27 Oct 2026 as a pilot; being refined.

## Stack and conventions
- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, pnpm. Cache Components is off (`next.config.ts`); every page is prerendered from files.
- shadcn/ui **v4, Base UI variant** (`components.json` style `base-nova`): no `asChild`. For link-styled buttons use `<Link className={buttonVariants({...})}>`, never `Button render={<Link/>}`.
- lucide-react 1.x has **no brand icons** (no GithubIcon/LinkedinIcon); use ArrowUpRightIcon / ExternalLinkIcon.
- Theme: next-themes, class strategy, tokens in `src/app/globals.css`. Use semantic colours only (`bg-background`, `text-muted-foreground`, `text-brand`, `bg-brand-soft`, `text-success`...), never raw `gray-500`.
- One page column: `Container` in `src/components/container.tsx` (max-w-5xl). Header, footer and all pages share it. Long-form text limits itself with `max-w-3xl` inside the column.
- Motion is CSS only: `FadeIn` / `FadeInStagger` / `FadeInItem` (`src/components/fade-in.tsx`) use scroll-driven animations; content is visible without JS. Hero uses `mode="load"`.
- `src/lib/content.ts` is `server-only`. Client components import status constants from `src/lib/status.ts`.

## Content model (file-based, no database)
- `content/projects|writing|roadmap|progress/*.mdx` + `content/now.mdx`, validated by Zod in `src/lib/content.ts`. A bad field fails the build with the file name.
- `src/data/site.ts` (name, links, nav, hero copy, stats), `src/data/resume.ts`, `src/data/skills.ts`, `src/data/links.ts` (external documents on Google Drive: fill `url`, the path redirects via `next.config.ts`).
- Drafts (`draft: true`) show in dev, hidden in production.
- Keep every number on the site verifiable. Phone number never goes on the site.

## Verify before claiming done
```bash
pnpm build && pnpm lint && pnpm exec tsc --noEmit
pnpm start -p 3111 &  # then:
pnpm check:visual      # overflow + reveal + console per route, screenshots in .checks/
pnpm check:interact    # theme, palette, filters, print, crawl, mobile menu
```
Both scripts use the installed Google Chrome via playwright-core (`channel: "chrome"`).

## Deployment
Vercel Hobby. Domain sidharthsingh.dev on Cloudflare Registrar (DNS records for Vercel must be DNS-only). Env: `NEXT_PUBLIC_SITE_URL=https://sidharthsingh.dev`.

## Pending
- Drive links for resume, certificates and degree in `src/data/links.ts`.
- Chatbot behind the floating button (`src/components/chat-widget.tsx`), planned for Nov 2026.
- Real stats for RapidShyp and the Tokio scheduler, once provided.
- Per-page OG images, GitHub activity on /progress, resume PDF export.
