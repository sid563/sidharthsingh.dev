import GithubSlugger from "github-slugger";

export type TocHeading = { id: string; text: string; depth: 2 | 3 };

/**
 * Headings (h2, h3) from an MDX source, with the same ids rehype-slug will
 * give them: github-slugger over the heading's plain text. Fenced code is
 * skipped so a `## comment` inside a snippet never becomes a section.
 */
export function extractToc(source: string): TocHeading[] {
  const slugger = new GithubSlugger();
  const headings: TocHeading[] = [];
  let inFence = false;

  for (const raw of source.split("\n")) {
    const line = raw.trimEnd();
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;
    const text = match[2]
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .trim();
    headings.push({ id: slugger.slug(text), text, depth: match[1].length as 2 | 3 });
  }
  return headings;
}
