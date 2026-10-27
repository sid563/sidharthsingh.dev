# sidharthsingh.dev (pilot)

Personal site for Sidharth Singh: work, writing, roadmap, learning progress, resume.

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS 4 + shadcn/ui (Base UI variant), Motion for entrance animation
- Content as MDX files under `content/`, validated with Zod at build time
- Dark / light / system theme via next-themes

## Run

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build, fails on invalid frontmatter
pnpm lint
```

## Where things live

| Path | What |
|---|---|
| `src/data/site.ts` | Name, links, nav, bio paragraphs |
| `src/data/resume.ts` | Structured resume (renders /resume and the print view) |
| `src/data/skills.ts` | Expertise matrix for /about |
| `content/projects/*.mdx` | Case studies → /projects/[slug] |
| `content/writing/*.mdx` | Posts → /writing/[slug] (`draft: true` hides in production) |
| `content/roadmap/*.mdx` | Future projects and visions → /roadmap |
| `content/progress/*.mdx` | Learning journeys with percent, milestones, log → /progress/[slug] |
| `content/now.mdx` | The /now page |
| `src/lib/content.ts` | Zod schemas and loaders for every collection |
| `docs/RESEARCH.md` | Template and stack research that led here |

## Adding content

Copy an existing file in the collection, change the frontmatter, write the body. Dates are `YYYY-MM-DD`. Status is one of `idea`, `planned`, `in-progress`, `paused`, `shipped`. A bad field fails `pnpm build` with the file name and the reason.

## Deploy

Vercel Hobby. Set `NEXT_PUBLIC_SITE_URL` to the real domain once bought.
