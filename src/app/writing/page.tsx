import type { Metadata } from "next";
import { getAllTags, getPosts } from "@/lib/content";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { WritingList } from "@/components/writing-list";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Notes and essays on backends, databases, concurrency and learning in public.",
};

export default function WritingPage() {
  const posts = getPosts();
  const tags = getAllTags();

  return (
    <Container>
      <PageHeader
        eyebrow="Writing"
        title="Notes and essays"
        description="Longer-form thinking on backends, databases, concurrency and learning in public. Short notes when a short note will do."
      />
      <WritingList posts={posts} tags={tags} />
    </Container>
  );
}
