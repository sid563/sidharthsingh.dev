import type { Metadata } from "next";
import { Container } from "@/components/container";
import { JourneyCard } from "@/components/journey-card";
import { PageHeader } from "@/components/page-header";
import { SpotlightGroup } from "@/components/spotlight";
import { getProgress } from "@/lib/content";
import { getContributions } from "@/lib/github";
import { ActivityGrid } from "@/components/activity-grid";
import { site } from "@/data/site";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Progress",
  description:
    "Learning in public: each journey has a target, milestones and a dated log, with honest percentages.",
};

export default async function ProgressPage() {
  const journeys = getProgress();
  const contributions = await getContributions(site.githubUser);

  const active = journeys.filter((j) => j.data.status === "in-progress").length;
  const milestonesDone = journeys.reduce(
    (sum, j) => sum + j.data.milestones.filter((m) => m.done).length,
    0,
  );
  const milestonesTotal = journeys.reduce((sum, j) => sum + j.data.milestones.length, 0);
  const updated = journeys.map((j) => j.data.updated).sort().at(-1);

  return (
    <Container>
      <PageHeader
        eyebrow="Progress"
        title="Learning in public"
        description="Each journey has a target, a set of milestones and a dated log. The percentages are self-assessments, kept deliberately honest, and they move slowly."
      />

      {journeys.length === 0 ? (
        <p className="pb-16 text-muted-foreground">No journeys tracked yet.</p>
      ) : (
        <div className="pb-16">
          <dl className="grid gap-4 sm:grid-cols-3">
            <StatTile label="Active journeys" value={String(active)} />
            <StatTile
              label="Milestones completed"
              value={`${milestonesDone} / ${milestonesTotal}`}
            />
            <StatTile label="Last updated" value={updated ? formatDate(updated) : "—"} />
          </dl>

          <SpotlightGroup className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {journeys.map((journey) => (
              <JourneyCard key={journey.slug} slug={journey.slug} journey={journey.data} />
            ))}
          </SpotlightGroup>

          {contributions ? (
            <section aria-labelledby="activity-heading" className="mt-16">
              <p className="mb-2 font-mono text-xs tracking-wider text-brand uppercase">GitHub</p>
              <h2 id="activity-heading" className="text-2xl font-semibold tracking-tight">
                Commits in public
              </h2>
              <p className="mt-2 max-w-xl text-muted-foreground">
                The same calendar as the GitHub profile, refreshed with every deploy.
              </p>
              <div className="mt-6">
                <ActivityGrid data={contributions} user={site.githubUser} />
              </div>
            </section>
          ) : null}
        </div>
      )}
    </Container>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <dt className="text-xs font-medium tracking-wider text-muted-foreground uppercase">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{value}</dd>
    </div>
  );
}
