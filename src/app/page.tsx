import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { FadeIn, FadeInItem, FadeInStagger } from "@/components/fade-in";
import { ProjectCard } from "@/components/project-card";
import { PostCard } from "@/components/post-card";
import { Hero } from "@/components/home/hero";
import { NowBento } from "@/components/home/now-bento";
import { ExpertiseSnapshot } from "@/components/home/expertise-snapshot";
import { ContactCta } from "@/components/home/contact-cta";
import { getFeaturedProjects, getPage, getPosts, getProgress, getProjects } from "@/lib/content";

export default function HomePage() {
  const projects = getProjects();
  const featured = getFeaturedProjects();
  const posts = getPosts().slice(0, 3);
  const journeys = getProgress();
  const current = projects.find((p) => p.data.status === "in-progress") ?? projects[0] ?? null;
  const now = getPage("now");

  return (
    <>
      <Hero />
      <Container>
        <Section
          eyebrow="Now"
          title="Right now"
          description="A live snapshot of what I am building, learning and writing, pulled from the same files that power the rest of the site."
          href="/now"
          hrefLabel="Now page"
        >
          <NowBento
            now={now}
            project={current}
            journey={journeys[0] ?? null}
            journeys={journeys}
            post={posts[0] ?? null}
          />
        </Section>

        {featured.length > 0 ? (
          <Section
            eyebrow="Selected work"
            title="Featured work"
            description="Systems I owned end to end. Each one has the constraints, the approach and what actually shipped."
            href="/projects"
          >
            <FadeInStagger className="grid gap-4 md:grid-cols-2">
              {featured.map((project, index) => (
                <FadeInItem
                  key={project.slug}
                  className={
                    index === 0 || (featured.length % 2 === 0 && index === featured.length - 1)
                      ? "md:col-span-2"
                      : undefined
                  }
                >
                  <ProjectCard project={project} featured={index === 0} />
                </FadeInItem>
              ))}
            </FadeInStagger>
          </Section>
        ) : null}

        {posts.length > 0 ? (
          <Section
            eyebrow="Writing"
            title="Recent writing"
            description="Notes from learning in public: databases, concurrency, and the occasional post about this site."
            href="/writing"
          >
            <FadeIn>
              <div className="space-y-1">
                {posts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </FadeIn>
          </Section>
        ) : null}

        <ExpertiseSnapshot />
        <ContactCta />
      </Container>
    </>
  );
}
