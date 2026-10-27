import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import { mdxComponents } from "@/components/mdx-components";

/**
 * Code blocks are highlighted at build time by shiki, with both themes baked
 * into CSS variables so the theme toggle needs no re-render. Vesper's warm
 * accents sit close to the site's brand colour in dark mode.
 */
const prettyCode: PrettyCodeOptions = {
  theme: { light: "github-light", dark: "vesper" },
  keepBackground: false,
  defaultLang: "text",
};

/** Compile an MDX body (from a content collection) into React nodes. */
export async function renderMDX(source: string) {
  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      // Content is authored in this repo, so JSX expression props such as
      // <Diagram nodes={[...]}> are allowed. The guard against eval/process
      // style calls stays on; nothing in /content should ever need them.
      blockJS: false,
      blockDangerousJS: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
          [rehypePrettyCode, prettyCode],
        ],
      },
    },
  });
  return content;
}
