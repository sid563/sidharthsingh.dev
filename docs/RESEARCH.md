# Portfolio Website Research

Date: 27 Oct 2026. Status: research done, nothing finalised.

## Requirements captured so far

- Multi-page site about Sidharth: expertise, resume, projects, future projects, future visions, progress tracking, "attach progress and everything possible".
- Dark and light mode.
- Exceptional, world-class UI/UX.
- Backend engineer profile (Python, Postgres, MongoDB, SQLAlchemy). Design must make backend work look good, not borrow a frontend-designer template.

## TL;DR

1. No existing template covers all of this. The free ones are single-page or blog-first, the paid ones are polished but restrained, and none has roadmap or progress-tracking pages.
2. The sites people call "world-class" (rauno.me, emilkowal.ski, paco.me, brittanychiang.com) are all custom builds. They are typography-first, fast, restrained, with one or two signature interactions.
3. Recommended path: a custom build on Next.js 16 + Tailwind 4 + shadcn/ui + Motion, using Magic Portfolio and Tailwind Spotlight as structural references, content as typed MDX collections, hosted free on Vercel.
4. Fast fallback: fork Magic Portfolio (Once UI), restyle, and add the custom pages. Launchable in a weekend, but it will look like other Once UI sites until restyled.

## 1. Template shortlist (verified on GitHub via API, 27 Oct 2026)

| Template | Stack | Stars | Last push | License | Pages | Dark/Light | Verdict |
|---|---|---|---|---|---|---|---|
| [Magic Portfolio](https://github.com/once-ui-system/magic-portfolio) (Once UI) | Next.js + Once UI design system | 1.4k | 2026-10-24 | CC BY-NC 4.0 (fine for a personal site, attribution needed, no commercial use) | Home, About/CV with timeline, Work (MDX), Blog (MDX), Gallery. Pages toggle on/off | Theme config supports dark/light/system (confirm toggle in the demo) | Best free multi-page base. OG image gen, RSS, schema metadata, password-protected URLs. Design is deliberately calm, few animations |
| [Spotlight](https://tailwindcss.com/plus/templates/spotlight) (Tailwind Plus) | Next.js 16, React 19, Tailwind 4.3 | paid | maintained by Tailwind Labs | $99 one-time, unlimited personal + commercial projects | About, Articles, Projects, Speaking, Uses | Yes, header toggle (third-party confirmed) | Best taste per dollar. Restrained, no flashy motion. Good structural reference |
| [Aceternity Sidefolio / DevPro](https://ui.aceternity.com/website-templates) | Next.js, Tailwind, Framer Motion | paid | active | $199 lifetime (all 15+ templates + 200+ blocks) or $169/yr | Sidefolio: blogs, projects, resume, sidebar layout. DevPro: blogs, projects, events | Yes on most templates (verify per template) | Flashiest option. 100+ components are free without buying |
| [Magic UI Portfolio](https://github.com/magicuidesign/portfolio) | Next.js 14, shadcn, Magic UI | 1.5k | 2026-01-13 | MIT | Single page driven by one `resume.tsx` | Yes | Single page only. Good source of components and the "one data file" idea |
| [tailwind-nextjs-starter-blog](https://github.com/timlrx/tailwind-nextjs-starter-blog) | Next.js App Router, Contentlayer, Tailwind 3 | 10.6k | 2026-02-08 | MIT | Blog, tags, projects, about | Yes | Blog-first, still on Tailwind 3. Search (kbar), comments, newsletter built in |
| [leerob/next-mdx-blog](https://github.com/leerob/next-mdx-blog) | Next.js + MDX | 7.6k | 2026-09-16 | No license file | Minimal blog | Not documented | Reference only, licensing unclear |
| [devportfolio](https://github.com/RyanFitzgerald/devportfolio) | Astro, Tailwind 4 | 5.0k | 2026-05-14 | MIT | Single page, all content in `config.ts` | Not documented | Single page. Ships CLAUDE.md |
| [AstroWind](https://github.com/arthelokyo/astrowind) | Astro 7, Tailwind 4 | 6.1k | 2026-09-12 | MIT | 30+ widgets, blog, six landing pages | Yes, system/light/dark | Marketing-site flavoured. Heavy to bend into a portfolio |
| [astro-sphere](https://github.com/markhorn-dev/astro-sphere) | Astro, Tailwind, SolidJS | 694 | unknown | MIT | Blog, projects, work, search | Yes, plus subtle animations | Best Astro multi-page base. Lighthouse 100 |
| [astro-starter-portfolio](https://github.com/BracoZS/astro-starter-portfolio) | Astro 7, Tailwind 4 | small | unknown | MIT | Work collection, view transitions | Yes, class-based, no flash | Lean Astro base with typed content collections |
| [astro-bento-portfolio](https://github.com/Ladvace/astro-bento-portfolio) | Astro | 392 | 2026-10-25 | MIT | Bento single page + blog | Not documented | Source of bento-grid ideas |
| [Astrofy](https://github.com/manuelernestog/astrofy) | Astro, DaisyUI | 1.4k | 2024-07-04 | MIT | Blog, CV, projects, store | Yes | Stale since mid 2024 |
| [Brittany Chiang v4](https://github.com/bchiang7/v4) | Gatsby | 8.3k | 2024-07-28 | MIT | Single page | Dark only | The most-imitated portfolio online. Avoid cloning |
| [developerFolio](https://github.com/saadpasta/developerFolio) | React | 6.6k | 2024-12-16 | GPL-3.0 | Single page | Yes | Stale, GPL |
| [simplefolio](https://github.com/cobiwave/simplefolio) | HTML/SCSS | 14.2k | 2026-01-21 | MIT | Single page | Not documented | Too simple for this brief |
| [gitprofile](https://github.com/arifszn/gitprofile) | React | 2.3k | active | MIT | Auto-generated from a GitHub username | Yes | Not a base, but a good idea: pull live data from GitHub |
| [Quartz](https://github.com/jackyzha0/quartz) | Markdown SSG | 13.5k | 2026-10-25 | MIT | Digital garden from Obsidian notes | Yes | Option for a notes subdomain later (notes.yourdomain) |

Other names that came up but did not make the cut: Chetan Verma react-portfolio-template (no license file), developer-portfolio by 1hanzla100 (archived), Yuji Sato React Router template, Tailfolio, Start Bootstrap Freelancer/Resume, Framer templates Portilo, Nocturne, Portfollio, Portray (paid, no-code, lock-in).

## 2. What world-class developer sites actually do

- **rauno.me** (Rauno Freiberg, Vercel): pages Craft, Projects, Field Notes. A manifesto list: "Make it fast. Make it timeless." Interaction quality over decoration.
- **emilkowal.ski** (Emil Kowalski, ex-Linear/Vercel): Home, Projects (Sonner, Vaul, animations.dev), Writing. His essay "You Don't Need Animations" is the right mindset: animation as feedback, not fireworks.
- **brittanychiang.com**: single page, dark, the archetype everyone copies. Proof that restraint wins.
- **Awwwards SOTD portfolios** (Mr. Pandas Paper, Artem Shcherban, Cathy Dolle in 2026): GSAP + WebGL showpieces. Impressive, but recruiters and engineers skim. One signature moment is enough.
- **Backend-specific guidance** from the roundups: lead with constraints and your contribution (schema migrations, retries, latency and error-rate numbers), include architecture diagrams, keep a resume one click away.

Design principles to adopt: typography-first, generous whitespace, system-aware dark/light with no flash, 60fps micro-interactions, page transitions, command palette, every page loads under 1s.

## 3. Stack options

| Option | Versions today | Pros | Cons |
|---|---|---|---|
| **Next.js** (recommended) | Next 16.4, React 19.3, Tailwind 4.3, Motion 14.7 | Richest UI ecosystem: shadcn/ui, Once UI, Magic UI, Aceternity, React Bits, Motion Primitives are all React. Vercel hosting is first-class. API routes for GitHub stats and view counts | Heavier runtime than a static site needs. Irrelevant at portfolio scale |
| **Astro** | Astro 7.4, Tailwind 4.3 | Fastest output, typed content collections, view transitions built in. Best when content is the product | Animation-heavy React components run as islands with more friction. Smaller template pool for "world-class" looks |
| **Framer / Webflow** | SaaS | Fastest visual results, premium templates | Lock-in, monthly fee, no code ownership. Wrong fit for an engineer who wants to own the build |

Animation layer, all free: Motion 14 (React, declarative), GSAP 3.15 (now 100% free including ScrollTrigger and SplitText, thanks to Webflow) plus Lenis 1.3 for one or two scroll scenes. Component sources: Magic UI (MIT, 150+), Aceternity free tier (100+), React Bits (MIT + Commons Clause, check before reuse), Motion Primitives.

Local tooling present: Node 24.22, pnpm 10.32. Bun not installed.

## 4. Feature building blocks

- **Dark/light**: `next-themes` with system preference, class strategy, inline script to avoid flash. Tokens defined once in CSS, every component reads tokens.
- **Content**: MDX via a typed collection layer (Velite, content-collections, or fumadocs-mdx). Collections: `projects`, `posts`, `roadmap`, `progress`, `resume`. Zod schemas, so bad frontmatter fails the build. A backend engineer will like this.
- **Projects**: case-study pages with status badge (shipped / in progress / planned), stack chips, metrics block, architecture diagram, links to repo and live.
- **Roadmap / future vision**: `roadmap` items with status (idea, planned, in progress, paused, shipped), theme, timeframe not exact dates, "Updated on" stamp. Shipped items link to their project page.
- **Progress tracking**: `progress` journeys (example: Postgres 8-week course) with percent complete, milestones, dated log entries. Rendered as a progress meter plus timeline. Add a GitHub contribution heatmap via react-activity-calendar / react-github-calendar.
- **Resume**: single data source renders the web page and a PDF (react-pdf or print stylesheet), so they never drift.
- **Search**: cmdk command palette (Cmd+K) across pages, projects, posts.
- **SEO and sharing**: next/og for per-page OG images, sitemap, RSS, JSON-LD person schema.
- **Now page**: /now in the Derek Sivers tradition, archived monthly so progress is visible over time.

## 5. Hosting

| Host | Fit | Notes |
|---|---|---|
| **Vercel Hobby** | Next.js | Free for personal use, custom domain, SSL, OG image routes. Recommended |
| **Cloudflare Workers (static assets)** | Astro | Cloudflare steers new projects here rather than Pages. Next.js works via OpenNext with more setup |
| **GitHub Pages** | Static only | Fine for plain HTML, awkward for Next.js features |

Domain: buy a .dev or .com from Cloudflare Registrar or Porkbun, about $10-15 per year.

## 6. Proposed site map (draft, to finalise)

| Route | Purpose |
|---|---|
| `/` | Hero with one signature interaction, bento of live highlights (now, latest project, learning progress), featured work |
| `/about` | Story, expertise matrix (backend depth: Python, Postgres, MongoDB, SQLAlchemy, async, data modelling), career timeline |
| `/resume` | Web resume plus PDF download from the same data |
| `/projects`, `/projects/[slug]` | Case studies with status, metrics, diagrams |
| `/roadmap` | Future projects and visions with statuses and "Updated on" |
| `/progress` | Learning journeys with percent complete, milestones, dated log, GitHub heatmap |
| `/writing`, `/writing/[slug]` | Blog, notes, TILs |
| `/now` | What I'm doing now, archived monthly |
| `/uses`, `/contact` | Optional |

Global: dark/light/system toggle, Cmd+K palette, page transitions, OG images, RSS, sitemap.

## 7. Decisions needed before building

1. Path: custom Next.js build (recommended, 4-6 weekends to a polished v1) vs fork Magic Portfolio (1 weekend to launch, restyle later).
2. Visual direction: calm and editorial (Spotlight, rauno.me) vs expressive with scroll scenes (Aceternity, Awwwards). Recommendation: calm base with one signature moment on the home hero.
3. Who writes the code: the my-experiments rule is "Sidharth runs everything". Does that apply here, or should Claude write the frontend and Sidharth review?
4. Domain name and whether to buy now.
5. Content inventory: projects to feature, resume data, first roadmap items, first progress journey (Postgres course is the obvious one).

## Sources

- Templates: [adminlte Next.js list](https://adminlte.io/blog/nextjs-portfolio-templates/), [adminlte React list](https://adminlte.io/blog/react-portfolio-templates/), [adminlte Astro list](https://adminlte.io/blog/free-astro-templates/), [ArcPixel 15 repos](https://arcpixel.io/blog/portfolio-website-github-repos), [GitHub topic portfolio-template](https://github.com/topics/portfolio-template), [GitHub topic portfolio (Astro)](https://github.com/topics/portfolio?l=astro), [Vercel Magic Portfolio](https://vercel.com/templates/portfolio/magic-portfolio-for-next-js), [Once UI Magic Portfolio](https://once-ui.com/products/magic-portfolio), [Tailwind Plus](https://tailwindcss.com/plus), [Aceternity templates](https://ui.aceternity.com/website-templates), [Aceternity pricing](https://ui.aceternity.com/pricing), [shadcn-portfolio](https://dev.to/jqueryscript/shadcn-portfolio-nextjs-developer-portfolio-template-with-shadcnui-8ge), [astro-starter-portfolio](https://astro.build/themes/details/astro-starter-portfolio/), [Astrofy](https://github.com/manuelernestog/astrofy), [career-portfolio-template](https://github.com/nbakh16/career-portfolio-template)
- Inspiration: [Colorlib developer portfolios](https://colorlib.com/wp/developer-portfolios/), [iTechGuides](https://www.itechguides.com/21-best-developer-portfolio-examples-to-study-in-2026/), [linkfolio](https://linkfolio.cv/blog/developer-portfolio-examples-that-got-hired-2026), [OneHour backend portfolios](https://onehour.digital/inspiration/backend-developer-portfolio-examples), [Nucamp backend projects](https://www.nucamp.co/blog/top-10-backend-portfolio-projects-for-2026-that-actually-get-you-hired), [Sitebuilder Report](https://www.sitebuilderreport.com/inspiration/software-engineer-portfolios), [rauno.me](https://rauno.me/), [emilkowal.ski](https://emilkowal.ski/), [Awwwards transitions](https://www.awwwards.com/inspiration_search/transitions/), [Codrops: Joffrey Spitzer Astro + GSAP](https://tympanus.net/codrops/2026/02/18/joffrey-spitzer-portfolio-a-minimalist-astro-gsap-build-with-reveals-flip-transitions-and-subtle-motion/)
- Stack: [Astro vs Next.js 2026](https://www.kunalganglani.com/blog/astro-vs-nextjs-2026.md), [eastondev comparison](https://eastondev.com/blog/en/posts/dev/20251202-astro-vs-nextjs-static-site/), [LogRocket](https://blog.logrocket.com/astro-vs-next-js-ssg-vs-react/), [GSAP pricing](https://gsap.com/pricing/), [Magic UI alternatives](https://designrevision.com/alternatives/magic-ui), [React Bits](https://bestofjs.org/projects/react-bits), [Motion Primitives](https://21st.dev/@ibelick/library/motion-primitives), [GitHub contribution components](https://21st.dev/community/components/s/contribution-graph.md)
- Patterns: [Now page concept](https://concepts.dsebastien.net/concept/now-page), [sive.rs/now](https://sive.rs/now3), [Public roadmap guide](https://www.pravinkumar.co/blog/how-to-write-a-public-roadmap-page-for-prospects-2026), [Roadmap and changelog examples](https://divbyzero.com/tools/saas/examples/c/roadmap-changelog-page/), [Quartz digital garden](https://prg.sh/ramblings/What-is-a-digital-garden-and-how-am-i-using-it)
- Hosting: [Cloudflare Pages vs Workers 2026](https://mecanik.dev/en/posts/cloudflare-pages-vs-workers-which-to-use-in-2026/), [Flavio Copes on Pages vs Workers](https://flaviocopes.com/cloudflare-pages-vs-workers/), [Wrangler deprecations](https://developers.cloudflare.com/workers/wrangler/deprecations/), [Appwrite free static hosting](https://appwrite.io/blog/post/best-free-static-website-hosting), [Jamstack hosts 2026](https://guptadeepak.com/tools/top-5-static-site-hosting-jamstack-platforms-2026/)
- No-code: [Webflow vs Framer 2026](https://www.pravinkumar.co/blog/webflow-vs-framer-honest-comparison-2026), [Framer vs Webflow](https://www.framer.com/compare/framer-vs-webflow), [Framer portfolio templates 2026](https://wannathis.one/blog/best-framer-portfolio-templates-2026)
